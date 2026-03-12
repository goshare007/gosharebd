'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarRating } from './star-rating';

interface ReviewStatsProps {
  averageRating: number | null;
  reviewCount: number;
  ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  className?: string;
}

export function ReviewStats({
  averageRating,
  reviewCount,
  ratingDistribution,
  className,
}: ReviewStatsProps) {
  const maxCount = Math.max(...Object.values(ratingDistribution), 1);
  const avg = averageRating ?? 0;

  return (
    <div className={cn('rounded-2xl border-2 border-border p-6', className)}>
      {/* Eyebrow */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='h-px w-8 bg-primary' />
        <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
          Guest Reviews
        </span>
      </div>

      <div className='flex items-center gap-8'>
        {/* Score */}
        <div className='text-center shrink-0'>
          <div className='text-5xl font-bold tabular-nums text-primary'>
            {avg.toFixed(1)}
          </div>
          <StarRating
            rating={Math.round(avg)}
            size='sm'
            className='justify-center mt-2'
          />
          <p className='text-xs text-muted-foreground mt-2 tracking-wide'>
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Divider */}
        <div className='w-px self-stretch bg-border' />

        {/* Distribution bars */}
        <div className='flex-1 space-y-2'>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count =
              ratingDistribution[stars as keyof typeof ratingDistribution];
            const width = reviewCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={stars} className='flex items-center gap-3'>
                <span className='text-xs text-muted-foreground w-3 shrink-0'>
                  {stars}
                </span>
                <Star className='w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0' />
                <div className='flex-1 h-1.5 bg-secondary rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-yellow-400 rounded-full transition-all duration-700'
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className='text-xs text-muted-foreground w-6 text-right shrink-0'>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
