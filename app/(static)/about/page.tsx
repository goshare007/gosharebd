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
import { motion, useInView, type Variants } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import img1 from '@/assets/about/about-1.webp';
import img2 from '@/assets/about/about-2.webp';
import { Cta } from '@/components/landing';
import { Button } from '@/components/ui/button';

// ── Animation config ──────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE, delay },
  }),
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { icon: Users, label: 'Happy Travelers', value: '10,000+' },
  { icon: MapPin, label: 'Destinations', value: '50+' },
  { icon: Award, label: 'Verified Tours', value: '500+' },
  { icon: Star, label: 'Average Rating', value: '4.8★' },
];

const values = [
  {
    icon: Heart,
    title: 'Authentic Experiences',
    description:
      'We connect travelers with genuine local experiences that showcase the true spirit of Bangladesh.',
    tag: 'Culture',
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description:
      'Your safety is our priority. All tours and guides are thoroughly vetted and verified.',
    tag: 'Verified',
  },
  {
    icon: TreePine,
    title: 'Sustainable Tourism',
    description:
      'We promote responsible travel that preserves our natural beauty and supports local communities.',
    tag: 'Eco',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'We empower local guides and businesses, creating opportunities and fostering connections.',
    tag: 'Local',
  },
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-60px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });
  const storyInView = useInView(storyRef, { once: true, margin: '-60px' });
  const valuesInView = useInView(valuesRef, { once: true, margin: '-60px' });
  const teamInView = useInView(teamRef, { once: true, margin: '-60px' });

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className='relative min-h-[70vh] flex items-center overflow-hidden border-b border-border'>
        <div className='absolute inset-0 z-0'>
          <Image
            src={img1}
            alt='Bangladesh landscape'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-linear-to-r from-black/95 via-black/70 to-black/20' />
        </div>

        <div
          ref={heroRef}
          className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20'
        >
          <div className='max-w-2xl'>
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate={heroInView ? 'show' : 'hidden'}
              custom={0}
              className='flex items-center gap-3 mb-6'
            >
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Est. 2020
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial='hidden'
              animate={heroInView ? 'show' : 'hidden'}
              custom={0.1}
              className='text-5xl sm:text-6xl md:text-7xl text-white font-bold leading-[1.05] tracking-tight mb-6'
            >
              Your gateway{' '}
              <span className='italic font-light text-muted-foreground'>
                to
              </span>{' '}
              Bangladesh
              <span className='text-primary'>.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial='hidden'
              animate={heroInView ? 'show' : 'hidden'}
              custom={0.2}
              className='text-base md:text-lg text-gray-300 max-w-xl leading-relaxed mb-8'
            >
              We're on a mission to help travelers discover the hidden gems,
              rich culture, and natural beauty of Bangladesh through authentic,
              sustainable, and unforgettable experiences.
            </motion.p>

            {/* CTAs — always side by side */}
            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate={heroInView ? 'show' : 'hidden'}
              custom={0.3}
              className='flex flex-row gap-3'
            >
              <Button
                size='lg'
                asChild
                className='h-12 px-8 gap-2 flex-1 sm:flex-none'
              >
                <Link href='/packages'>Explore Tours</Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild
                className='h-12 px-8 flex-1 sm:flex-none'
              >
                <Link href='#team'>Meet Our Team</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats — divided table pattern ────────────────────────────────── */}
      <div ref={statsRef}>
        <motion.div
          variants={gridVariants}
          initial='hidden'
          animate={statsInView ? 'show' : 'hidden'}
          className='border-b border-border'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border'>
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={cardVariants}
                  className='py-10 px-6 flex flex-col items-center justify-center gap-2'
                >
                  <p className='text-4xl md:text-5xl font-bold text-primary tabular-nums'>
                    {stat.value}
                  </p>
                  <div className='flex items-center gap-1.5'>
                    <stat.icon className='w-3.5 h-3.5 text-muted-foreground' />
                    <p className='text-xs text-muted-foreground tracking-wide uppercase font-medium'>
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Our Story ────────────────────────────────────────────────────── */}
      <section className='py-20 md:py-28 border-b border-border'>
        <div ref={storyRef} className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
            {/* Image */}
            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate={storyInView ? 'show' : 'hidden'}
              custom={0}
              className='relative h-105 md:h-130 rounded-2xl overflow-hidden border border-border'
            >
              <Image
                src={img2}
                alt='Bangladesh tea gardens'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />

              {/* Floating caption — same style as PopularPackages image overlay */}
              <div className='absolute bottom-0 left-0 right-0 p-6'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='h-px w-5 bg-white/60' />
                  <span className='text-[10px] font-semibold tracking-[0.18em] uppercase text-white/60'>
                    Our Story
                  </span>
                </div>
                <p className='text-white text-xl font-bold leading-snug'>
                  Building bridges between travelers and local communities
                </p>
              </div>
            </motion.div>

            {/* Content */}
            <div className='space-y-6'>
              <motion.div
                variants={fadeUp}
                initial='hidden'
                animate={storyInView ? 'show' : 'hidden'}
                custom={0.1}
                className='flex items-center gap-3'
              >
                <div className='h-px w-10 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Our Journey
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                initial='hidden'
                animate={storyInView ? 'show' : 'hidden'}
                custom={0.15}
                className='text-3xl md:text-4xl font-bold leading-tight tracking-tight'
              >
                Connecting travelers with the{' '}
                <span className='italic font-light text-muted-foreground'>
                  heart
                </span>{' '}
                of Bangladesh
                <span className='text-primary'>.</span>
              </motion.h2>

              <motion.div
                variants={fadeUp}
                initial='hidden'
                animate={storyInView ? 'show' : 'hidden'}
                custom={0.2}
                className='space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base'
              >
                <p>
                  Founded in 2020, GoShareBD was born from a simple belief: that
                  Bangladesh has so much more to offer than what meets the eye.
                  Our founders — a group of passionate travelers and local
                  guides — came together with a vision to showcase the authentic
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
              </motion.div>

              {/* Avatar stack + copy */}
              <motion.div
                variants={fadeUp}
                initial='hidden'
                animate={storyInView ? 'show' : 'hidden'}
                custom={0.3}
                className='flex items-center gap-4 pt-2'
              >
                <div className='flex -space-x-2.5'>
                  {team.slice(0, 3).map((member) => (
                    <div
                      key={member.name}
                      className='relative w-9 h-9 rounded-full border-2 border-background overflow-hidden'
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ))}
                  {/* +count bubble */}
                  <div className='relative w-9 h-9 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center'>
                    <span className='text-[10px] font-bold text-primary'>
                      200+
                    </span>
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Local guides across Bangladesh
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className='py-20 md:py-28 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div ref={valuesRef} className='mb-14'>
            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate={valuesInView ? 'show' : 'hidden'}
              custom={0}
              className='flex items-center gap-3 mb-5'
            >
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Our Values
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              initial='hidden'
              animate={valuesInView ? 'show' : 'hidden'}
              custom={0.1}
              className='text-3xl md:text-4xl font-bold leading-tight tracking-tight max-w-xl'
            >
              What we{' '}
              <span className='italic font-light text-muted-foreground'>
                stand
              </span>{' '}
              for
              <span className='text-primary'>.</span>
            </motion.h2>
          </div>

          {/* Cards grid — same pattern as Features */}
          <motion.div
            variants={gridVariants}
            initial='hidden'
            animate={valuesInView ? 'show' : 'hidden'}
            className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'
          >
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className='group rounded-2xl border border-border p-6 hover:border-primary/30 hover:bg-primary/2 transition-colors duration-300 flex flex-col gap-4'
              >
                {/* Icon — same treatment as Features */}
                <div className='flex items-center justify-between'>
                  <div className='w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300'>
                    <value.icon className='w-5 h-5 text-primary' />
                  </div>
                  {/* Tag pill */}
                  <span className='text-[10px] font-semibold tracking-[0.18em] uppercase border border-border rounded-full px-2.5 py-1 text-muted-foreground group-hover:border-primary/30 transition-colors duration-300'>
                    {value.tag}
                  </span>
                </div>

                <h3 className='text-base font-bold leading-snug'>
                  {value.title}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed flex-1'>
                  {value.description}
                </p>

                {/* Animated rule — same as Features cards */}
                <div className='flex items-center gap-2'>
                  <div className='h-px w-5 bg-primary/40 group-hover:w-8 transition-all duration-300' />
                  <span className='text-[10px] text-primary/60 font-semibold tracking-wide uppercase'>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section id='team' className='pt-20 md:pt-28 '>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div ref={teamRef} className='mb-14'>
            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate={teamInView ? 'show' : 'hidden'}
              custom={0}
              className='flex items-center gap-3 mb-5'
            >
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Our Team
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              initial='hidden'
              animate={teamInView ? 'show' : 'hidden'}
              custom={0.1}
              className='text-3xl md:text-4xl font-bold leading-tight tracking-tight max-w-xl'
            >
              The people{' '}
              <span className='italic font-light text-muted-foreground'>
                behind
              </span>{' '}
              GoShareBD
              <span className='text-primary'>.</span>
            </motion.h2>
          </div>

          {/* Team cards grid — same card pattern as PopularPackages */}
          <motion.div
            variants={gridVariants}
            initial='hidden'
            animate={teamInView ? 'show' : 'hidden'}
            className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className='group rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-300'
              >
                {/* Photo */}
                <div className='relative h-56 overflow-hidden'>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
                </div>

                {/* Info */}
                <div className='p-5 flex flex-col gap-3'>
                  <div>
                    <h3 className='text-base font-bold leading-tight'>
                      {member.name}
                    </h3>
                    <div className='flex items-center gap-2 mt-2'>
                      <div className='h-px w-5 bg-primary/40 group-hover:w-8 transition-all duration-300' />
                      <span className='text-[10px] font-semibold tracking-[0.18em] uppercase text-primary/60'>
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Cta />
    </div>
  );
}
