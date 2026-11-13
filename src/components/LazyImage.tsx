import { useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Gambar lazy dengan skeleton shimmer sampai selesai dimuat. */
export function LazyImage({ src, alt, className = "", eager }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-full w-full bg-bg-tertiary">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-white/5" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </div>
  );
}
