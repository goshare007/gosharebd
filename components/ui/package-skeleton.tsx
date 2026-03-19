import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PackageCardSkeleton() {
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

export function PackageGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
        <PackageCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PackageListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className='space-y-4'>
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
        <Card key={i} className='overflow-hidden'>
          <div className='flex'>
            <Skeleton className='w-48 h-32' />
            <CardContent className='flex-1 p-4 space-y-2'>
              <Skeleton className='h-5 w-2/3' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-1/2' />
              <div className='flex gap-2 pt-2'>
                <Skeleton className='h-6 w-20 rounded-full' />
                <Skeleton className='h-6 w-16 rounded-full' />
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function PackageDetailSkeleton() {
  return (
    <div className='space-y-8'>
      <Skeleton className='w-full h-[50vh]' />
      <div className='max-w-7xl mx-auto px-4 space-y-8'>
        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <div className='flex gap-2'>
              <Skeleton className='h-6 w-28' />
              <Skeleton className='h-6 w-24' />
            </div>
            <Skeleton className='h-12 w-2/3' />
            <div className='flex gap-4'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-5 w-24' />
            </div>
          </div>
          <div className='lg:col-span-1'>
            <Card className='sticky top-24'>
              <CardContent className='p-6 space-y-4'>
                <Skeleton className='h-10 w-48' />
                <Skeleton className='h-6 w-36 rounded-full' />
                <Skeleton className='h-12 w-full' />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PackageCardCompactSkeleton() {
  return (
    <div className='flex gap-4 p-4 border rounded-lg'>
      <Skeleton className='w-24 h-24 rounded-lg' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/3' />
      </div>
      <div className='text-right space-y-2'>
        <Skeleton className='h-6 w-20 ml-auto' />
        <Skeleton className='h-4 w-16 ml-auto' />
      </div>
    </div>
  );
}
