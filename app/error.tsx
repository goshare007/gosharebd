'use client';

import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='text-center space-y-6 max-w-md'>
        <div className='w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto'>
          <AlertTriangle className='w-8 h-8 text-destructive' />
        </div>

        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>Something went wrong!</h2>
          <p className='text-muted-foreground'>
            We encountered an unexpected error. Our team has been notified and
            we&apos;re working to fix it.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <p className='text-xs text-muted-foreground bg-muted p-2 rounded mt-4 text-left font-mono'>
              {error.message}
            </p>
          )}
        </div>

        <div className='flex items-center justify-center gap-3'>
          <Button onClick={() => reset()} className='gap-2'>
            <RefreshCcw className='w-4 h-4' />
            Try again
          </Button>
          <Button variant='outline' asChild>
            <Link href='/'>
              <Home className='w-4 h-4 mr-2' />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
