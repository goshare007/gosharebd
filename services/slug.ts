import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

// ─── Packages ─────────────────────────────────────────────────────────────────

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
    staleTime: 1000 * 30,
  });
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

async function checkBlogSlugAvailability(slug: string): Promise<boolean> {
  const res = await fetch(
    `/api/admin/blog/check-slug?slug=${encodeURIComponent(slug)}`,
  );
  if (!res.ok) throw new Error('Failed to check slug');
  const data: { available: boolean } = await res.json();
  return data.available;
}

export function useCheckBlogSlug(slug: string, enabled = true) {
  const [debouncedSlug] = useDebounce(slug, 500);

  return useQuery({
    queryKey: ['blog-slug-check', debouncedSlug],
    queryFn: () => checkBlogSlugAvailability(debouncedSlug),
    enabled: enabled && (debouncedSlug?.length ?? 0) >= 2,
    staleTime: 1000 * 30,
  });
}
