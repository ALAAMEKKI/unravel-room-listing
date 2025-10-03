import React, { useRef, useEffect, useState } from "react";

interface LazyVideoProps {
  src: string;       // Video source URL
  poster?: string;   // Fallback poster image
  className?: string;
}

/**
 * LazyVideo Component
 *
 * - Autoplays when at least 25% visible in the viewport.
 * - Pauses when scrolled out of view.
 * - Prevents unnecessary network usage by delaying <source> load until visible.
 * - Shows a skeleton placeholder until video is ready.
 */
const LazyVideo: React.FC<LazyVideoProps> = ({ src, poster, className }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVisible, setIsVisible] = useState(false); // track viewport visibility
  const [loaded, setLoaded] = useState(false);       // track when video data is loaded

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (videoRef.current) {
              videoRef.current.muted = true; // ensure autoplay works
              videoRef.current.play().catch(() => {});
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.25 } // video must be 25% visible to trigger
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div className={`lazy-video-container ${className || ""}`}>
      {/* Skeleton placeholder until video loads */}
      {!loaded && <div className="skeleton skeleton-video"></div>}

      <video
        ref={videoRef}
        poster={poster}
        muted
        loop
        controls
        playsInline
        preload="none" // don't preload until visible
        className={`video-element ${loaded ? "loaded" : ""}`}
        onLoadedData={() => setLoaded(true)}
      >
        {/* Only attach video src when visible to optimize performance */}
        {isVisible && <source src={src} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default React.memo(LazyVideo);
