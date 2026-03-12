'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ImageIcon,
  RefreshCcw,
  Star,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface UserReview {
  id: string;
  packageId: string;
  packageName: string;
  packageSlug: string;
  packageImage: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
  isVerified: boolean;
  images: { id: string; url: string }[];
}

function useUserReviews() {
  return useQuery<UserReview[]>({
    queryKey: ['user-reviews'],
    queryFn: async () => {
      const { data } = await axios.get('/api/user/reviews');
      return data;
    },
  });
}

function useDeleteReview() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/user/reviews?id=${id}`);
      return data;
    },
    onSuccess: () => toast.success('Review deleted successfully'),
    onError: () => toast.error('Failed to delete review'),
  });
}

// ── Star row ──────────────────────────────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey: star icons are positional
          key={i}
          className={cn(
            'w-3.5 h-3.5',
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-muted text-muted',
          )}
        />
      ))}
      <span className='ml-1 text-xs font-semibold tabular-nums text-foreground'>
        {rating}.0
      </span>
    </div>
  );
}

// ── Review card ───────────────────────────────────────────────────────────────
function ReviewCard({
  review,
  onDelete,
}: {
  review: UserReview;
  onDelete: (id: string) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className='group rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-300'>
        {/* Cover image */}
        <div className='relative h-44 overflow-hidden'>
          <Image
            src={review.packageImage}
            alt={review.packageName}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-700'
          />
          <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />

          {/* Status pills — top right */}
          <div className='absolute top-3 right-3 flex flex-col items-end gap-1.5'>
            {review.approved ? (
              <span className='inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.15em] uppercase bg-green-500/90 text-white px-2.5 py-1 rounded-full backdrop-blur-sm'>
                <CheckCircle2 className='w-3 h-3' />
                Approved
              </span>
            ) : (
              <span className='inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.15em] uppercase bg-black/50 text-white/80 px-2.5 py-1 rounded-full backdrop-blur-sm'>
                <Clock className='w-3 h-3' />
                Pending
              </span>
            )}
            {review.isVerified && (
              <span className='inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.15em] uppercase bg-primary/90 text-white px-2.5 py-1 rounded-full backdrop-blur-sm'>
                <CheckCircle2 className='w-3 h-3' />
                Verified
              </span>
            )}
          </div>

          {/* Package name — bottom */}
          <div className='absolute bottom-0 left-0 right-0 p-4'>
            <div className='flex items-center gap-2 mb-1'>
              <div className='h-px w-5 bg-white/50' />
              <span className='text-[10px] font-semibold tracking-[0.18em] uppercase text-white/60'>
                Package
              </span>
            </div>
            <Link
              href={`/packages/${review.packageSlug}`}
              className='font-bold text-white text-base leading-snug hover:text-primary transition-colors line-clamp-1'
            >
              {review.packageName}
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className='p-5 space-y-4'>
          {/* Rating + date */}
          <div className='flex items-center justify-between'>
            <StarRow rating={review.rating} />
            <span className='text-[11px] text-muted-foreground'>
              {format(new Date(review.date), 'MMM d, yyyy')}
            </span>
          </div>

          {/* Comment */}
          <p className='text-sm text-muted-foreground leading-relaxed line-clamp-3'>
            {review.comment}
          </p>

          {/* Photos count */}
          {review.images.length > 0 && (
            <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
              <ImageIcon className='w-3.5 h-3.5 shrink-0' />
              <span>
                {review.images.length}{' '}
                {review.images.length === 1 ? 'photo' : 'photos'} attached
              </span>
            </div>
          )}

          {/* Delete */}
          <div className='pt-3 border-t border-border'>
            <button
              type='button'
              onClick={() => setShowDeleteDialog(true)}
              className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors'
            >
              <Trash2 className='w-3.5 h-3.5' />
              Delete review
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(review.id)}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ReviewsSkeleton() {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton is positional
          key={i}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <Skeleton className='h-44 w-full rounded-none' />
          <div className='p-5 space-y-3'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-3.5 w-24' />
              <Skeleton className='h-3 w-16' />
            </div>
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-4/5' />
            <Skeleton className='h-3 w-2/3' />
            <div className='pt-3 border-t border-border'>
              <Skeleton className='h-3 w-20' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-24 text-center'>
      <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5'>
        <Star className='w-7 h-7 text-primary' />
      </div>
      <div className='flex items-center gap-3 justify-center mb-3'>
        <div className='h-px w-8 bg-primary' />
        <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
          No Reviews
        </span>
        <div className='h-px w-8 bg-primary' />
      </div>
      <h2 className='text-xl font-bold mb-2'>Nothing here yet</h2>
      <p className='text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed'>
        After your trips, share your experience by reviewing the packages you've
        booked. Your reviews will appear here.
      </p>
      <Button asChild>
        <Link href='/packages'>Explore Packages</Link>
      </Button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MyReviewsPage() {
  const { data: reviews, isPending, isError, refetch } = useUserReviews();
  const deleteReview = useDeleteReview();

  const handleDelete = (id: string) => {
    deleteReview.mutate(id, { onSuccess: () => refetch() });
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ── */}
      <section className='relative border-b border-border bg-primary/5 overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-3xl font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          REVIEWS
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              My Account
            </span>
          </div>
          <div className='flex items-end justify-between gap-4'>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight'>
              My{' '}
              <span className='italic font-light text-muted-foreground'>
                reviews
              </span>
              <span className='text-primary'>.</span>
            </h1>
            {!isPending && !isError && !!reviews?.length && (
              <p className='text-sm text-muted-foreground mb-1 tabular-nums shrink-0'>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className='max-w-7xl mx-auto py-10'>
        {isPending ? (
          <ReviewsSkeleton />
        ) : isError ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5'>
              <AlertTriangle className='w-7 h-7 text-destructive' />
            </div>
            <div className='flex items-center gap-3 justify-center mb-3'>
              <div className='h-px w-8 bg-destructive/40' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-destructive/70'>
                Error
              </span>
              <div className='h-px w-8 bg-destructive/40' />
            </div>
            <h2 className='text-xl font-bold mb-2'>Failed to load reviews</h2>
            <p className='text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed'>
              Something went wrong while fetching your reviews. Please try
              again.
            </p>
            <Button
              variant='outline'
              onClick={() => refetch()}
              className='gap-2'
            >
              <RefreshCcw className='w-4 h-4' />
              Try again
            </Button>
          </div>
        ) : reviews?.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
