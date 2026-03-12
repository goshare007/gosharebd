'use client';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Clock,
  MapPin,
  Package,
  RefreshCcw,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllPackages } from '@/services/packages';
import type { AllPackagesType } from '@/types/package';

// ─── Static Header ────────────────────────────────────────────────────────────
function Header() {
  return (
    <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
      <div className='absolute right-8 top-4 font-display text-[8rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
        TOURS
      </div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Tour Packages
            </span>
          </div>
          <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
            Find your next{' '}
            <span className='italic font-light text-muted-foreground'>
              adventure
            </span>
            <span className='text-primary'>.</span>
          </h1>
          <p className='text-muted-foreground text-base leading-relaxed'>
            Browse all our curated tour packages across Bangladesh — from the
            misty hills of Bandarban to the mangroves of the Sundarbans.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function PackageCardSkeleton() {
  return (
    <div className='rounded-xl border-2 overflow-hidden flex flex-col'>
      <Skeleton className='h-48 w-full rounded-none' />
      <div className='p-5 space-y-3 flex-1'>
        <Skeleton className='h-6 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
        <div className='flex gap-4 pt-1'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>
      <div className='px-5 pb-5'>
        <Skeleton className='h-3 w-16 mb-2' />
        <Skeleton className='h-7 w-32' />
      </div>
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <section className='py-12 md:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-6'>
          <Skeleton className='h-7 w-40' />
          <Skeleton className='h-4 w-24' />
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            <PackageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className='min-h-[40vh] flex items-center justify-center px-4'>
      <div className='text-center space-y-5 max-w-md'>
        <div className='w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto'>
          <AlertTriangle className='w-7 h-7 text-destructive' />
        </div>
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold'>Failed to load packages</h2>
          <p className='text-sm text-muted-foreground'>
            We couldn't fetch the packages. This might be a temporary issue —
            please try again.
          </p>
        </div>
        <div className='flex items-center justify-center gap-3'>
          <Button variant='outline' onClick={onRetry} className='gap-2'>
            <RefreshCcw className='w-4 h-4' />
            Try again
          </Button>
          <Button asChild variant='ghost'>
            <Link href='/'>
              <ArrowLeft className='w-4 h-4 mr-1' />
              Go home
            </Link>
          </Button>
        </div>
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
          <Package className='w-10 h-10 text-muted-foreground' />
        </div>
      </div>
      <h3 className='text-lg font-medium'>No packages yet</h3>
      <p className='text-sm text-muted-foreground max-w-xs mx-auto'>
        Packages will appear here once they are added.
      </p>
    </div>
  );
}

// ─── Packages Grid ────────────────────────────────────────────────────────────
function PackagesGrid({ data }: { data: AllPackagesType[] }) {
  if (!data.length) return <EmptyState />;

  return (
    <section className='py-12 md:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold'>All Packages</h2>
          <p className='text-sm text-muted-foreground'>
            {data.length} {data.length === 1 ? 'package' : 'packages'}
          </p>
        </div>

        <div className='max-w-7xl mx-auto py-8'>
          <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-5'>
            {data.map((pkg, idx) => (
              <article
                key={pkg.id}
                className='group relative rounded-2xl border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 flex flex-col'
                style={{
                  animationDelay: `${idx * 60}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Invisible full-card link */}
                <Link
                  href={`/packages/${pkg.slug}`}
                  className='absolute inset-0 z-10'
                  aria-label={`View ${pkg.name}`}
                />

                {/* Image */}
                <div className='relative h-52 overflow-hidden bg-muted shrink-0'>
                  <Image
                    src={pkg.coverImage}
                    alt={pkg.name}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  {/* Gradient overlay */}
                  <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent' />

                  {/* Badges — top left */}
                  <div className='absolute top-3 left-3 flex gap-1.5 z-10'>
                    {pkg.isBestseller && (
                      <span className='inline-flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-2 py-0.5 rounded-full'>
                        <Award className='w-3 h-3' /> Bestseller
                      </span>
                    )}
                    {!pkg.isActive && (
                      <span className='inline-flex items-center bg-muted/90 text-muted-foreground text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm'>
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Name + location anchored to bottom of image */}
                  <div className='absolute bottom-0 left-0 right-0 p-4 z-10'>
                    <h3 className='font-semibold text-white text-base leading-tight line-clamp-2 mb-1'>
                      <Link href={`/packages/${pkg.slug}`}>{pkg.name}</Link>
                    </h3>
                    <div className='flex items-center gap-1 text-white/70 text-xs'>
                      <MapPin className='w-3 h-3 shrink-0' />
                      <span className='truncate'>{pkg.location}</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className='p-4 flex flex-col gap-4 flex-1'>
                  {/* Stats row */}
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1.5'>
                      <Clock className='w-3.5 h-3.5 text-primary' />
                      <span>{pkg.durationDays}D</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <Users className='w-3.5 h-3.5 text-primary' />
                      <span>
                        {pkg.minGroupSize}–{pkg.maxGroupSize}
                      </span>
                    </div>
                    {/* Rating */}
                    <div className='flex items-center gap-1 ml-auto'>
                      <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
                      <span className='font-medium text-foreground text-sm'>
                        {pkg.averageRating ? pkg.averageRating.toFixed(1) : '—'}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        ({pkg.reviewCount ?? 0})
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {pkg.tags && pkg.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {pkg.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant='secondary'
                          className='text-[11px] px-2 py-0 h-5 rounded-full'
                        >
                          {tag}
                        </Badge>
                      ))}
                      {pkg.tags.length > 3 && (
                        <Badge
                          variant='outline'
                          className='text-[11px] px-2 py-0 h-5 rounded-full'
                        >
                          +{pkg.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Pricing — pinned to bottom */}
                  <div className='mt-auto pt-3 border-t border-border flex items-end justify-between'>
                    <div>
                      <p className='text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5'>
                        Per person
                      </p>
                      <div className='flex items-baseline gap-1.5'>
                        <span className='text-lg font-bold text-primary'>
                          ৳{Number(pkg.pricePerPerson).toLocaleString()}
                        </span>
                        {pkg.originalPrice && (
                          <span className='text-xs text-muted-foreground line-through'>
                            ৳{Number(pkg.originalPrice).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {pkg.couplePrice && (
                      <div className='text-right'>
                        <p className='text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5'>
                          Couple
                        </p>
                        <span className='text-base font-bold text-pink-500 dark:text-pink-400'>
                          ৳{Number(pkg.couplePrice).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PackagesIndexPage() {
  const { isPending, data, isError, refetch } = useAllPackages({
    isActive: true,
    type: 'REGULAR',
  });

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isPending ? (
        <LoadingState />
      ) : (
        <PackagesGrid data={data} />
      )}
    </div>
  );
}
