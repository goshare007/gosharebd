'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const displayRating = interactive ? hoverRating || rating : rating;

  if (interactive) {
    return (
      <span className={cn('flex items-center gap-0.5', className)}>
        {Array.from({ length: maxRating }).map((_, index) => {
          const value = index + 1;
          const isFilled = value <= displayRating;
          const key = `star-${value}`;

          return (
            <button
              key={key}
              type='button'
              onClick={() => onRatingChange?.(value)}
              onMouseEnter={() => setHoverRating(value)}
              className='cursor-pointer hover:scale-110 transition-transform duration-150'
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted',
                )}
              />
            </button>
          );
        })}
      </span>
    );
  }

  return (
    <span className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const value = index + 1;
        const isFilled = value <= rating;
        const key = `star-static-${value}`;

        return (
          <Star
            key={key}
            className={cn(
              sizeClasses[size],
              isFilled
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-muted text-muted',
            )}
          />
        );
      })}
    </span>
  );
}
