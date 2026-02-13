'use client';
import { ArrowRight, Compass, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Cta() {
  return (
    <section className='relative py-16 md:py-20 overflow-hidden'>
      {/* Background with gradient */}
      <div className='absolute inset-0 bg-linear-to-br from-primary via-primary to-primary/90' />

      {/* Pattern overlay */}
      <div
        className='absolute inset-0 opacity-[0.05] dark:opacity-[0.1]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%236366f1' fill-opacity='0.2'/%3E%3Ccircle cx='20' cy='20' r='1' fill='%236366f1'/%3E%3C/svg%3E")`,
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />

      {/* Decorative circles */}
      <div className='absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
      <div className='absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl' />

      {/* Floating elements */}
      <div
        className='absolute top-20 left-[10%] animate-bounce'
        style={{ animationDuration: '3s' }}
      >
        <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center rotate-12'>
          <MapPin className='w-8 h-8 text-white' />
        </div>
      </div>
      <div
        className='absolute bottom-32 right-[15%] animate-bounce'
        style={{ animationDuration: '4s', animationDelay: '1s' }}
      >
        <div className='w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center -rotate-12'>
          <Compass className='w-7 h-7 text-white' />
        </div>
      </div>
      <div
        className='absolute top-1/2 right-[8%] animate-bounce'
        style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}
      >
        <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
          <Star className='w-6 h-6 text-white fill-white' />
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700'>
          {/* Badge */}
          <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium border border-white/30'>
            <Star className='w-4 h-4 fill-white' />
            <span>Join 10,000+ Happy Travelers</span>
          </div>

          {/* Heading */}
          <h2 className='text-4xl sm:text-5xl md:text-6xl font-bold text-white text-balance leading-tight'>
            Ready to Start Your <span className='block mt-2'>Adventure?</span>
          </h2>

          {/* Description */}
          <p className='text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed'>
            Join thousands of travelers discovering authentic experiences with
            GoShareBD. Your next unforgettable journey is just a click away.
          </p>

          {/* Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-6'>
            <Button
              size='lg'
              className='bg-white text-primary hover:bg-white/95 text-base h-14 px-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 group font-semibold'
            >
              Book Your Tour
              <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent text-base h-14 px-8 transition-all hover:scale-105 font-semibold'
            >
              View All Tours
            </Button>
          </div>

          {/* Trust indicators */}
          <div className='flex flex-wrap items-center justify-center gap-8 pt-12 text-white/80'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-white rounded-full' />
              <span className='text-sm font-medium'>Instant Confirmation</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-white rounded-full' />
              <span className='text-sm font-medium'>Best Price Guarantee</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-white rounded-full' />
              <span className='text-sm font-medium'>24/7 Support</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-white rounded-full' />
              <span className='text-sm font-medium'>Secure Booking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
