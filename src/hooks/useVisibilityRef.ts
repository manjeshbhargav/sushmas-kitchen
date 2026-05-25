import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element becomes visible in the viewport using IntersectionObserver.
 * Resets the visibility state when the optional triggerKey changes.
 */
export function useVisibilityRef<T extends HTMLElement>(triggerKey?: string) {
  const [prevKey, setPrevKey] = useState(triggerKey);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  // Sync state directly during the render phase when triggerKey changes
  if (triggerKey !== prevKey) {
    setPrevKey(triggerKey);
    setIsVisible(false);
  }

  useEffect(() => {
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [isVisible, triggerKey]);

  return [ref, isVisible] as const;
}
