import { useEffect, useRef, useState } from "react";

export default function useOnScreen<T extends Element>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [JSON.stringify(options)]);

  return [ref, isIntersecting] as const;
}
