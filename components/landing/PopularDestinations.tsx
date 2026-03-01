'use client';
import { ArrowRight, MapPin, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllDestinations } from '@/services/destinations';

function DestinationCardSkeleton() {
  return (
    <Card className='border-2 pt-0 overflow-hidden bg-background'>
      <Skeleton className='h-56 w-full rounded-none' />
      <CardContent className='p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
        <Skeleton className='h-9 w-full' />
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className='col-span-full py-16 text-center space-y-4'>
      <div className='flex justify-center'>
        <div className='rounded-full bg-muted p-5'>
          <MapPin className='w-10 h-10 text-muted-foreground' />
        </div>
      </div>
      <h3 className='text-lg font-medium'>No destinations available</h3>
      <p className='text-sm text-muted-foreground max-w-xs mx-auto'>
        Check back soon — new destinations are being added regularly.
      </p>
    </div>
  );
}

export default function PopularDestinations() {
  const { data: destinations, isPending, isError } = useAllDestinations();

  const featured = destinations?.slice(0, 6) ?? [];

  return (
    <section
      id='destinations'
      className='py-12 md:py-20 bg-linear-to-br from-secondary/10 to-background relative overflow-hidden'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Section header */}
        <div className='text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-700'>
          <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-4'>
            <MapPin className='w-4 h-4' />
            <span>Explore Bangladesh</span>
          </div>
          <h2 className='text-4xl font-display sm:text-5xl font-bold text-foreground'>
            Popular Destinations
          </h2>
          <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
            Explore the most visited and loved destinations in Bangladesh
          </p>
        </div>

        {/* Destinations grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {isPending ? (
            Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <DestinationCardSkeleton key={i} />
            ))
          ) : isError ? null : featured.length === 0 ? (
            <EmptyState />
          ) : (
            featured.map((destination, idx) => (
              <Link key={destination.id} href={`/packages/${destination.id}`}>
                <Card
                  className='group border-2 pt-0 overflow-hidden hover:border-primary/50 hover:shadow-2xl transition-all duration-500 cursor-pointer bg-background animate-in fade-in slide-in-from-bottom'
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Image section */}
                  <div className='relative h-56 overflow-hidden'>
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent' />

                    {/* Floating badge */}
                    <div className='absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg'>
                      <Star className='w-3.5 h-3.5 fill-primary text-primary' />
                      <span className='text-sm font-bold'>
                        {destination.packageCount}
                      </span>
                    </div>

                    {/* Bottom info on image */}
                    <div className='absolute bottom-4 left-4 right-4'>
                      <h3 className='text-white text-2xl font-bold'>
                        {destination.name}
                      </h3>
                      <p className='text-white/90 text-sm mb-1 line-clamp-2'>
                        {destination.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card content */}
                  <CardContent className='p-6 space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2 text-muted-foreground'>
                        <MapPin className='w-4 h-4 text-primary' />
                        <span className='text-sm font-medium'>
                          {destination.packageCount}{' '}
                          {destination.packageCount === 1 ? 'Tour' : 'Tours'}{' '}
                          available
                        </span>
                      </div>
                      {destination.startingPrice && (
                        <div className='flex items-center gap-2 text-muted-foreground'>
                          <Users className='w-4 h-4 text-primary' />
                          <span className='text-sm font-medium'>
                            From ৳{destination.startingPrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant='outline'
                      className='w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all'
                    >
                      View Tours
                      <ArrowRight className='w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform' />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
