'use client';
import { ArrowRight, Play, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className='relative min-h-screen flex items-center overflow-hidden bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20 w-full'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left side - Content */}
          <div className='space-y-8 animate-in fade-in slide-in-from-left duration-700'>
            {/* Heading */}
            <div className='space-y-4'>
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight'>
                Discover the Soul of{' '}
                <span className='text-primary'>Bangladesh</span>
              </h1>

              <p className='text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed'>
                Embark on unforgettable journeys through lush tea gardens,
                pristine beaches, and ancient mangrove forests with expert local
                guides.
              </p>
            </div>

            {/* Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button size='lg' className='text-base h-12 px-8 gap-2'>
                Explore Tours
                <ArrowRight className='w-5 h-5' />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='text-base h-12 px-8 gap-2'
              >
                <Play className='w-5 h-5' />
                Watch Video
              </Button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-4 gap-6 pt-8'>
              <div>
                <div className='flex items-center gap-1 mb-1'>
                  <p className='text-2xl font-bold'>50+</p>
                </div>
                <p className='text-xs text-muted-foreground'>Destinations</p>
              </div>
              <div>
                <div className='flex items-center gap-1 mb-1'>
                  <p className='text-2xl font-bold'>10K+</p>
                </div>
                <p className='text-xs text-muted-foreground'>Travelers</p>
              </div>
              <div>
                <div className='flex items-center gap-1 mb-1'>
                  <p className='text-2xl font-bold'>500+</p>
                </div>
                <p className='text-xs text-muted-foreground'>Tours</p>
              </div>
              <div>
                <div className='flex items-center gap-1 mb-1'>
                  <p className='text-2xl font-bold'>4.8</p>
                  <Star className='w-4 h-4 fill-primary text-primary' />
                </div>
                <p className='text-xs text-muted-foreground'>Rating</p>
              </div>
            </div>
          </div>

          {/* Right side - Image Grid */}
          <div
            className='relative h-150 animate-in fade-in slide-in-from-right duration-700'
            style={{ animationDelay: '200ms' }}
          >
            {/* Main large image */}
            <div className='absolute top-0 right-0 w-[70%] h-[55%] rounded-2xl overflow-hidden shadow-2xl border-4 border-background z-10 group'>
              <Image
                src='https://images.unsplash.com/photo-1665152038920-e3b63b660075?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='Cox Bazar Beach'
                height={720}
                width={1200}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
              />

              <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                <p className='text-sm font-medium mb-1'>Featured Destination</p>
                <p className='text-2xl font-bold'>Cox's Bazar</p>
                <p className='text-sm opacity-90 mt-1'>
                  World's longest natural beach
                </p>
              </div>
            </div>

            {/* Secondary image - top left */}
            <div className='absolute top-12 left-0 w-[45%] h-[35%] rounded-2xl overflow-hidden shadow-xl border-4 border-background z-20 group'>
              <Image
                src='https://images.unsplash.com/photo-1551615577-1c7e180a77ac?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='Sundarbans Mangrove'
                height={720}
                width={1200}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                <p className='text-sm font-bold'>Sundarbans</p>
                <p className='text-xs opacity-90'>Wildlife Safari</p>
              </div>
            </div>

            {/* Third image - bottom left */}
            <div className='absolute bottom-0 left-8 w-[42%] h-[32%] rounded-2xl overflow-hidden shadow-xl border-4 border-background z-30 group'>
              <Image
                src='https://images.unsplash.com/photo-1667120205301-a2a3a886886e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='Sylhet Tea Gardens'
                height={720}
                width={1200}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                <p className='text-sm font-bold'>Sylhet</p>
                <p className='text-xs opacity-90'>Tea Gardens</p>
              </div>
            </div>

            {/* Fourth image - bottom right, small */}
            <div className='absolute bottom-8 right-4 w-[35%] h-[28%] rounded-2xl overflow-hidden shadow-xl border-4 border-background z-20 group'>
              <Image
                src='https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?q=80&w=801&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='Bandarban Hills'
                height={720}
                width={1200}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-3 text-white'>
                <p className='text-xs font-bold'>Bandarban</p>
                <p className='text-[10px] opacity-90'>Mountain Trek</p>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className='absolute top-[45%] left-[15%] z-40 bg-background rounded-full p-4 shadow-2xl border-2 border-border animate-bounce'
              style={{ animationDuration: '3s' }}
            >
              <div className='text-center'>
                <p className='text-2xl font-bold text-primary'>4.8</p>
                <div className='flex gap-0.5 mt-1'>
                  <Star className='w-3 h-3 fill-primary text-primary' />
                  <Star className='w-3 h-3 fill-primary text-primary' />
                  <Star className='w-3 h-3 fill-primary text-primary' />
                  <Star className='w-3 h-3 fill-primary text-primary' />
                  <Star className='w-3 h-3 fill-primary text-primary' />
                </div>
                <p className='text-[10px] text-muted-foreground mt-1'>
                  10K+ Reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
