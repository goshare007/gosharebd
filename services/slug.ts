import { useQuery } from '@tanstack/react-query';

async function checkSlugUniqueness(slug: string): Promise<boolean> {
  const res = await fetch(
    `/api/packages/check-slug?slug=${encodeURIComponent(slug)}`,
  );
  if (!res.ok) throw new Error('Failed to check slug');
  const data: { available: boolean } = await res.json();
  return data.available;
}

export function useCheckSlugUniqueness(slug: string) {
  return useQuery({
    queryKey: ['slug-check', slug],
    queryFn: () => checkSlugUniqueness(slug),
    enabled: slug.length >= 2,
    staleTime: 1000 * 30, // cache result for 30s — avoids re-checking the same slug
  });
}
