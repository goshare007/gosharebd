import { useCallback, useEffect, useRef, useState } from 'react';

export function useInfiniteScroll<T>({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  threshold = 0.1,
}: {
  data: T[] | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  threshold?: number;
}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin: '100px',
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return { loadMoreRef, isFetchingNextPage };
}

export function useDebouncedInfiniteScroll({
  onEndReached,
  delay = 200,
}: {
  onEndReached: () => void;
  delay?: number;
}) {
  const [isNearBottom, setIsNearBottom] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isNear = distanceFromBottom < 300;

      setIsNearBottom(isNear);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isNear) {
        timeoutRef.current = setTimeout(() => {
          onEndReached();
        }, delay);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onEndReached, delay]);

  return isNearBottom;
}
