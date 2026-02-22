'use client';

import {
  Award,
  Heart,
  MapPin,
  Shield,
  Star,
  TreePine,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Cta } from '@/components/landing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Authentic Experiences',
      description:
        'We connect travelers with genuine local experiences that showcase the true spirit of Bangladesh.',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description:
        'Your safety is our priority. All tours and guides are thoroughly vetted and verified.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TreePine,
      title: 'Sustainable Tourism',
      description:
        'We promote responsible travel that preserves our natural beauty and supports local communities.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Users,
      title: 'Community First',
      description:
        'We empower local guides and businesses, creating opportunities and fostering connections.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '10,000+' },
    { icon: MapPin, label: 'Destinations', value: '50+' },
    { icon: Award, label: 'Verified Tours', value: '500+' },
    { icon: Star, label: 'Average Rating', value: '4.8' },
  ];

  const team = [
    {
      name: 'Ahmed Rahman',
      role: 'Founder & CEO',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Passionate about showcasing Bangladesh to the world',
    },
    {
      name: 'Nadia Islam',
      role: 'Head of Operations',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Ensuring seamless travel experiences for all',
    },
    {
      name: 'Rafiq Ahmed',
      role: 'Tour Director',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Expert in creating unforgettable journeys',
    },
    {
      name: 'Priya Roy',
      role: 'Community Manager',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Building connections between travelers and locals',
    },
  ];

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className='relative min-h-[70vh] flex items-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80'
            alt='Bangladesh landscape'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-linear-to-r from-background/95 via-background/60 to-background/10' />
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-px w-12 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Est. 2020
              </span>
            </div>

            <h1 className='font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6'>
              Your gateway
              <br />
              <span className='italic font-light text-muted-foreground'>
                to
              </span>{' '}
              <span className='text-primary'>Bangladesh</span>
              <span className='text-primary'>.</span>
            </h1>

            <p className='text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8'>
              We're on a mission to help travelers discover the hidden gems,
              rich culture, and natural beauty of Bangladesh through authentic,
              sustainable, and unforgettable experiences.
            </p>

            <div className='flex flex-col sm:flex-row gap-3'>
              <Button size='lg' asChild className='text-base h-12 px-8'>
                <Link href='/packages'>Explore Tours</Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild
                className='text-base h-12 px-8'
              >
                <Link href='#team'>Meet Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className='border-y border-border bg-primary/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-border'>
            {stats.map((stat, idx) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={idx}
                className='py-10 px-6 text-center animate-in fade-in slide-in-from-bottom duration-700'
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <p className='font-display text-4xl md:text-5xl font-bold text-primary mb-1'>
                  {stat.value}
                </p>
                <div className='flex items-center justify-center gap-1.5 mt-2'>
                  <stat.icon className='w-3.5 h-3.5 text-muted-foreground' />
                  <p className='text-xs text-muted-foreground tracking-wide uppercase font-medium'>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────────────────────── */}
      <section className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
            {/* Image */}
            <div className='relative h-100 md:h-125 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-left duration-700'>
              <Image
                src='https://images.unsplash.com/photo-1667120205301-a2a3a886886e?w=800&h=600&fit=crop'
                alt='Bangladesh tea gardens'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />
              <div className='absolute bottom-6 left-6 right-6 text-white'>
                <p className='font-display text-2xl font-bold'>Our Story</p>
                <p className='text-sm opacity-80 mt-1'>
                  Building bridges between travelers and local communities
                </p>
              </div>
            </div>

            {/* Content */}
            <div className='space-y-6 animate-in fade-in slide-in-from-right duration-700'>
              <div className='flex items-center gap-3'>
                <div className='h-px w-12 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Our Journey
                </span>
              </div>

              <h2 className='font-display text-3xl md:text-4xl font-bold leading-tight'>
                Connecting travelers with the{' '}
                <span className='italic font-light text-muted-foreground'>
                  heart
                </span>{' '}
                of Bangladesh
              </h2>

              <div className='space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base'>
                <p>
                  Founded in 2020, GoShareBD was born from a simple belief: that
                  Bangladesh has so much more to offer than what meets the eye.
                  Our founders, a group of passionate travelers and local
                  guides, came together with a vision to showcase the authentic
                  beauty of our country.
                </p>
                <p>
                  What started as a small community initiative has grown into
                  Bangladesh's leading tour platform, connecting thousands of
                  travelers with verified local guides and authentic
                  experiences. We've helped visitors discover hidden waterfalls
                  in Bandarban, navigate the mystical mangroves of the
                  Sundarbans, and sip tea in the serene gardens of Sylhet.
                </p>
                <p>
                  Today, we're proud to support over 200 local guides and tour
                  operators, creating sustainable livelihoods while preserving
                  our natural and cultural heritage.
                </p>
              </div>

              <div className='flex items-center gap-4 pt-2'>
                <div className='flex -space-x-2'>
                  {team.slice(0, 3).map((member, idx) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: static list
                      key={idx}
                      className='relative w-10 h-10 rounded-full border-2 border-background overflow-hidden'
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ))}
                </div>
                <p className='text-sm text-muted-foreground'>
                  Join our community of passionate travelers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className='py-20 md:py-28 bg-primary/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Section header */}
          <div className='max-w-xl mb-14 animate-in fade-in slide-in-from-bottom duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-12 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Our Values
              </span>
            </div>
            <h2 className='font-display text-3xl md:text-4xl font-bold leading-tight mb-3'>
              What we{' '}
              <span className='italic font-light text-muted-foreground'>
                stand
              </span>{' '}
              for
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              Our core values guide everything we do, from selecting tour
              operators to supporting local communities.
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {values.map((value, idx) => (
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={idx}
                className='border-2 hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom'
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <CardContent className='p-6 space-y-4'>
                  <div
                    className={`w-11 h-11 rounded-xl ${value.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className={`w-5 h-5 ${value.color}`} />
                  </div>
                  <h3 className='font-display text-lg font-bold'>
                    {value.title}
                  </h3>
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section id='team' className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Section header */}
          <div className='max-w-xl mb-14 animate-in fade-in slide-in-from-bottom duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-12 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Our Team
              </span>
            </div>
            <h2 className='font-display text-3xl md:text-4xl font-bold leading-tight mb-3'>
              The people{' '}
              <span className='italic font-light text-muted-foreground'>
                behind
              </span>{' '}
              GoShareBD
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              A passionate team dedicated to making your Bangladesh experience
              unforgettable.
            </p>
          </div>

          <Carousel
            opts={{ align: 'start', loop: true }}
            className='w-full animate-in fade-in duration-700'
            style={{ animationDelay: '200ms' }}
          >
            <CarouselContent className='-ml-4'>
              {team.map((member, idx) => (
                <CarouselItem
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  key={idx}
                  className='pl-4 md:basis-1/2 lg:basis-1/4 xl:basis-1/5'
                >
                  <Card className='overflow-hidden p-0 border-2 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group h-full'>
                    <div className='relative h-64 overflow-hidden'>
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />
                    </div>
                    <CardContent className='p-0 -mt-16 relative z-10'>
                      <div className='bg-background mx-3 mb-3 rounded-xl p-4 shadow-lg border border-border/50'>
                        <h3 className='font-display text-base font-bold'>
                          {member.name}
                        </h3>
                        <p className='text-xs text-primary font-semibold tracking-wide mb-1.5'>
                          {member.role}
                        </p>
                        <p className='text-xs text-muted-foreground leading-relaxed'>
                          {member.bio}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='hidden md:flex -left-6' />
            <CarouselNext className='hidden md:flex -right-6' />
          </Carousel>
        </div>
      </section>

      <Cta />
    </div>
  );
}
