import { AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// ─── Error State ──────────────────────────────────────────────────────────────
export default function ErrorState() {
  return (
    <div className='min-h-screen bg-background'>
      <section className='relative pt-12 pb-8 bg-primary/5 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Book Now
            </span>
          </div>
          <h1 className='font-display text-3xl sm:text-4xl font-bold leading-tight'>
            Reserve your{' '}
            <span className='italic font-light text-muted-foreground'>
              spot
            </span>
            <span className='text-primary'>.</span>
          </h1>
        </div>
      </section>
      <div className='py-32 flex items-center justify-center px-4'>
        <div className='text-center space-y-5 max-w-sm'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-destructive/10 p-5'>
              <AlertCircle className='w-8 h-8 text-destructive' />
            </div>
          </div>
          <div className='space-y-2'>
            <h2 className='font-display text-xl font-bold'>
              Package not found
            </h2>
            <p className='text-sm text-muted-foreground'>
              This package may no longer be available or the link may be
              incorrect.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-2 justify-center'>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
              onClick={() => window.location.reload()}
            >
              <RefreshCw className='w-3.5 h-3.5' />
              Try again
            </Button>
            <Button size='sm' asChild>
              <Link href='/packages'>Browse packages</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
