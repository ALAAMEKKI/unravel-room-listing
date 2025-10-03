export type MediaPick =
  | { type: "video"; src: string; poster?: string }
  | { type: "image"; src: string }
  | null;

export function pickVariantMediaFromRoom(room: any, variant: any): MediaPick {
  // variant-level video_url:
  const vUrl =
    variant?.video_url?.med ?? variant?.video_url?.url ?? variant?.video_url;
  if (vUrl) {
    // poster from variant.room_images if available, else from room properties
    const poster =
      variant?.room_images?.[0]?.image_urls?.[0] ??
      room?.properties?.room_images?.[0]?.image_urls?.[0];
    return { type: "video", src: vUrl, poster };
  }

  // variant-level images:
  const vImg = variant?.room_images?.[0]?.image_urls?.[0] ?? null;
  if (vImg) return { type: "image", src: vImg };

  // fallback to room-level:
  const rVideo =
    room?.properties?.video_url?.med ?? room?.properties?.video_url?.url;
  if (rVideo) {
    const poster = room?.properties?.room_images?.[0]?.image_urls?.[0];
    return { type: "video", src: rVideo, poster };
  }
  const rImg = room?.properties?.room_images?.[0]?.image_urls?.[0] ?? null;
  if (rImg) return { type: "image", src: rImg };

  return null;
}
