'use client';

import { formatDate } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Camera,
  Download,
  MapPin,
  RefreshCw,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSinglePackageImages } from '@/services/gallery';

// Varied heights for the masonry skeleton grid
const SKELETON_HEIGHTS = [
  320, 420, 280, 380, 460, 300, 360, 440, 270, 400, 340, 480, 290, 370, 310,
  430,
];

function GalleryDetailSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Skeleton */}
      <section className='relative h-[60vh] md:h-[70vh] overflow-hidden bg-muted'>
        <Skeleton className='absolute inset-0 rounded-none' />

        {/* Back button placeholder */}
        <div className='absolute top-6 left-4 sm:left-6 lg:left-8 z-10'>
          <Skeleton className='h-9 w-36 rounded-md' />
        </div>

        {/* Title overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12'>
          <div className='max-w-7xl mx-auto space-y-4'>
            {/* Tags */}
            <div className='flex gap-2'>
              <Skeleton className='h-5 w-16 rounded-full' />
              <Skeleton className='h-5 w-20 rounded-full' />
            </div>
            {/* Title */}
            <div className='space-y-2'>
              <Skeleton className='h-10 w-2/3 bg-white/20' />
              <Skeleton className='h-10 w-1/2 bg-white/20' />
            </div>
            {/* Meta row */}
            <div className='flex flex-wrap gap-4'>
              <Skeleton className='h-4 w-28 bg-white/20' />
              <Skeleton className='h-4 w-32 bg-white/20' />
              <Skeleton className='h-4 w-24 bg-white/20' />
            </div>
          </div>
        </div>
      </section>

      {/* Description Skeleton */}
      <section className='py-12 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-11/12' />
            <Skeleton className='h-4 w-4/5' />
            <div className='flex gap-3 mt-6 pt-3'>
              <Skeleton className='h-9 w-32 rounded-md' />
              <Skeleton className='h-9 w-36 rounded-md' />
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid Skeleton */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
            {SKELETON_HEIGHTS.map((height, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <div key={i} className='break-inside-avoid mb-4'>
                <Skeleton
                  className='w-full rounded-xl'
                  style={{ height: `${height}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function GalleryDetailError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {/* Back button */}
      <div className='p-6'>
        <Button variant='outline' size='sm' asChild className='gap-2'>
          <Link href='/gallery'>
            <ArrowLeft className='w-4 h-4' />
            Back to Galleries
          </Link>
        </Button>
      </div>

      {/* Error content */}
      <div className='flex-1 flex items-center justify-center px-4'>
        <div className='max-w-md w-full text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6'>
            <AlertCircle className='w-8 h-8 text-destructive' />
          </div>
          <h2 className='text-2xl font-bold mb-2'>Failed to load gallery</h2>
          <p className='text-muted-foreground text-sm leading-relaxed mb-8'>
            {message ||
              'Something went wrong while fetching this gallery. Please try again.'}
          </p>
          <div className='flex items-center justify-center gap-3'>
            {onRetry && (
              <Button onClick={onRetry} className='gap-2'>
                <RefreshCw className='w-4 h-4' />
                Try again
              </Button>
            )}
            <Button variant='outline' asChild>
              <Link href='/gallery'>Browse all galleries</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { isPending, data, error, refetch } = useSinglePackageImages(slug);

  if (isPending) return <GalleryDetailSkeleton />;

  if (error)
    return (
      <GalleryDetailError
        message={error instanceof Error ? error.message : String(error)}
        onRetry={refetch}
      />
    );

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section with Cover Image */}
      <section className='relative h-[60vh] md:h-[70vh] overflow-hidden'>
        <Image
          src={data.images[0].url}
          alt={data.package.name}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black' />

        {/* Back Button */}
        <div className='absolute top-6 left-4 sm:left-6 lg:left-8 z-10'>
          <Button
            variant='outline'
            size='sm'
            asChild
            className='gap-2 bg-background/80 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white'
          >
            <Link href='/gallery'>
              <ArrowLeft className='w-4 h-4' />
              Back to Galleries
            </Link>
          </Button>
        </div>

        {/* Title Overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12'>
          <div className='max-w-7xl mx-auto'>
            <div className='space-y-4 animate-in fade-in slide-in-from-bottom duration-700'>
              {data.package.tags.length > 0 && (
                <div className='flex flex-wrap items-center gap-2'>
                  {data.package.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='capitalize bg-white/15 backdrop-blur-sm text-white border-white/20 hover:bg-white/25'
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl'>
                {data.package.name}
              </h1>

              <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80'>
                <div className='flex items-center gap-1.5'>
                  <MapPin className='w-4 h-4' />
                  {data.package.Location}
                </div>
                <div className='flex items-center gap-1.5'>
                  <Calendar className='w-4 h-4' />
                  {formatDate(
                    new Date(data.images[0].createdAt),
                    'MMMM d, yyyy',
                  )}
                </div>
                <div className='flex items-center gap-1.5'>
                  <Camera className='w-4 h-4' />
                  {data.total} {data.total === 1 ? 'Photo' : 'Photos'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className='py-10 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 max-w-5xl'>
            <p className='text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl'>
              {data.package.summary}
            </p>
            <div className='flex items-center gap-2 shrink-0'>
              <Button variant='outline' size='sm' className='gap-2'>
                <Share2 className='w-4 h-4' />
                Share
              </Button>
              <Button variant='outline' size='sm' className='gap-2'>
                <Download className='w-4 h-4' />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
            {data.images.map((image, idx) => (
              <Card
                key={image.id}
                className='break-inside-avoid p-0 overflow-hidden border-2 border-transparent hover:border-primary/40 transition-all duration-300 group animate-in fade-in duration-700'
                style={{ animationDelay: `${Math.min(idx * 50, 600)}ms` }}
              >
                <div className='relative overflow-hidden'>
                  <Image
                    src={image.url}
                    alt={`${data.package.name} - Photo ${idx + 1}`}
                    width={800}
                    height={600}
                    className='w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  {/* subtle index badge */}
                  <div className='absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white/70 text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    {idx + 1}/{data.total}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Related Galleries CTA */}
      <section className='py-16 bg-primary/5 border-t border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5'>
          <div className='flex items-center justify-center gap-3 mb-2'>
            <div className='h-px w-10 bg-primary/40' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Keep exploring
            </span>
            <div className='h-px w-10 bg-primary/40' />
          </div>
          <h2 className='text-2xl md:text-3xl font-bold'>
            More Visual Stories
          </h2>
          <p className='text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed'>
            Discover more stunning photo collections from across Bangladesh
          </p>
          <Button size='lg' asChild className='mt-2'>
            <Link href='/gallery'>View All Galleries</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
