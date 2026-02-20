'use client';
import { AlertCircle, Plus, RefreshCcw, SearchX } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  if (!data || data.length === 0) {
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
    <div>
      <p>{destinationId}</p>
    </div>
  );
}
