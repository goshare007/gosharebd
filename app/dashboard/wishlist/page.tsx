'use client';

import {
  AlertTriangle,
  Award,
  Clock,
  Heart,
  MapPin,
  RefreshCcw,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWishlist, useWishlistPackages } from '@/services/wishlist';
import type { WishlistType } from '@/types/wishlist';

// ── Wishlist Card ─────────────────────────────────────────────────────────────

function WishlistCard({ pkg }: { pkg: WishlistType }) {
  const { isWishlisted, toggleWishlist, isToggling } = useWishlist(pkg.id);

  return (
    <Card className='group overflow-hidden border-2 hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-0'>
      {/* Cover Image */}
      <div className='relative h-52 overflow-hidden'>
        <Image
          src={pkg.coverImage}
          alt={pkg.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent' />

        {/* Badges */}
        <div className='absolute top-3 left-3 flex gap-1.5'>
          {pkg.isBestseller && (
            <Badge className='bg-primary/90 backdrop-blur-sm border-0 text-xs'>
              <Award className='w-3 h-3 mr-1' />
              Bestseller
            </Badge>
          )}
          {pkg.isCouple && (
            <Badge className='bg-pink-500/90 backdrop-blur-sm border-0 text-xs'>
              ❤️ Couples
            </Badge>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          type='button'
          onClick={toggleWishlist}
          disabled={isToggling}
          className='absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border hover:bg-background transition-colors disabled:opacity-50'
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-muted-foreground'
            }`}
          />
        </button>

        {/* Price */}
        <div className='absolute bottom-3 left-3'>
          <div className='flex items-baseline gap-1.5'>
            <span className='text-white font-bold text-xl'>
              ৳{Number(pkg.pricePerPerson).toLocaleString()}
            </span>
            {pkg.originalPrice && (
              <span className='text-white/60 text-sm line-through'>
                ৳{Number(pkg.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <p className='text-white/70 text-xs'>per person</p>
        </div>
      </div>

      <CardContent className='p-4 space-y-3'>
        {/* Title & destination */}
        <div>
          <h3 className='font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1'>
            {pkg.name}
          </h3>
          <div className='flex items-center gap-1 mt-1 text-muted-foreground'>
            <MapPin className='w-3.5 h-3.5 shrink-0' />
            <span className='text-xs'>{pkg.Location}</span>
          </div>
        </div>

        {/* Meta row */}
        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Clock className='w-3.5 h-3.5' />
            <span>{pkg.durationDays}D</span>
          </div>
          <div className='flex items-center gap-1'>
            <Users className='w-3.5 h-3.5' />
            <span>
              {pkg.minGroupSize}–{pkg.maxGroupSize}
            </span>
          </div>
          {pkg.averageRating && (
            <div className='flex items-center gap-1 ml-auto'>
              <Star className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400' />
              <span className='font-medium text-foreground'>
                {pkg.averageRating.toFixed(1)}
              </span>
              <span className='text-muted-foreground'>({pkg.reviewCount})</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button asChild size='sm' className='w-full'>
          <Link href={`/packages/${pkg.destinationId}/${pkg.id}`}>
            View Package
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Skeleton Grid ─────────────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {Array.from({ length: 8 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
        <Card key={i} className='overflow-hidden border-2 p-0'>
          <Skeleton className='h-52 w-full rounded-none' />
          <CardContent className='p-4 space-y-3'>
            <div className='space-y-1.5'>
              <Skeleton className='h-5 w-3/4' />
              <Skeleton className='h-3.5 w-1/2' />
            </div>
            <div className='flex gap-3'>
              <Skeleton className='h-3.5 w-12' />
              <Skeleton className='h-3.5 w-12' />
              <Skeleton className='h-3.5 w-16 ml-auto' />
            </div>
            <Skeleton className='h-8 w-full rounded-md' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-24 text-center'>
      <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5'>
        <Heart className='w-8 h-8 text-primary' />
      </div>
      <h2 className='text-xl font-bold mb-2'>Your wishlist is empty</h2>
      <p className='text-sm text-muted-foreground max-w-xs mb-6'>
        Start exploring our packages and save the ones you love — they'll all
        appear here.
      </p>
      <Button asChild>
        <Link href='/packages'>Explore Packages</Link>
      </Button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const { data: packages, isPending, isError, refetch } = useWishlistPackages();

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <section className='border-b border-border bg-primary/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-12 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              My Account
            </span>
          </div>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h1 className='font-display text-3xl md:text-4xl font-bold leading-tight'>
                My{' '}
                <span className='italic font-light text-muted-foreground'>
                  saved
                </span>{' '}
                packages
              </h1>
              {!isPending && !isError && packages?.length > 0 && (
                <p className='text-muted-foreground mt-2 text-sm'>
                  {packages.length}{' '}
                  {packages.length === 1 ? 'package' : 'packages'} saved
                </p>
              )}
            </div>
            <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1'>
              <Heart className='w-5 h-5 text-primary' />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {isPending ? (
          <WishlistSkeleton />
        ) : isError ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-5'>
              <AlertTriangle className='w-7 h-7 text-destructive' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>
              Failed to load wishlist
            </h2>
            <p className='text-sm text-muted-foreground max-w-xs mb-6'>
              Something went wrong while fetching your saved packages. Please
              try again.
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
        ) : packages?.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {packages.map((pkg) => (
              <WishlistCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
