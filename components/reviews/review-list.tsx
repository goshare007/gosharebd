'use client';

import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { usePackageReviews } from '@/services/review';
import type { PackageReviewsType } from '@/types/review';
import { ReviewCard } from './review-card';
import { ReviewForm } from './review-form';
import { ReviewStats } from './review-stats';

interface ReviewListProps {
  slug: string;
  packageId: string;
  className?: string;
}

export function ReviewList({ slug, packageId, className }: ReviewListProps) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: session } = useSession();
  const { data, isPending, isError, refetch } = usePackageReviews(
    slug,
    page,
    limit,
  );

  if (isPending) {
    return (
      <div className={className}>
        <Skeleton className='h-36 w-full mb-6 rounded-2xl' />
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
            <Skeleton key={i} className='h-36 w-full rounded-2xl' />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={className}>
        <div className='rounded-2xl border-2 border-border p-12 text-center'>
          <MessageSquare className='w-10 h-10 mx-auto text-muted-foreground mb-3' />
          <p className='text-sm font-medium'>Failed to load reviews</p>
          <p className='text-xs text-muted-foreground mt-1'>
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const { reviews, stats } = data as PackageReviewsType;

  // Check if logged-in user already submitted a review
  const hasReviewed = session
    ? reviews.some((r) => r.userId === session.user.id)
    : false;

  return (
    <div className={className}>
      {/* ── Write a review ── */}
      {
        !session ? (
          // Not logged in
          <div className='mb-6 rounded-2xl border-2 border-border p-6 flex items-center gap-4'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
              <MessageSquare className='w-5 h-5 text-primary' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold'>
                Have you been on this tour?
              </p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                <a
                  href='/sign-in'
                  className='text-primary font-medium hover:underline'
                >
                  Sign in
                </a>{' '}
                to share your experience and help other travelers.
              </p>
            </div>
          </div>
        ) : !hasReviewed ? (
          // Logged in, no review yet — show form directly
          <div className='mb-8 rounded-2xl border-2 border-primary/20 bg-primary/2 p-6'>
            <ReviewForm packageId={packageId} onSuccess={() => refetch()} />
          </div>
        ) : null /* Already reviewed — show nothing above the list */
      }

      {/* ── Empty state ── */}
      {reviews.length === 0 && (
        <div className='rounded-2xl border-2 border-border p-12 text-center'>
          <MessageSquare className='w-10 h-10 mx-auto text-muted-foreground mb-3' />
          <p className='text-sm font-medium mb-1'>No reviews yet</p>
          <p className='text-xs text-muted-foreground'>
            Be the first to share your experience!
          </p>
        </div>
      )}

      {/* ── Reviews ── */}
      {reviews.length > 0 && (
        <>
          <ReviewStats
            averageRating={stats.averageRating}
            reviewCount={stats.reviewCount}
            ratingDistribution={stats.ratingDistribution}
            className='mb-6'
          />

          <div className='space-y-3'>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div className='flex items-center justify-center gap-3 mt-8'>
              <button
                type='button'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className='text-xs px-4 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 disabled:opacity-40 disabled:pointer-events-none transition-all'
              >
                Previous
              </button>
              <span className='text-xs text-muted-foreground tabular-nums'>
                {page} / {data.pagination.totalPages}
              </span>
              <button
                type='button'
                onClick={() =>
                  setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                }
                disabled={page === data.pagination.totalPages}
                className='text-xs px-4 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 disabled:opacity-40 disabled:pointer-events-none transition-all'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
