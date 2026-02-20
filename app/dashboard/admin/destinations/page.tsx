'use client';

import {
  AlertCircle,
  MapPin,
  Package,
  Plus,
  RefreshCcw,
  SearchX,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllDestinations } from '@/services/destinations';
import type { RealDestinationType } from '@/types/real/destination';

export default function DestinationsPage() {
  const { isPending, data, isError, refetch } = useAllDestinations();

  // 1. Loading State (Skeletons)
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
  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-6'>
        <div className='bg-muted p-6 rounded-full'>
          <SearchX className='w-16 h-16 text-muted-foreground' />
        </div>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-bold'>No Destinations Found</h2>
          <p className='text-muted-foreground'>
            It looks like you haven't added any travel spots yet.
          </p>
        </div>
        <Link href='/dashboard/admin/destinations/new'>
          <Button className='gap-2'>
            <Plus className='w-4 h-4' /> Add Your First Destination
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto pb-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Destinations
          </h1>
          <p className='text-muted-foreground'>
            Manage your travel locations and packages
          </p>
        </div>
        <Link href='/dashboard/admin/destinations/new'>
          <Button size='lg' className='shadow-md'>
            <Plus className='w-4 h-4 mr-2' />
            Add Destination
          </Button>
        </Link>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data.map((dest: RealDestinationType) => (
          <Link
            key={dest.id}
            href={`/dashboard/admin/destinations/${dest.id}`}
            className='group'
          >
            <Card className='overflow-hidden border-2 pt-0 hover:border-primary/50 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col'>
              <div className='relative h-48 overflow-hidden'>
                <Image
                  src={dest.image || '/placeholder-destination.jpg'}
                  alt={dest.name}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                  <h3 className='text-lg font-bold mb-1 group-hover:text-primary-foreground transition-colors'>
                    {dest.name}
                  </h3>
                  <div className='flex items-center gap-1.5 text-xs text-white/90'>
                    <MapPin className='w-3 h-3' />
                    <span>{dest.division}</span>
                  </div>
                </div>
              </div>

              <CardContent className='p-4 space-y-4 flex-1 flex flex-col'>
                <p className='text-sm text-muted-foreground line-clamp-2 flex-1'>
                  {dest.summary}
                </p>

                <div className='space-y-3'>
                  <div className='flex flex-wrap gap-1.5'>
                    {dest.tags?.slice(0, 3).map((tag, i) => (
                      <Badge
                        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                        key={i}
                        variant='secondary'
                        className='text-[10px] uppercase tracking-wider font-semibold'
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className='flex items-center justify-between pt-3 border-t'>
                    <div className='flex items-center gap-1.5 text-muted-foreground'>
                      <Package className='w-4 h-4' />
                      <span className='text-xs font-medium uppercase'>
                        Packages
                      </span>
                    </div>
                    <span className='font-bold text-primary'>
                      {dest._count?.packages || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
