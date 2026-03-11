'use client';

import { ArrowRight, Headset, MapPin } from 'lucide-react';
import { motion, useInView, type Variants } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

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

// ── Destinations strip data ───────────────────────────────────────────────────

const destinations = [
  "Cox's Bazar",
  'Sundarbans',
  'Sylhet',
  'Bandarban',
  'Sajek',
  'Ratargul',
  'Saint Martin',
  'Kuakata',
];

// ── Main component ────────────────────────────────────────────────────────────

export default function Cta() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className='py-16 md:py-24 bg-background relative overflow-hidden'>
      {/* Subtle ambient glow — consistent with Features section */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 bg-primary/5 rounded-full blur-3xl pointer-events-none'
      />

      <div
        ref={ref}
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'
      >
        {/* ── Main CTA card ── */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={isInView ? 'show' : 'hidden'}
          custom={0}
          className='rounded-2xl border border-border overflow-hidden'
        >
          {/* Top content area */}
          <div className='p-8 md:p-12 lg:p-16'>
            <div className='max-w-3xl mx-auto flex flex-col items-center text-center gap-8'>
              {/* Eyebrow */}
              <div className='flex items-center gap-3'>
                <div className='h-px w-10 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Start your journey
                </span>
                <div className='h-px w-10 bg-primary' />
              </div>

              {/* Headline */}
              <motion.h2
                variants={fadeUp}
                initial='hidden'
                animate={isInView ? 'show' : 'hidden'}
                custom={0.1}
                className='text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]'
              >
                Ready to explore{' '}
                <span className='italic font-light text-muted-foreground'>
                  beautiful
                </span>{' '}
                Bangladesh
                <span className='text-primary'>?</span>
              </motion.h2>

              {/* Subtext */}
              <motion.p
                variants={fadeUp}
                initial='hidden'
                animate={isInView ? 'show' : 'hidden'}
                custom={0.2}
                className='text-lg text-muted-foreground leading-relaxed max-w-xl'
              >
                Join 10,000+ travelers who have discovered the raw beauty of
                Bangladesh — from mangrove forests to mountain peaks.
              </motion.p>

              {/* CTAs — side by side, same as Hero */}
              <motion.div
                variants={fadeUp}
                initial='hidden'
                animate={isInView ? 'show' : 'hidden'}
                custom={0.3}
                className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'
              >
                {/* Primary with one-time pulse ring */}
                <div className='relative'>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={
                      isInView
                        ? { scale: [1, 1.08, 1], opacity: [0.6, 0.15, 0] }
                        : { opacity: 0 }
                    }
                    transition={{ delay: 1.2, duration: 1.8, ease: 'easeOut' }}
                    className='absolute inset-0 rounded-lg bg-primary pointer-events-none'
                  />
                  <Button
                    size='lg'
                    asChild
                    className='h-12 px-8 gap-2 text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform w-full sm:w-auto'
                  >
                    <Link href='/packages'>
                      Browse All Tours
                      <ArrowRight className='w-4 h-4' />
                    </Link>
                  </Button>
                </div>

                <Button
                  size='lg'
                  variant='outline'
                  asChild
                  className='h-12 px-8 gap-2 text-base hover:scale-105 transition-transform w-full sm:w-auto'
                >
                  <Link href='/contact'>
                    <Headset className='w-4 h-4' />
                    Talk to Us
                  </Link>
                </Button>
              </motion.div>

              {/* Trust micro-copy */}
              <motion.div
                variants={fadeUp}
                initial='hidden'
                animate={isInView ? 'show' : 'hidden'}
                custom={0.4}
                className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground'
              >
                {[
                  'Free cancellation',
                  'Best price guarantee',
                  '24/7 support',
                ].map((f) => (
                  <span key={f} className='flex items-center gap-1.5'>
                    <span className='w-1 h-1 rounded-full bg-primary/50' />
                    {f}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── Destinations strip — same divided table pattern ── */}
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate={isInView ? 'show' : 'hidden'}
            custom={0.45}
            className='border-t border-border'
          >
            <div className='flex items-center divide-x divide-border overflow-x-auto scrollbar-none'>
              {/* Label */}
              <div className='flex items-center gap-2 px-5 py-4 shrink-0'>
                <MapPin className='w-3.5 h-3.5 text-primary shrink-0' />
                <span className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground whitespace-nowrap'>
                  Popular destinations
                </span>
              </div>

              {/* Destination pills */}
              {destinations.map((dest) => (
                <Link
                  key={dest}
                  href={`/packages?destination=${encodeURIComponent(dest)}`}
                  className='px-5 py-4 shrink-0 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/3 transition-colors duration-200 whitespace-nowrap'
                >
                  {dest}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
