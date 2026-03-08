'use client';
import {
  AlertCircle,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGalleryImages } from '@/services/gallery';

// Predefined heights to mimic natural masonry variation
const SKELETON_HEIGHTS = [
  280, 380, 320, 420, 260, 360, 440, 300, 350, 410, 270, 390, 460, 310, 370,
  290,
];

function GalleryHeader({ animated = false }: { animated?: boolean }) {
  return (
    <section className='relative pt-16 pb-12 bg-primary/5 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <div
          className={
            animated
              ? 'max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700'
              : 'max-w-3xl'
          }
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='h-px w-12 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Explore Bangladesh
            </span>
          </div>
          <h1 className='text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-6'>
            Visual
            <br />
            <span className='font-light italic text-muted-foreground'>
              Stories
            </span>
            <span className='text-primary'>.</span>
          </h1>
          <p className='text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed'>
            A collection of moments captured across the green delta — rivers,
            forests, and faces of Bangladesh.
          </p>
        </div>
      </div>
    </section>
  );
}

function GallerySkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header Skeleton */}
      <section className='relative pt-16 pb-12 bg-primary/5 overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <div className='max-w-3xl'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-px w-12 bg-primary/30' />
              <Skeleton className='h-3 w-32' />
            </div>
            <div className='mb-6 space-y-2'>
              <Skeleton className='h-14 w-40' />
              <Skeleton className='h-14 w-56' />
            </div>
            <div className='space-y-2 max-w-xl'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
              <Skeleton className='h-4 w-4/6' />
            </div>
          </div>
        </div>
      </section>

      {/* Masonry Grid Skeleton */}
      <section className='py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
            {SKELETON_HEIGHTS.map((height, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <div key={i} className='break-inside-avoid mb-4'>
                <div className='relative overflow-hidden rounded-xl bg-muted'>
                  <Skeleton
                    className='w-full rounded-xl'
                    style={{ height: `${height}px` }}
                  />
                  <div className='absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5'>
                    <Skeleton className='h-3 w-3 rounded-sm' />
                    <Skeleton className='h-3 w-5' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function GalleryError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <GalleryHeader />

      <section className='py-24'>
        <div className='max-w-md mx-auto px-4 text-center'>
          <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5'>
            <AlertCircle className='w-7 h-7 text-destructive' />
          </div>
          <h2 className='text-xl font-semibold mb-2'>
            Couldn't load the gallery
          </h2>
          <p className='text-sm text-muted-foreground mb-6 leading-relaxed'>
            {message ||
              'Something went wrong while fetching the images. Please try again.'}
          </p>
          {onRetry && (
            <Button variant='outline' onClick={onRetry} className='gap-2'>
              <RefreshCw className='w-4 h-4' />
              Try again
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function GalleryEmpty() {
  return (
    <div className='min-h-screen bg-background'>
      <GalleryHeader animated />

      <section className='py-24'>
        <div className='max-w-md mx-auto px-4 text-center'>
          {/* Decorative icon */}
          <div className='relative inline-flex items-center justify-center w-20 h-20 mb-6'>
            <div className='absolute inset-0 rounded-full bg-primary/10' />
            <div className='absolute inset-2 rounded-full bg-primary/5' />
            <ImageIcon className='w-8 h-8 text-primary/60 relative' />
          </div>

          <div className='flex items-center justify-center gap-3 mb-4'>
            <div className='h-px w-8 bg-primary/40' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary/60'>
              Coming Soon
            </span>
            <div className='h-px w-8 bg-primary/40' />
          </div>

          <h2 className='font-display text-2xl font-bold mb-3'>
            No photos{' '}
            <span className='font-light italic text-muted-foreground'>yet</span>
            <span className='text-primary'>.</span>
          </h2>
          <p className='text-sm text-muted-foreground leading-relaxed mb-8'>
            Our gallery is being curated. Check back soon — beautiful moments
            from across Bangladesh are on their way.
          </p>

          <Button asChild variant='outline' className='gap-2 border-2'>
            <Link href='/packages'>
              <MapPin className='w-4 h-4' />
              Explore our packages
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function GalleryIndexPage() {
  const { isPending, data, error, refetch } = useGalleryImages();

  if (isPending) return <GallerySkeleton />;

  if (error)
    return (
      <GalleryError
        message={error instanceof Error ? error.message : String(error)}
        onRetry={refetch}
      />
    );

  if (!data || data.length === 0) return <GalleryEmpty />;

  return (
    <div className='min-h-screen bg-background'>
      <GalleryHeader animated />

      {/* Masonry Grid */}
      <section className='py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
            {data.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/packages/${gallery.package.slug}`}
                className='group block break-inside-avoid mb-4'
              >
                <Card className='relative overflow-hidden p-0 border-none rounded-xl bg-muted'>
                  <Image
                    src={gallery.url}
                    alt={gallery.package.name}
                    width={800}
                    height={1200}
                    className='w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  {/* Overlay Info */}
                  <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5'>
                    <h3 className='text-white font-bold text-xl'>
                      {gallery.package.name}
                    </h3>
                    <div className='flex items-center gap-2 text-white/80 text-sm mt-1'>
                      <MapPin className='w-3 h-3' />
                      <span>{gallery.package.location}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
