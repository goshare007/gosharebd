'use client';

import { Calendar, Edit, MapPin, Package, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllPackages } from '@/services/packages';

export default function PackagesManagementPage() {
  const { data: packages, isPending, isError, refetch } = useAllPackages();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='h-px w-12 bg-primary' />
          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
            Tour Management
          </span>
        </div>
        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='font-display text-4xl font-bold leading-tight tracking-tight'>
              Packages
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-sm mt-1'>
              Manage your tour packages and scheduled departures
            </p>
          </div>
          <Button asChild className='gap-2'>
            <Link href='/dashboard/admin/packages/add-new'>
              <Plus className='w-4 h-4' />
              Add Package
            </Link>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <Card className='border-2 border-destructive/20'>
          <CardContent className='py-12 flex flex-col items-center gap-3 text-center'>
            <Package className='w-8 h-8 text-destructive' />
            <p className='text-sm font-semibold'>Failed to load packages</p>
            <Button size='sm' variant='outline' onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isPending && (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: This is fine
            <Card key={i} className='border-2'>
              <Skeleton className='h-40 w-full rounded-t-lg' />
              <CardContent className='p-4 space-y-3'>
                <Skeleton className='h-5 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-9 w-full' />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isPending && !isError && packages?.length === 0 && (
        <Card className='border-2 border-dashed'>
          <CardContent className='py-16 flex flex-col items-center gap-3 text-center'>
            <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
              <Package className='w-5 h-5 text-primary' />
            </div>
            <div>
              <p className='font-display font-bold text-base'>
                No packages found
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Create your first tour package to get started.
              </p>
            </div>
            <Button asChild className='gap-2 mt-2'>
              <Link href='/dashboard/admin/packages/add-new'>
                <Plus className='w-4 h-4' />
                Add Package
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Packages Grid */}
      {!isPending && !isError && packages && packages.length > 0 && (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className='border-2 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden group'
            >
              {/* Cover Image */}
              <div className='relative h-40 overflow-hidden'>
                <Image
                  src={pkg.coverImage || '/placeholder.jpg'}
                  alt={pkg.name}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                <div className='absolute bottom-3 left-3 right-3'>
                  <p className='text-white font-semibold text-sm line-clamp-1'>
                    {pkg.name}
                  </p>
                </div>
              </div>

              <CardContent className='p-4 space-y-4'>
                {/* Location & Price */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <MapPin className='w-3.5 h-3.5' />
                    {pkg.Location}
                  </div>
                  <div className='text-sm font-bold text-primary'>
                    ৳{pkg.pricePerPerson?.toLocaleString() ?? 'N/A'}
                  </div>
                </div>

                {/* Duration */}
                <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <Calendar className='w-3.5 h-3.5' />
                  {pkg.durationDays ?? 0} day
                  {(pkg.durationDays ?? 0) > 1 ? 's' : ''}
                </div>

                {/* Actions */}
                <div className='grid grid-cols-2 gap-2 pt-2 border-t border-border'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 text-xs gap-1.5 border-2 hover:border-primary/40'
                    asChild
                  >
                    <Link href={`/dashboard/admin/packages/${pkg.id}/edit`}>
                      <Edit className='w-3 h-3' />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 text-xs gap-1.5 border-2 hover:border-primary/40'
                    asChild
                  >
                    <Link
                      href={`/dashboard/admin/packages/${pkg.id}/departures`}
                    >
                      <Calendar className='w-3 h-3' />
                      Departures
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
