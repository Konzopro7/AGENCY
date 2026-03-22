import { useState } from "react";
import { Icon } from "./icons.jsx";

export function SocialIcon({ network, src, size = 18, className = "" }) {
  const [imageError, setImageError] = useState(false);

  return (
    <span className={`social-icon ${className}`.trim()} aria-hidden="true">
      {!imageError ? (
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
        />
      ) : (
        <Icon name={network} size={size} />
      )}
    </span>
  );
}
