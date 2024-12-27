import React from "react";

function Loading({ className = "fill-bg", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 100 100"
      {...props}
      className={className}
    >
      <circle cx={6} cy={50} r={6} className={className}>
        <animate
          attributeName="opacity"
          begin={0.1}
          dur="1s"
          repeatCount="indefinite"
          values="0;1;0"
        />
      </circle>
      <circle cx={26} cy={50} r={6} className={className}>
        <animate
          attributeName="opacity"
          begin={0.2}
          dur="1s"
          repeatCount="indefinite"
          values="0;1;0"
        />
      </circle>
      <circle cx={46} cy={50} r={6} className={className}>
        <animate
          attributeName="opacity"
          begin={0.3}
          dur="1s"
          repeatCount="indefinite"
          values="0;1;0"
        />
      </circle>
    </svg>
  );
}

export default Loading;
