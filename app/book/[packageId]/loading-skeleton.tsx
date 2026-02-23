import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
export default function LoadingSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      <section className='relative pt-12 pb-8 bg-primary/5 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3 mb-3'>
            <Skeleton className='h-px w-10' />
            <Skeleton className='h-3 w-20' />
          </div>
          <Skeleton className='h-10 w-64' />
        </div>
      </section>
      <section className='py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16'>
            <div className='space-y-5'>
              <Skeleton className='h-52 w-full rounded-2xl' />
              <div className='grid grid-cols-3 gap-2'>
                {Array.from({ length: 3 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <Skeleton key={i} className='h-16 rounded-xl' />
                ))}
              </div>
              <Separator />
              <div className='space-y-2'>
                {Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <div key={i} className='flex justify-between'>
                    <Skeleton className='h-4 w-28' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                ))}
              </div>
            </div>
            <div className='space-y-8'>
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                <div key={i} className='space-y-2'>
                  <Skeleton className='h-3 w-32' />
                  <Skeleton className='h-11 w-full rounded-md' />
                </div>
              ))}
              <Skeleton className='h-12 w-full rounded-md' />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
