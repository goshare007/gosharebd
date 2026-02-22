'use client';
import { AlertCircle, Compass, MapPin, Package, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllDestinations } from '@/services/destinations';

// ─── Static Header ────────────────────────────────────────────────────────────
function Header() {
  return (
    <section className='relative pt-16 pb-12 bg-primary/5 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <div className='max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
          {/* Eyebrow */}
          <div className='flex items-center gap-3 mb-6'>
            <div className='h-px w-12 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Explore Bangladesh
            </span>
          </div>

          <h1 className='text-5xl sm:text-6xl font-display md:text-7xl font-bold leading-[1.05] tracking-tight mb-6'>
            Where do you
            <br />
            <span className='italic font-light text-muted-foreground'>
              want to go
            </span>
            <span className='text-primary'>?</span>
          </h1>

          <p className='text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed'>
            Handpicked destinations with curated packages — from the misty hills
            of Bandarban to the mangroves of the Sundarbans.
          </p>
        </div>
      </div>
    </section>
  );
}
// ─── Skeleton Card ────────────────────────────────────────────────────────────
function DestinationCardSkeleton() {
  return (
    <Card className='overflow-hidden pt-0 border-2 h-full flex flex-col'>
      <Skeleton className='h-48 w-full rounded-none' />

      <CardContent className='p-4 space-y-3 flex-1 flex flex-col'>
        <div className='space-y-2 flex-1'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-4/5' />
        </div>

        <div className='flex gap-1.5'>
          <Skeleton className='h-5 w-14 rounded-full' />
          <Skeleton className='h-5 w-16 rounded-full' />
          <Skeleton className='h-5 w-12 rounded-full' />
        </div>

        <div className='flex items-center justify-between pt-2 border-t'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-5 w-20' />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Loading State (grid only) ────────────────────────────────────────────────
function LoadingState() {
  return (
    <section className='py-12 md:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-6'>
          <Skeleton className='h-7 w-40' />
          <Skeleton className='h-4 w-24' />
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className='py-24 flex items-center justify-center px-4'>
      <div className='text-center space-y-5 max-w-md'>
        <div className='flex justify-center'>
          <div className='rounded-full bg-destructive/10 p-4'>
            <AlertCircle className='w-10 h-10 text-destructive' />
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='text-xl font-semibold'>Failed to load destinations</h2>
          <p className='text-sm text-muted-foreground'>
            Something went wrong while fetching the destinations. Check your
            connection and try again.
          </p>
        </div>

        <Button onClick={onRetry} variant='outline' className='gap-2'>
          <RefreshCw className='w-4 h-4' />
          Try again
        </Button>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className='py-24 text-center space-y-4'>
      <div className='flex justify-center'>
        <div className='rounded-full bg-muted p-5'>
          <Compass className='w-10 h-10 text-muted-foreground' />
        </div>
      </div>
      <h3 className='text-lg font-medium'>No destinations yet</h3>
      <p className='text-sm text-muted-foreground max-w-xs mx-auto'>
        Destinations will appear here once they are added.
      </p>
    </div>
  );
}

// ─── Destinations Grid ────────────────────────────────────────────────────────
function DestinationsGrid({
  data,
}: {
  data: NonNullable<ReturnType<typeof useAllDestinations>['data']>;
}) {
  if (!data.length) return <EmptyState />;

  return (
    <section className='py-12 md:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold'>All Destinations</h2>
          <p className='text-sm text-muted-foreground'>
            {data.length} {data.length === 1 ? 'destination' : 'destinations'}
          </p>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {data.map((dest, idx) => (
            <Link key={dest.id} href={`/packages/${dest.id}`} className='group'>
              <Card
                className='overflow-hidden pt-0 border-2 hover:border-primary/50 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col animate-in fade-in duration-700'
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className='relative h-48 overflow-hidden'>
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />

                  <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                    <h3 className='text-lg font-bold mb-1 group-hover:text-primary transition-colors'>
                      {dest.name}
                    </h3>
                    <div className='flex items-center gap-1.5 text-xs text-white/90'>
                      <MapPin className='w-3 h-3' />
                      <span>{dest.division}</span>
                    </div>
                  </div>
                </div>

                <CardContent className='p-4 space-y-3 flex-1 flex flex-col'>
                  <p className='text-sm text-muted-foreground line-clamp-3 flex-1'>
                    {dest.summary}
                  </p>

                  <div className='space-y-2'>
                    <div className='flex flex-wrap gap-1.5'>
                      {dest.tags.slice(0, 3).map((tag, i) => (
                        <Badge
                          // biome-ignore lint/suspicious/noArrayIndexKey: valid static rendering
                          key={i}
                          variant='secondary'
                          className='text-xs px-2 py-0.5'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className='flex items-center justify-between text-sm pt-2 border-t'>
                      <div className='flex items-center gap-1.5'>
                        <Package className='w-4 h-4 text-primary' />
                        <span className='font-medium'>
                          {dest.packageCount}{' '}
                          {dest.packageCount === 1 ? 'package' : 'packages'}
                        </span>
                      </div>
                      {dest.startingPrice && (
                        <div className='flex items-center gap-1.5'>
                          <p className='text-xs text-muted-foreground'>
                            Starting From
                          </p>
                          <p className='text-base font-bold text-primary'>
                            ৳{dest.startingPrice.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PackagesIndexPage() {
  const { isPending, data, isError, refetch } = useAllDestinations();

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isPending ? (
        <LoadingState />
      ) : (
        <DestinationsGrid data={data} />
      )}
    </div>
  );
}
