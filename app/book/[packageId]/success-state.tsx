import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// ─── Success State ────────────────────────────────────────────────────────────
export default function SuccessState({
  name,
  packageName,
}: {
  name: string;
  packageName: string;
}) {
  return (
    <div className='min-h-[60vh] flex items-center justify-center px-4'>
      <div className='text-center space-y-5 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className='flex justify-center'>
          <div className='rounded-full bg-primary/10 p-5'>
            <CheckCircle2 className='w-10 h-10 text-primary' />
          </div>
        </div>
        <div className='space-y-2'>
          <h2 className='font-display text-2xl font-bold'>
            Booking Request Sent!
          </h2>
          <p className='text-muted-foreground text-sm'>
            Thanks <span className='font-medium text-foreground'>{name}</span>!
            We've received your request for{' '}
            <span className='font-medium text-foreground'>{packageName}</span>{' '}
            and will contact you within 24 hours via email or phone.
          </p>
        </div>
        <Button asChild variant='outline'>
          <Link href='/packages'>Browse more packages</Link>
        </Button>
      </div>
    </div>
  );
}
