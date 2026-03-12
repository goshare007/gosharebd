'use client';

import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ReviewType } from '@/types/review';
import { StarRating } from './star-rating';

interface ReviewCardProps {
  review: ReviewType;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const timeAgo = formatDistanceToNow(new Date(review.date), {
    addSuffix: true,
  });
  const images = review.images ?? [];

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null));
  const next = () =>
    setLightboxIndex((i) =>
      i !== null ? Math.min(images.length - 1, i + 1) : null,
    );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  return (
    <>
      <div
        className={cn(
          'group rounded-2xl border border-border p-6 hover:border-primary/30 hover:bg-primary/2 transition-all duration-300',
          className,
        )}
      >
        <div className='flex items-start gap-4'>
          <Avatar className='w-11 h-11 shrink-0 border border-border'>
            <AvatarImage src={review.avatar || undefined} alt={review.name} />
            <AvatarFallback className='text-sm font-semibold bg-primary/10 text-primary'>
              {review.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 min-w-0'>
            {/* Header */}
            <div className='flex items-start justify-between gap-2 flex-wrap mb-2'>
              <div>
                <div className='flex items-center gap-2'>
                  <h4 className='font-semibold text-sm'>{review.name}</h4>
                  {review.isVerified && (
                    <span className='inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.15em] uppercase text-green-600 dark:text-green-400'>
                      <CheckCircle2 className='w-3 h-3' />
                      Verified
                    </span>
                  )}
                </div>
                <div className='flex items-center gap-2 mt-1'>
                  <StarRating rating={review.rating} size='sm' />
                  <div className='h-px w-4 bg-border' />
                  <span className='text-[11px] text-muted-foreground'>
                    {timeAgo}
                  </span>
                </div>
              </div>

              <div className='flex items-center bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0'>
                <span className='text-xs font-bold'>{review.rating}.0</span>
              </div>
            </div>

            {/* Comment */}
            <p className='text-sm text-muted-foreground leading-relaxed mt-3'>
              {review.comment}
            </p>

            {/* Images */}
            {images.length > 0 && (
              <div className='mt-4 flex gap-2 flex-wrap'>
                {images.map((image, idx) => (
                  <button
                    key={image.id}
                    type='button'
                    onClick={() => openLightbox(idx)}
                    className='relative w-20 h-20 rounded-xl overflow-hidden border border-border group/img hover:border-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50'
                  >
                    <Image
                      src={image.url}
                      alt={`Review photo ${idx + 1}`}
                      fill
                      className='object-cover group-hover/img:scale-105 transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-200' />
                    {images.length > 3 && idx === 2 && (
                      <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                        <span className='text-white text-sm font-bold'>
                          +{images.length - 2}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && images.length > 0 && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200'
          onClick={closeLightbox}
          role='dialog'
          aria-modal='true'
          onKeyDown={handleKeyDown}
        >
          {/* Close */}
          <button
            type='button'
            onClick={closeLightbox}
            className='absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10'
          >
            <X className='w-4 h-4' />
          </button>

          {/* Counter */}
          <div className='absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/60 tabular-nums'>
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className='absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
          )}

          {/* Image */}
          {/** biome-ignore lint/a11y/noStaticElementInteractions: this is fine */}
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: this is fine */}
          <div
            className='relative w-full max-w-3xl max-h-[80vh] mx-6 rounded-2xl overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={`Review photo ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className='object-contain w-full h-full max-h-[80vh]'
            />
          </div>

          {/* Next */}
          {lightboxIndex < images.length - 1 && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className='absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5'>
              {images.map((_, idx) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: dot indicators
                  key={idx}
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                  }}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-200',
                    idx === lightboxIndex ? 'bg-white w-4' : 'bg-white/40',
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
