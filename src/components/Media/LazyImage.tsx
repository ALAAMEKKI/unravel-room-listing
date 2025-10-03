import { useState, useMemo } from "react";

interface LazyImageProps {
  src?: string;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  className?: string;
}

/**
 * LazyImage Component
 *
 * - Displays a skeleton placeholder until the image finishes loading.
 * - Uses native lazy-loading (`loading="lazy"`) and async decoding.
 * - Supports responsive images via `srcSet` and `sizes`.
 * - Optimized with useMemo to avoid unnecessary re-renders.
 */
export default function LazyImage({
  src,
  alt,
  srcSet,
  sizes,
  className,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Memoize image props to prevent re-creation on each render
  const imgProps = useMemo(
    () => ({
      src: src || "",
      srcSet,
      sizes:
        sizes ||
        "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px",
    }),
    [src, srcSet, sizes]
  );

  // If no src is provided, render nothing
  if (!src) return null;

  return (
    <div className={`lazy-image-container ${className || ""}`}>
      {/* Skeleton placeholder while image is loading */}
      {!loaded && <div className="skeleton skeleton-image"></div>}

      <img
        {...imgProps}
        alt={alt || ""}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`lazy-image image-style ${loaded ? "loaded" : ""}`}
      />
    </div>
  );
}
