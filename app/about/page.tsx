'use client';

import {
  Award,
  Compass,
  Heart,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Target,
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
      {/* Hero Section */}
      <section className='relative min-h-[70vh] flex items-center justify-center overflow-hidden'>
        {/* Background Image */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&h=1080&fit=crop'
            alt='Bangladesh landscape'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background' />
        </div>

        {/* Content */}
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700'>
          <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm'>
            <Sparkles className='w-4 h-4' />
            <span>Est. 2020</span>
          </div>

          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'>
            Your Gateway to
            <span className='block text-primary mt-2'>Bangladesh</span>
          </h1>

          <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
            We're on a mission to help travelers discover the hidden gems, rich
            culture, and natural beauty of Bangladesh through authentic,
            sustainable, and unforgettable experiences.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
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
      </section>

      {/* Stats Section */}
      <section className='py-12 border-y border-border bg-secondary/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            {stats.map((stat, idx) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                key={idx}
                className='space-y-2 animate-in fade-in slide-in-from-bottom duration-700'
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className='flex items-center justify-center gap-2'>
                  <stat.icon className='w-5 h-5 text-primary' />
                  <p className='text-3xl md:text-4xl font-bold'>{stat.value}</p>
                </div>
                <p className='text-sm text-muted-foreground'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Image */}
            <div className='relative h-100 md:h-125 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-left duration-700'>
              <Image
                src='https://images.unsplash.com/photo-1667120205301-a2a3a886886e?w=800&h=600&fit=crop'
                alt='Bangladesh tea gardens'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent' />
              <div className='absolute bottom-6 left-6 right-6 text-white'>
                <p className='text-2xl font-bold'>Our Story</p>
                <p className='text-sm opacity-90 mt-1'>
                  Building bridges between travelers and local communities
                </p>
              </div>
            </div>

            {/* Content */}
            <div className='space-y-6 animate-in fade-in slide-in-from-right duration-700'>
              <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium'>
                <Compass className='w-4 h-4' />
                <span>Our Journey</span>
              </div>

              <h2 className='text-3xl md:text-4xl font-bold'>
                Connecting Travelers with the Heart of Bangladesh
              </h2>

              <div className='space-y-4 text-muted-foreground leading-relaxed'>
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
                  our natural and cultural heritage. Every tour booked through
                  GoShareBD directly contributes to local communities and
                  conservation efforts.
                </p>
              </div>

              <div className='flex items-center gap-4 pt-4'>
                <div className='flex -space-x-2'>
                  {team.slice(0, 3).map((member, idx) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
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

      {/* Values Section */}
      <section className='py-20 md:py-28 bg-secondary/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-700'>
            <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20'>
              <Target className='w-4 h-4' />
              <span>Our Values</span>
            </div>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
              What We Stand For
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Our core values guide everything we do, from selecting tour
              operators to supporting local communities
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
            {values.map((value, idx) => (
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                key={idx}
                className='border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom'
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardContent className='p-6 space-y-4'>
                  <div
                    className={`w-12 h-12 rounded-xl ${value.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className={`w-6 h-6 ${value.color}`} />
                  </div>
                  <h3 className='text-xl font-bold'>{value.title}</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id='team' className='py-20 md:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-700'>
            <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20'>
              <Users className='w-4 h-4' />
              <span>Our Team</span>
            </div>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
              Meet the People Behind GoShareBD
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              A passionate team dedicated to making your Bangladesh experience
              unforgettable
            </p>
          </div>

          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className='w-full animate-in fade-in duration-700'
            style={{ animationDelay: '200ms' }}
          >
            <CarouselContent className='-ml-4'>
              {team.map((member, idx) => (
                <CarouselItem
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  key={idx}
                  className='pl-4 md:basis-1/2 lg:basis-1/4 xl:basis-1/5'
                >
                  <Card className='border-2 overflow-hidden p-0 hover:border-primary/50 hover:shadow-xl transition-all duration-300  group h-full'>
                    <div className='relative h-64 overflow-hidden'>
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent' />
                    </div>
                    <CardContent className='p-6 space-y-2 -mt-16 relative z-10'>
                      <div className='bg-background rounded-lg p-4 shadow-lg'>
                        <h3 className='text-lg font-bold'>{member.name}</h3>
                        <p className='text-sm text-primary font-medium mb-2'>
                          {member.role}
                        </p>
                        <p className='text-xs text-muted-foreground'>
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
