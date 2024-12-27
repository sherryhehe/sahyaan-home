"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Loading from "@/components/Loading";

const APP_SCHEME = "sahyaan-shopping";
const APP_PACKAGE = "com.sahyaan.app";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf";

export default function DeepLinkPage() {
  const { slug }: { slug: string } = useParams();
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function fetchSellerId() {
    if (!slug || typeof slug !== "string") {
      console.error("Invalid slug:", slug);
      setLoading(false);
      return null;
    }

    try {
      console.log(decodeURIComponent(slug));
      const q = query(
        collection(db, "seller"),
        where("name", "==", decodeURIComponent(slug)),
        limit(1),
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        setId(firstDoc.id);
        return firstDoc.id;
      } else {
        console.log("No matching documents found.");
        setId("0");
        setLoading(false);
        return null;
      }
    } catch (error) {
      console.error("Error fetching document:", error);

      setId("0");
      setLoading(false);
      return null;
    }
  }

  useEffect(() => {
    if (!slug) return;

    fetchSellerId();
  }, [slug]);

  useEffect(() => {
    if (!id) return;

    const openApp = async () => {
      const deepLink = `${APP_SCHEME}://seller/${id}`;
      let hasRedirected = false;

      const checkAppInstalled = () => {
        return new Promise((resolve) => {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          document.body.appendChild(iframe);

          const timeoutId = setTimeout(() => {
            if (!hasRedirected) {
              hasRedirected = true;
              document.body.removeChild(iframe);
              resolve(false);
            }
          }, 3000);

          const handleBlur = () => {
            clearTimeout(timeoutId);
            if (!hasRedirected) {
              hasRedirected = true;
              document.body.removeChild(iframe);
              resolve(true);
            }
          };

          window.addEventListener("blur", handleBlur);

          try {
            iframe.contentWindow.location.href = deepLink;
            setTimeout(() => {
              if (!hasRedirected) {
                window.location.href = deepLink;
              }
            }, 100);
          } catch (e) {
            if (!hasRedirected) {
              window.location.href = deepLink;
            }
          }

          return () => {
            window.removeEventListener("blur", handleBlur);
            clearTimeout(timeoutId);
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          };
        });
      };

      try {
        const isAppInstalled = await checkAppInstalled();
        if (!isAppInstalled && !hasRedirected) {
          window.location.href = PLAY_STORE_URL;
        }
      } catch (error) {
        console.error("Error opening app:", error);
        if (!hasRedirected) {
          window.location.href = PLAY_STORE_URL;
        }
      }
    };

    openApp();
  }, [id]);

  if (loading) {
    return (
      <div className="flex w-screen h-screen bg-bg items-center justify-center">
        <div className="w-40 h-40">
          <Loading className="text-text w-32" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <meta property="al:android:package" content={APP_PACKAGE} />
        <meta
          property="al:android:url"
          content={`${APP_SCHEME}://seller/${id}`}
        />
        <meta property="al:android:app_name" content="Sahyaan Shopping" />
        <meta property="al:web:url" content={PLAY_STORE_URL} />
      </Head>
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Opening app...</p>
      </div>
    </div>
  );
}
