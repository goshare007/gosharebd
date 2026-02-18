'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Cta() {
  return (
    <section className='py-20 md:py-28 bg-linear-to-br from-primary/10 to-secondary/20'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8'>
        <div className='space-y-4 animate-in fade-in slide-in-from-bottom duration-700'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
            Ready to Explore Bangladesh?
          </h2>
          <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
            Join thousands of travelers who have discovered the beauty of
            Bangladesh with GoShareBD
          </p>
        </div>

        <div
          className='flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom duration-700'
          style={{ animationDelay: '100ms' }}
        >
          <Button size='lg' asChild className='text-base h-12 px-8'>
            <Link href='/packages'>Browse Tours</Link>
          </Button>
          <Button
            size='lg'
            variant='outline'
            asChild
            className='text-base h-12 px-8'
          >
            <Link href='/contact'>Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
