'use client';

import Autoplay from 'embla-carousel-autoplay';
import { Quote, Star } from 'lucide-react';
import { motion, useInView, type Variants } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// ── Data ──────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Sarah Khan',
    location: 'Dhaka',
    text: 'GoShareBD made it so easy to find authentic tours! The guides were knowledgeable and friendly. Best trip ever to the Sundarbans.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    tour: 'Sundarbans Safari',
  },
  {
    name: 'Ahmed Hassan',
    location: 'Chittagong',
    text: 'The Sundarbans tour was absolutely incredible. Worth every taka. The wildlife, the scenery, everything was perfect. Highly recommend GoShareBD.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tour: 'Mangrove Explorer',
  },
  {
    name: 'Priya Roy',
    location: 'Sylhet',
    text: "Amazing experiences and even better prices. The tea garden tour was breathtaking. The community here is so welcoming. Can't wait to book again.",
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    tour: 'Tea Garden Tour',
  },
  {
    name: 'Rafiq Ahmed',
    location: 'Bandarban',
    text: 'The mountain trek exceeded all expectations. Professional guides, stunning views, and a well-organized itinerary. GoShareBD is the real deal.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    tour: 'Mountain Adventure',
  },
  {
    name: 'Nadia Islam',
    location: "Cox's Bazar",
    text: 'The beach tour was fantastic — great value and the sunset views were unforgettable. Will absolutely recommend to friends and family.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    tour: 'Beach Paradise',
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

// ── Testimonial card ──────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <div className='group rounded-2xl border border-border bg-background hover:border-primary/30 transition-colors duration-300 p-6 h-full flex flex-col gap-5 cursor-default'>
      {/* Top row: quote icon + stars */}
      <div className='flex items-center justify-between'>
        <div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300'>
          <Quote className='w-4 h-4 text-primary' />
        </div>

        <div className='flex items-center gap-0.5'>
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400'
            />
          ))}
        </div>
      </div>

      {/* Review text */}
      <p className='text-sm text-foreground leading-relaxed flex-1'>
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Tour tag — same editorial divider pattern */}
      <div className='flex items-center gap-2.5'>
        <div className='h-px w-5 bg-primary/40 group-hover:w-8 transition-all duration-300' />
        <span className='text-[10px] font-semibold tracking-[0.18em] uppercase text-primary/60'>
          {testimonial.tour}
        </span>
      </div>

      {/* Divider */}
      <div className='h-px bg-border' />

      {/* Profile row — matches contact channel card pattern */}
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full overflow-hidden border border-border shrink-0'>
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={40}
            height={40}
            className='w-full h-full object-cover'
          />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-bold text-foreground leading-tight truncate'>
            {testimonial.name}
          </p>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {testimonial.location}
          </p>
        </div>
        {/* Verified badge */}
        <span className='text-[10px] font-semibold tracking-wide uppercase bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/15 px-2 py-1 rounded-full shrink-0'>
          Verified
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });
  const bodyInView = useInView(bodyRef, { once: true, margin: '-60px' });

  // Overall rating summary
  const totalReviews = 10247;
  const avgRating = 4.8;

  return (
    <section
      id='testimonials'
      className=' bg-background relative overflow-hidden'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* ── Section header ── */}
        <div ref={headerRef} className='mb-14'>
          {/* Eyebrow — same pattern across all sections */}
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate={headerInView ? 'show' : 'hidden'}
            custom={0}
            className='flex items-center gap-3 mb-5'
          >
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Traveler Reviews
            </span>
          </motion.div>

          <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6'>
            <motion.h2
              variants={fadeUp}
              initial='hidden'
              animate={headerInView ? 'show' : 'hidden'}
              custom={0.1}
              className='text-3xl sm:text-5xl font-bold tracking-tight leading-tight max-w-xl'
            >
              What our{' '}
              <span className='italic font-light text-muted-foreground'>
                travelers
              </span>{' '}
              say
              <span className='text-primary'>.</span>
            </motion.h2>

            {/* Aggregate rating — right-aligned on desktop */}
            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate={headerInView ? 'show' : 'hidden'}
              custom={0.2}
              className='flex items-center gap-4 lg:pb-1'
            >
              <div className='text-right'>
                <p className='text-3xl font-bold text-foreground leading-none'>
                  {avgRating}
                </p>
                <div className='flex items-center gap-0.5 mt-1 justify-end'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      // biome-ignore lint/suspicious/noArrayIndexKey: static list
                      key={i}
                      className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400'
                    />
                  ))}
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {totalReviews.toLocaleString()} verified reviews
                </p>
              </div>
              <div className='h-12 w-px bg-border' />
              <p className='text-sm text-muted-foreground max-w-35 leading-relaxed'>
                Real experiences from real travelers
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div ref={bodyRef}>
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate={bodyInView ? 'show' : 'hidden'}
            custom={0}
          >
            <Carousel
              opts={{ align: 'start', loop: true }}
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
              className='w-full'
            >
              <CarouselContent className='-ml-4'>
                {testimonials.map((testimonial, idx) => (
                  <CarouselItem
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    key={idx}
                    className='pl-4 md:basis-1/2 lg:basis-1/3'
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Nav buttons — positioned flush with section */}
              <div className='flex items-center gap-2 mt-8'>
                <CarouselPrevious className='static translate-y-0 rounded-xl border-border hover:border-primary/30 hover:bg-primary/5' />
                <CarouselNext className='static translate-y-0 rounded-xl border-border hover:border-primary/30 hover:bg-primary/5' />
              </div>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
