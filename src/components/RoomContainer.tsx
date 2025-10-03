import { useState } from "react";
import { pickVariantMediaFromRoom, type MediaPick } from "../utils/mediaUtils";
import LazyVideo from "./Media/LazyVideo";
import LazyImage from "./Media/LazyImage";
import Slider, { Settings } from "react-slick";
import VariantCard from "./VariantCard";

/**
 * RoomContainer
 * ------------------------
 * Displays a single room with:
 *  - Room name
 *  - Room-level media (video preferred > image fallback)
 *  - Variants (initially 2 visible, expandable to all)
 * 
 * Implements:
 *  - Media optimization: lazy load images, only play video when visible
 *  - Expand/collapse for variants
 *  - Reusable structure: media + variant cards
 */
export default function RoomContainer({ room }: { room: any }) {
  const [expanded, setExpanded] = useState(false);

  // Get variants of this room
  const variants = room?.variants || [];
  const visibleVariants = expanded ? variants : variants.slice(0, 2);

  // Pick media for the room (video > image > fallback)
  const media: MediaPick = pickVariantMediaFromRoom(room, null);

  // Extract room-level images (fallback if no video)
  const images =
    room?.properties?.room_images?.flatMap(
      (img: any) => img?.image_urls || []
    ) || [];

  // React Slick settings for image carousel
  const sliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="room-container">
      {/* Room Title */}
      <h2 className="room-name">{room?.name}</h2>

      {/* Media Section: Prefer video > image > none */}
      {media?.type === "video" ? (
        <LazyVideo src={media.src} poster={media.poster} />
      ) : media?.type === "image" ? (
        <Slider {...sliderSettings} className="image-slider">
          {images.map((url: string, idx: number) => (
            <div key={idx}>
              <LazyImage
                src={url}
                alt={`Room Image ${idx}`}
                srcSet={`${url}?w=400 400w, ${url}?w=800 800w, ${url}?w=1200 1200w`}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="no-media">No media available</div>
      )}

      {/* Variants List (2 initially, expandable) */}
      <div className="variants-list">
        {visibleVariants.map((variant: any, idx: number) => (
          <VariantCard key={idx} variant={variant} />
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {variants.length > 2 && (
        <button
          className="toggle-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Click to see less" : "Click to see more"}
        </button>
      )}
    </div>
  );
}
