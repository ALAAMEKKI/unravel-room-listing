import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomsPage } from "../features/roomSlice";
import RoomContainer from "./RoomContainer";
import useOnScreen from "../hooks/useOnscreen";
import throttle from "lodash.throttle";

export default function RoomList() {
  const dispatch = useDispatch<any>();
  const { items, page, pageSize, hasMore, status, error } = useSelector(
    (s: any) => s.rooms
  );

  // Initial fetch: load first page on mount
  useEffect(() => {
    if (page === 0) dispatch(fetchRoomsPage({ page: 1, pageSize }));
  }, []); // eslint-disable-line to avoid dispatch warnings

  // Sentinel element for infinite scroll (600px prefetch margin)
  const [sentinelRef, onScreen] = useOnScreen<HTMLDivElement>({
    rootMargin: "600px",
  });

  // Throttled load-more function to prevent excessive requests
  const attemptLoad = useCallback(
    throttle(() => {
      if (status !== "loading" && hasMore) {
        dispatch(fetchRoomsPage({ page: page + 1, pageSize }));
      }
    }, 800),
    [status, hasMore, page, pageSize]
  );

  // When sentinel becomes visible, attempt to load next page
  useEffect(() => {
    if (onScreen) attemptLoad();
  }, [onScreen, attemptLoad]);

  return (
    <section className="container">
      {/* Initial skeleton screen while first page is loading */}
      {status === "loading" && page === 0 ? (
        <div className="skeleton-list">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton skeleton-room"></div>
          ))}
        </div>
      ) : (
        // Render room containers
        items.map((entry: any, index: number) => (
          <RoomContainer
            key={`${entry.room?.name}-${index}` || entry.id}
            room={entry.room}
          />
        ))
      )}

      {/* Sentinel (empty div used for intersection observer) */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* Footer section: loading spinner, errors, or end of list */}
      <div className="loading-footer">
        {status === "loading" && page > 0 && (
          <div className="spinner">
            <div className="spinner-circle"></div>
            <span>Loading more...</span>
          </div>
        )}

        {!hasMore && <div className="end-message">— End of results —</div>}

        {status === "failed" && (
          <div className="error-message">Error: {error}</div>
        )}
      </div>
    </section>
  );
}
