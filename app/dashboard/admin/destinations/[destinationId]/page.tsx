'use client';
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Info,
  MapPin,
  Package,
  Plus,
  RefreshCcw,
  SearchX,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDestinationWisePackages } from '@/services/packages';

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ destinationId: string }>;
}) {
  const { destinationId } = use(params);
  const { isPending, data, isError, refetch } =
    useDestinationWisePackages(destinationId);

  if (isPending) {
    return (
      <div className='container mx-auto pb-8'>
        <div className='flex justify-between items-center mb-8'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-10 w-40' />
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(8)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            <Card key={i} className='overflow-hidden border-2 h-100 pt-0'>
              <Skeleton className='h-48 w-full' />
              <div className='p-4 space-y-4'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
                <div className='flex gap-2 pt-4'>
                  <Skeleton className='h-5 w-16' />
                  <Skeleton className='h-5 w-16' />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-4'>
        <div className='bg-destructive/10 p-4 rounded-full'>
          <AlertCircle className='w-12 h-12 text-destructive' />
        </div>
        <h2 className='text-2xl font-bold'>Failed to load destinations</h2>
        <p className='text-muted-foreground text-center max-w-md'>
          There was a problem connecting to the server. Please check your
          internet connection and try again.
        </p>
        <Button onClick={() => refetch()} variant='outline' className='gap-2'>
          <RefreshCcw className='w-4 h-4' /> Try Again
        </Button>
      </div>
    );
  }

  // 3. Empty State
  if (!data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-6'>
        <div className='bg-muted p-6 rounded-full'>
          <SearchX className='w-16 h-16 text-muted-foreground' />
        </div>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-bold'>
            No Packages Found For This Destination
          </h2>
          <p className='text-muted-foreground'>
            It looks like you haven't added any packages for this destination
            yet.
          </p>
        </div>
        <Link
          href={`/dashboard/admin/packages/add-new?destinationId=${destinationId}`}
        >
          <Button className='gap-2'>
            <Plus className='w-4 h-4' /> Add Your First Package
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {/* Hero Section with Destination Cover */}
      <section className='relative h-[50vh] md:h-[60vh] overflow-hidden'>
        <Image
          src={data.image}
          alt={data.name}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black' />

        {/* Back Button */}
        <div className='absolute top-6 left-4 sm:left-6 lg:left-8 z-10'>
          <Button
            variant='outline'
            size='sm'
            asChild
            className='gap-2 bg-background/80 backdrop-blur-sm'
          >
            <Link href='/packages'>
              <ArrowLeft className='w-4 h-4' />
              All Destinations
            </Link>
          </Button>
        </div>

        {/* Destination Info */}
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12'>
          <div className='max-w-7xl mx-auto'>
            <div className='space-y-4 animate-in fade-in slide-in-from-bottom duration-700'>
              <div className='flex flex-wrap items-center gap-3'>
                <Badge variant='secondary' className='text-sm'>
                  <MapPin className='w-3.5 h-3.5 mr-1' />
                  {data.division}
                </Badge>
                <Badge variant='secondary' className='text-sm'>
                  <Package className='w-3.5 h-3.5 mr-1' />
                  {data.packages.length} Packages Available
                </Badge>
              </div>

              <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight'>
                {data.name}
              </h1>

              <p className='text-base md:text-lg text-white/90 line-clamp-2 max-w-3xl'>
                {data.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className='border-b border-border bg-secondary/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-wrap gap-2'>
            {data.tags.map((tag, idx) => (
              <Badge
                // biome-ignore lint/suspicious/noArrayIndexKey: valid for static lists
                key={idx}
                variant='secondary'
                className='text-sm px-3 py-1.5'
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Results Header */}
      <section className='py-4 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
          <p className='text-sm font-medium text-muted-foreground'>
            Showing all {data.packages.length} available package in {data.name}
          </p>
          <Link
            href={`/dashboard/admin/packages/add-new?destinationId=${destinationId}`}
          >
            <Button className='gap-2'>
              <Plus className='w-4 h-4' /> Add Package
            </Button>
          </Link>
        </div>
      </section>

      {/* Packages Grid */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            {data.packages.map((pkg, idx) => (
              <Link
                key={pkg.id}
                href={`/dashboard/admin/packages/single-package?packageId=${pkg.id}`}
                className='group'
              >
                <Card
                  className='overflow-hidden pt-0 border-2 hover:border-primary/50 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col animate-in fade-in duration-700'
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className='relative h-48 overflow-hidden'>
                    <Image
                      src={pkg.coverImage}
                      alt={pkg.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />

                    <div className='absolute top-3 left-3 flex gap-2'>
                      {pkg.isBestseller && (
                        <Badge className='bg-primary/90 backdrop-blur-sm text-xs'>
                          <TrendingUp className='w-3 h-3 mr-1' />
                          Bestseller
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className='p-5 space-y-3 flex-1 flex flex-col'>
                    <div className='flex-1'>
                      <h3 className='font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors'>
                        {pkg.name}
                      </h3>
                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {pkg.summary}
                      </p>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex flex-wrap gap-1.5'>
                        {pkg.tags.slice(0, 3).map((tag, i) => (
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

                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-4 h-4 text-primary' />
                          <span>{pkg.durationDays} days</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='w-4 h-4 text-primary' />
                          <span className='text-xs'>
                            {pkg.minGroupSize} - {pkg.maxGroupSize} people
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                        <span className='font-semibold text-sm'>
                          {pkg.avgRating
                            ? pkg.avgRating.toFixed(1)
                            : 'No ratings'}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          ({pkg.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <div className='w-full'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-xs text-muted-foreground mb-1'>
                            Per Person
                          </p>
                          <div className='flex items-baseline gap-2'>
                            <span className='text-xl font-bold text-primary'>
                              ৳{pkg.pricePerPerson.toLocaleString()}
                            </span>
                            <span className='text-xs text-muted-foreground line-through'>
                              ৳{pkg.originalPrice?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {pkg.couplePrice && (
                          <div>
                            <p className='text-xs text-muted-foreground mb-1'>
                              For Couple
                            </p>
                            <span className='text-lg font-bold text-pink-600 dark:text-pink-400'>
                              ৳{pkg.couplePrice.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className='py-12 bg-secondary/10 border-t border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-start gap-3 max-w-3xl'>
            <Info className='w-5 h-5 text-primary shrink-0 mt-0.5' />
            <div>
              <h3 className='font-semibold mb-2'>
                {/* About {destination.name} Tours */}
              </h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                All tours include professional guides, entrance fees to
                attractions, and are operated by verified tour operators. Couple
                packages offer special romantic experiences and private
                arrangements. Book with confidence with our best price guarantee
                and flexible cancellation policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
