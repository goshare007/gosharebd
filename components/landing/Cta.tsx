'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Cta() {
  return (
    <section className='py-20 bg-primary text-white'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8'>
        <h2 className='text-3xl sm:text-4xl font-bold text-balance'>
          Ready to Start Your Adventure?
        </h2>
        <p className='text-lg opacity-90 max-w-2xl mx-auto'>
          Join thousands of travelers discovering authentic experiences with
          GoShareBD. Your next unforgettable journey is just a click away.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
          <Button size='lg' className='bg-white text-primary hover:bg-white/90'>
            Book Your Tour <ArrowRight className='ml-2 w-4 h-4' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='border-white text-white hover:bg-white/10 bg-transparent'
          >
            View All Tours
          </Button>
        </div>
      </div>
    </section>
  );
}
