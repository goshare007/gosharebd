'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useSubmitReview } from '@/services/review';
import { StarRating } from './star-rating';

const MAX_IMAGES = 3;
const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating'),
  comment: z
    .string()
    .min(10, 'Please write at least 10 characters')
    .max(500, 'Review must be less than 500 characters'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  packageId: string;
  onSuccess?: () => void;
  className?: string;
}

export function ReviewForm({
  packageId,
  onSuccess,
  className,
}: ReviewFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const { mutate: submitReview, isPending } = useSubmitReview();
  const ratingValue = watch('rating');

  const handleRatingChange = (rating: number) => {
    setValue('rating', rating, { shouldValidate: true });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length > MAX_IMAGES) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} photos`);
      return;
    }

    const oversized = files.filter((f) => f.size > MAX_SIZE_BYTES);
    if (oversized.length > 0) {
      toast.error(`Each photo must be under ${MAX_SIZE_MB} MB`);
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset input so selecting the same file again triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ReviewFormValues) => {
    submitReview(
      { packageId, rating: data.rating, comment: data.comment, images },
      {
        onSuccess: () => {
          reset();
          for (const url of imagePreviews) {
            URL.revokeObjectURL(url);
          }
          setImages([]);
          setImagePreviews([]);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-5', className)}
    >
      {/* Eyebrow */}
      <div className='flex items-center gap-3'>
        <div className='h-px w-8 bg-primary' />
        <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
          Your Experience
        </span>
      </div>

      {/* Rating */}
      <Field data-invalid={!!errors.rating}>
        <FieldLabel>Rating</FieldLabel>
        <div className='py-2'>
          <StarRating
            rating={ratingValue}
            interactive
            onRatingChange={handleRatingChange}
            size='lg'
          />
        </div>
        <FieldError errors={errors.rating ? [errors.rating] : undefined} />
      </Field>

      {/* Comment */}
      <Field data-invalid={!!errors.comment}>
        <FieldLabel>Your Review</FieldLabel>
        <Textarea
          {...register('comment')}
          placeholder='Share your experience with this tour...'
          rows={4}
          className='resize-none'
          aria-invalid={!!errors.comment}
        />
        <FieldError errors={errors.comment ? [errors.comment] : undefined} />
      </Field>

      {/* Image upload */}
      <div>
        <FieldLabel>
          Photos{' '}
          <span className='text-muted-foreground font-normal'>(optional)</span>
        </FieldLabel>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          className='hidden'
          onChange={handleImageSelect}
        />

        {imagePreviews.length > 0 && (
          <div className='flex gap-2 flex-wrap mb-3 mt-2'>
            {imagePreviews.map((preview, idx) => (
              <div
                key={`preview-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: previews are order-dependent
                  idx
                }`}
                className='relative w-20 h-20 rounded-xl overflow-hidden border border-border group/img'
              >
                <Image
                  src={preview}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className='object-cover'
                />
                <button
                  type='button'
                  onClick={() => removeImage(idx)}
                  className='absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors flex items-center justify-center'
                >
                  <X className='w-4 h-4 text-white opacity-0 group-hover/img:opacity-100 transition-opacity' />
                </button>
              </div>
            ))}
          </div>
        )}

        {imagePreviews.length < MAX_IMAGES && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => fileInputRef.current?.click()}
            className='gap-2 mt-2 hover:border-primary/30 hover:bg-primary/5'
          >
            <Upload className='w-4 h-4' />
            Add Photos
          </Button>
        )}

        <p className='text-xs text-muted-foreground mt-2'>
          {images.length}/{MAX_IMAGES} photos · max {MAX_SIZE_MB} MB each
        </p>
      </div>

      <Button
        type='submit'
        className='w-full h-11 gap-2 font-semibold'
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin' />
            Submitting…
          </>
        ) : (
          <>
            <Send className='w-4 h-4' />
            Submit Review
          </>
        )}
      </Button>

      <p className='text-xs text-center text-muted-foreground'>
        Reviews are visible after approval.{' '}
        <span className='text-primary font-medium'>Verified bookings</span> are
        highlighted.
      </p>
    </form>
  );
}
