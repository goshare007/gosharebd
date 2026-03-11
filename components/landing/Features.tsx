'use client';

import {
  Calendar,
  DollarSign,
  MapPin,
  Shield,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { motion, useInView, type Variants } from 'motion/react';
import { useRef } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Star,
    title: 'Verified Tours & Guides',
    description:
      'Every tour and guide is rigorously vetted for quality, safety, and authenticity — so you can explore Bangladesh with complete confidence.',
    tag: 'Quality Assured',
  },
  {
    icon: DollarSign,
    title: 'Best Price Guarantee',
    description:
      "Find a lower price anywhere and we'll match it — no questions asked, no hidden fees.",
    tag: 'Best Value',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'Connect with local guides and like-minded travelers. Share stories, tips, and build friendships that outlast the trip.',
    tag: 'Local First',
  },
  {
    icon: TrendingUp,
    title: 'Real Reviews',
    description:
      'Honest, unfiltered feedback from verified travelers only. No paid promotions, no inflated ratings.',
    tag: 'Transparent',
  },
  {
    icon: Calendar,
    title: 'Flexible Booking',
    description:
      'Instant confirmations, easy amendments, and stress-free cancellations. Travel on your terms.',
    tag: 'No Stress',
  },
  {
    icon: MapPin,
    title: 'Hidden Gems',
    description:
      'Go beyond the tourist trail. Our local guides reveal the authentic Bangladesh most visitors never see.',
    tag: 'Off the Map',
  },
];

// ── Animation config ──────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

// ── Feature card — matches the contact channel card pattern ──────────────────

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className='group rounded-2xl border border-border p-6 hover:border-primary/30 hover:bg-primary/2 transition-colors duration-300 cursor-default flex flex-col gap-5'
    >
      {/* Top row: icon + tag */}
      <div className='flex items-start justify-between'>
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: 'spring', stiffness: 340, damping: 18 }}
          className='w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300'
        >
          <feature.icon className='w-5 h-5 text-primary' />
        </motion.div>

        <span className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground border border-border rounded-full px-2.5 py-1 group-hover:border-primary/30 group-hover:text-primary transition-colors duration-300'>
          {feature.tag}
        </span>
      </div>

      {/* Content */}
      <div className='space-y-2 flex-1'>
        {/* Index line — same editorial rule pattern as contact page */}
        <div className='flex items-center gap-2.5 mb-3'>
          <div className='h-px w-5 bg-primary/40 group-hover:w-8 transition-all duration-300' />
          <span className='text-[10px] font-semibold tracking-[0.2em] uppercase text-primary/60'>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h3 className='text-base font-bold tracking-tight group-hover:text-primary transition-colors duration-200 leading-snug'>
          {feature.title}
        </h3>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Features() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <section
      id='features'
      className='py-16 md:py-24 border-b border-border bg-background relative overflow-hidden'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* ── Section header — matches contact page hero header pattern ── */}
        <div ref={headerRef} className='mb-14'>
          {/* Editorial eyebrow — identical pattern to contact page */}
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate={headerInView ? 'show' : 'hidden'}
            custom={0}
            className='flex items-center gap-3 mb-5'
          >
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Why GoShareBD
            </span>
          </motion.div>

          <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6'>
            <motion.h2
              variants={fadeUp}
              initial='hidden'
              animate={headerInView ? 'show' : 'hidden'}
              custom={0.1}
              className='text-3xl sm:text-5xl font-bold tracking-tight leading-tight md:max-w-xl'
            >
              Everything you need for an{' '}
              <span className='italic font-light text-muted-foreground'>
                unforgettable
              </span>{' '}
              journey
              <span className='text-primary'>.</span>
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate={headerInView ? 'show' : 'hidden'}
              custom={0.2}
              className='flex items-center gap-3 lg:pb-1'
            >
              <Shield className='w-4 h-4 text-primary shrink-0' />
              <p className='text-sm text-muted-foreground max-w-xs leading-relaxed'>
                Trusted by over 10,000 travelers across Bangladesh since 2020.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Feature grid ── */}
        <motion.div
          ref={gridRef}
          variants={gridVariants}
          initial='hidden'
          animate={gridInView ? 'show' : 'hidden'}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
