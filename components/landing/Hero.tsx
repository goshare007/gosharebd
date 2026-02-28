'use client';

import {
  ArrowRight,
  CheckCircle2,
  Headset,
  Sparkles,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const destinations = [
  {
    name: "Cox's Bazar",
    subtitle: "World's longest natural beach",
    image:
      'https://images.unsplash.com/photo-1665152038920-e3b63b660075?q=80&w=774&auto=format&fit=crop',
  },
  {
    name: 'Sundarbans',
    subtitle: 'Royal Bengal Tiger habitat',
    image:
      'https://images.unsplash.com/photo-1551615577-1c7e180a77ac?q=80&w=967&auto=format&fit=crop',
  },
  {
    name: 'Sylhet',
    subtitle: 'Enchanting tea gardens',
    image:
      'https://images.unsplash.com/photo-1667120205301-a2a3a886886e?q=80&w=774&auto=format&fit=crop',
  },
  {
    name: 'Bandarban',
    subtitle: 'Mountain paradise',
    image:
      'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?q=80&w=801&auto=format&fit=crop',
  },
];

// Real traveler avatars
const travelers = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % destinations.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentDestination = destinations[currentImageIndex];

  return (
    <section className='relative min-h-screen flex items-center overflow-hidden'>
      {/* Animated gradient background */}
      <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-background to-secondary/5' />

      {/* Decorative blobs */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse' />
      <div
        className='absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse'
        style={{ animationDelay: '1s' }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-20 w-full'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Left side - Content */}
          <div className='space-y-6 sm:space-y-8'>
            {/* Heading */}
            <div
              className='space-y-5 text-center lg:text-left animate-in fade-in slide-in-from-bottom duration-700'
              style={{ animationDelay: '100ms' }}
            >
              <h1 className='text-5xl font-display sm:text-6xl md:text-6xl lg:text-7xl font-extrabold'>
                See the Beauty. <br className='hidden md:block' />
                <span className='relative inline-block'>
                  <span className='relative z-10 text-primary font-display'>
                    GoShare
                  </span>
                </span>{' '}
                the Story.
              </h1>

              <p className='text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed'>
                Go beyond the map with 10,000+ travelers who found their
                paradise. Experience the raw beauty of pristine shores and
                mystical highlands, guided by the heartbeat of Bangladesh.
              </p>
            </div>

            {/* Social Proof - Enhanced */}
            <div
              className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 animate-in fade-in duration-700'
              style={{ animationDelay: '200ms' }}
            >
              {/* Travelers */}
              <div className='flex items-center gap-3'>
                <div className='flex -space-x-3'>
                  {travelers.map((avatar, idx) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                      key={idx}
                      className='relative w-10 h-10 rounded-full border-2 border-background ring-2 ring-primary/20 overflow-hidden'
                    >
                      <Image
                        src={avatar}
                        alt={`Traveler ${idx + 1}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ))}
                  <div className='w-10 h-10 rounded-full border-2 border-background ring-2 ring-primary/20 bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground'>
                    10K+
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-1 mb-0.5'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                        key={i}
                        className='w-4 h-4 fill-yellow-400 text-yellow-400'
                      />
                    ))}
                  </div>
                  <p className='text-sm font-semibold'>
                    4.8/5 from 10,247 reviews
                  </p>
                </div>
              </div>

              {/* Satisfaction */}
              <div className='flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full'>
                <CheckCircle2 className='w-5 h-5 text-green-500' />
                <div>
                  <p className='font-bold text-sm text-green-700 dark:text-green-400'>
                    98% Happy
                  </p>
                  <p className='text-xs text-muted-foreground'>Travelers</p>
                </div>
              </div>
            </div>

            {/* CTAs - Improved */}
            <div
              className='flex flex-col sm:flex-row gap-4 animate-in fade-in duration-700'
              style={{ animationDelay: '300ms' }}
            >
              <Button
                size='lg'
                className='text-base h-14 px-8 gap-2 w-full sm:w-auto  transition-all hover:scale-105'
                asChild
              >
                <Link href='/packages'>
                  Explore All Tours
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild
                className='text-base h-14 px-8 gap-2 w-full sm:w-auto  transition-all hover:scale-105'
              >
                <Link href='/contact'>
                  <Headset className='w-5 h-5 text-base' />
                  Contact Us
                </Link>
              </Button>
            </div>

            {/* Features - Quick highlights */}
            <div
              className='flex flex-wrap gap-4 justify-center lg:justify-start animate-in fade-in duration-700'
              style={{ animationDelay: '400ms' }}
            >
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <CheckCircle2 className='w-4 h-4 text-primary' />
                <span>Free Cancellation</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <CheckCircle2 className='w-4 h-4 text-primary' />
                <span>Best Price Guarantee</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <CheckCircle2 className='w-4 h-4 text-primary' />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Stats - Redesigned */}
            <div
              className='grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 animate-in fade-in duration-700'
              style={{ animationDelay: '500ms' }}
            >
              {[
                {
                  value: '50+',
                  label: 'Destinations',
                  color: 'from-blue-500/20 to-blue-500/5',
                },
                {
                  value: '10K+',
                  label: 'Travelers',
                  color: 'from-green-500/20 to-green-500/5',
                },
                {
                  value: '500+',
                  label: 'Tours',
                  color: 'from-purple-500/20 to-purple-500/5',
                },
                {
                  value: '4.8★',
                  label: 'Rating',
                  color: 'from-yellow-500/20 to-yellow-500/5',
                },
              ].map((stat, idx) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  key={idx}
                  className={`p-4 rounded-xl bg-linear-to-br ${stat.color} border border-border/50 hover:scale-105 transition-transform cursor-default`}
                >
                  <p className='text-2xl sm:text-3xl font-bold text-foreground'>
                    {stat.value}
                  </p>
                  <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Improved Image Section */}
          <div
            className='relative h-125 sm:h-150 lg:h-175 animate-in fade-in slide-in-from-right duration-700'
            style={{ animationDelay: '200ms' }}
          >
            {/* Mobile: Carousel with indicators */}
            <div className='lg:hidden relative w-full h-full'>
              <div className='relative w-full h-full rounded-3xl overflow-hidden shadow-2xl'>
                {/* Images */}
                {destinations.map((dest, idx) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className='object-cover'
                      priority={idx === 0}
                    />
                  </div>
                ))}

                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />

                {/* Content */}
                <div className='absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white'>
                  <Badge className='bg-primary/90 backdrop-blur-sm mb-3'>
                    <Sparkles className='w-3 h-3 mr-1' />
                    Featured Destination
                  </Badge>
                  <h3 className='text-3xl sm:text-4xl font-bold mb-2'>
                    {currentDestination.name}
                  </h3>
                  <p className='text-sm sm:text-base opacity-90 mb-6'>
                    {currentDestination.subtitle}
                  </p>

                  {/* Thumbnail navigation */}
                  <div className='flex gap-2'>
                    {destinations.map((dest, idx) => (
                      <Button
                        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'border-primary scale-110 shadow-xl'
                            : 'border-white/30 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          className='object-cover'
                        />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Floating rating badge */}
                <div className='absolute top-6 right-6 bg-background/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-2 border-primary/20'>
                  <div className='text-center'>
                    <p className='text-3xl font-bold text-primary'>4.8</p>
                    <div className='flex gap-0.5 mt-1 justify-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                          key={i}
                          className='w-3 h-3 fill-yellow-400 text-yellow-400'
                        />
                      ))}
                    </div>
                    <p className='text-xs text-muted-foreground mt-1 font-medium'>
                      10K+ Reviews
                    </p>
                  </div>
                </div>

                {/* Carousel indicators */}
                <div className='absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2'>
                  {destinations.map((_, idx) => (
                    <Button
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? 'w-8 bg-white'
                          : 'w-1.5 bg-white/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className='hidden lg:block relative w-full h-full'>
              {/* Main large image */}
              <div className='absolute top-0 right-0 w-[70%] h-[55%] rounded-2xl overflow-hidden shadow-2xl border-4 border-background z-10 group'>
                <Image
                  src={destinations[0].image}
                  alt={destinations[0].name}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                  <Badge className='bg-primary/90 backdrop-blur-sm mb-2'>
                    <Sparkles className='w-3 h-3 mr-1' />
                    Featured
                  </Badge>
                  <p className='text-2xl font-bold mb-1'>
                    {destinations[0].name}
                  </p>
                  <p className='text-sm opacity-90'>
                    {destinations[0].subtitle}
                  </p>
                </div>
              </div>

              {/* Secondary images */}
              <div className='absolute top-12 left-0 w-[45%] h-[35%] rounded-2xl overflow-hidden shadow-xl border-4 border-background z-20 group'>
                <Image
                  src={destinations[1].image}
                  alt={destinations[1].name}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                  <p className='font-bold'>{destinations[1].name}</p>
                  <p className='text-xs opacity-90'>
                    {destinations[1].subtitle}
                  </p>
                </div>
              </div>

              <div className='absolute bottom-0 left-8 w-[42%] h-[32%] rounded-2xl overflow-hidden shadow-xl border-4 border-background z-30 group'>
                <Image
                  src={destinations[2].image}
                  alt={destinations[2].name}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                  <p className='font-bold'>{destinations[2].name}</p>
                  <p className='text-xs opacity-90'>
                    {destinations[2].subtitle}
                  </p>
                </div>
              </div>

              <div className='absolute bottom-8 right-4 w-[35%] h-[28%] rounded-2xl overflow-hidden shadow-xl border-4 border-background z-20 group'>
                <Image
                  src={destinations[3].image}
                  alt={destinations[3].name}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-3 text-white'>
                  <p className='text-sm font-bold'>{destinations[3].name}</p>
                  <p className='text-xs opacity-90'>
                    {destinations[3].subtitle}
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div
                className='absolute top-[45%] left-[15%] z-40 bg-background/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-2 border-primary/20 animate-bounce'
                style={{ animationDuration: '3s' }}
              >
                <div className='text-center'>
                  <p className='text-3xl font-bold text-primary'>4.8</p>
                  <div className='flex gap-0.5 mt-1 justify-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                        key={i}
                        className='w-3.5 h-3.5 fill-primary text-primary'
                      />
                    ))}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1 font-medium'>
                    10K+ Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
