'use client';

import Autoplay from 'embla-carousel-autoplay';
import {
  ArrowRight,
  CheckCircle2,
  Headset,
  MapPin,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useInView,
  type Variants,
} from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const destinations = [
  {
    name: "Cox's Bazar",
    subtitle: "World's longest natural beach",
    tag: 'Most Popular',
    image:
      'https://images.unsplash.com/photo-1665152038920-e3b63b660075?q=80&w=774&auto=format&fit=crop',
  },
  {
    name: 'Sundarbans',
    subtitle: 'Royal Bengal Tiger habitat',
    tag: 'Wildlife',
    image:
      'https://images.unsplash.com/photo-1551615577-1c7e180a77ac?q=80&w=967&auto=format&fit=crop',
  },
  {
    name: 'Sylhet',
    subtitle: 'Enchanting tea gardens',
    tag: 'Nature',
    image:
      'https://images.unsplash.com/photo-1667120205301-a2a3a886886e?q=80&w=774&auto=format&fit=crop',
  },
  {
    name: 'Bandarban',
    subtitle: 'Mountain paradise',
    tag: 'Adventure',
    image:
      'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?q=80&w=801&auto=format&fit=crop',
  },
];

const travelers = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
];

const stats = [
  { value: 50, display: '50+', label: 'Destinations' },
  { value: 10000, display: '10K+', label: 'Travelers' },
  { value: 500, display: '500+', label: 'Tours' },
  { value: 4.8, display: '4.8★', label: 'Rating' },
];

const desktopPositions = [
  'top-12 left-0 w-[44%] h-[34%] z-20',
  'bottom-0 left-8 w-[42%] h-[32%] z-30',
  'bottom-8 right-4 w-[34%] h-[28%] z-20',
];

// ── Animation variants ────────────────────────────────────────────────────────
// motion v11+: cubic bezier easing must be a typed 4-tuple, not number[]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut', delay },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
};

// ── Animated stat counter (desktop) ──────────────────────────────────────────
function StatCounter({ stat }: { stat: (typeof stats)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const duration = 900;
      const steps = 40;
      const stepMs = duration / steps;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const eased = 1 - (1 - step / steps) ** 3;
        const current = eased * stat.value;
        if (stat.label === 'Rating') {
          setDisplayed(`${Math.min(current, stat.value).toFixed(1)}★`);
        } else if (stat.label === 'Travelers') {
          setDisplayed(`${Math.round(Math.min(current, stat.value) / 1000)}K+`);
        } else {
          setDisplayed(`${Math.round(Math.min(current, stat.value))}+`);
        }
        if (step >= steps) {
          setDisplayed(stat.display);
          clearInterval(interval);
        }
      }, stepMs);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timeout);
  }, [isInView, stat]);

  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial='hidden'
      animate={isInView ? 'show' : 'hidden'}
      custom={0}
      className='p-4 rounded-xl bg-muted/40 border border-border/50 hover:scale-105 transition-transform cursor-default text-center'
    >
      <p className='text-2xl font-bold tabular-nums'>{displayed}</p>
      <p className='text-xs text-muted-foreground mt-1'>{stat.label}</p>
    </motion.div>
  );
}

// ── Animated stat counter (mobile strip) ─────────────────────────────────────
function MobileStatCounter({
  stat,
  delay,
}: {
  stat: (typeof stats)[0];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const duration = 800;
      const steps = 35;
      const stepMs = duration / steps;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const eased = 1 - (1 - step / steps) ** 3;
        const current = eased * stat.value;
        if (stat.label === 'Rating') {
          setDisplayed(`${Math.min(current, stat.value).toFixed(1)}★`);
        } else if (stat.label === 'Travelers') {
          setDisplayed(`${Math.round(Math.min(current, stat.value) / 1000)}K+`);
        } else {
          setDisplayed(`${Math.round(Math.min(current, stat.value))}+`);
        }
        if (step >= steps) {
          setDisplayed(stat.display);
          clearInterval(interval);
        }
      }, stepMs);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, stat, delay]);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial='hidden'
      animate={isInView ? 'show' : 'hidden'}
      custom={delay / 1000}
      className='text-center'
    >
      <p className='text-xl font-bold text-foreground tabular-nums'>
        {displayed}
      </p>
      <p className='text-[10px] text-muted-foreground mt-0.5'>{stat.label}</p>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIdx(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section className='relative min-h-screen flex flex-col overflow-hidden bg-background'>
      {/* ─── MOBILE LAYOUT ───────────────────────────────────────────── */}
      <div className='flex flex-col lg:hidden min-h-screen'>
        {/* Carousel fades in on mount */}
        <motion.div
          variants={fadeIn}
          initial='hidden'
          animate='show'
          custom={0}
          className='w-full'
        >
          <Carousel
            setApi={setApi}
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            opts={{ loop: true }}
            className='w-full'
          >
            <CarouselContent>
              {destinations.map((dest, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <CarouselItem key={idx}>
                  <div className='relative w-full' style={{ height: '52svh' }}>
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className='object-cover'
                      priority={idx === 0}
                    />
                    <div className='absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black' />

                    {/* Tag */}
                    <div className='absolute top-4 left-4'>
                      <Badge className='bg-primary/90 backdrop-blur-sm text-primary-foreground gap-1 text-xs px-3 py-1'>
                        <Sparkles className='w-3 h-3' />
                        {dest.tag}
                      </Badge>
                    </div>

                    {/* Trust pill */}
                    <div className='absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg'>
                      <Star className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400' />
                      <span className='text-xs font-bold'>4.8</span>
                      <span className='text-xs text-muted-foreground'>
                        · 10K+
                      </span>
                    </div>

                    {/* Location text — slides up/down on slide change */}
                    <AnimatePresence mode='wait'>
                      {activeIdx === idx && (
                        <motion.div
                          key={dest.name}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className='absolute bottom-6 left-4 text-white'
                        >
                          <div className='flex items-center gap-1.5 mb-0.5'>
                            <MapPin className='w-4 h-4 opacity-80' />
                            <span className='text-sm font-medium opacity-80'>
                              Bangladesh
                            </span>
                          </div>
                          <p className='text-2xl font-bold leading-tight'>
                            {dest.name}
                          </p>
                          <p className='text-sm opacity-80 mt-0.5'>
                            {dest.subtitle}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>

        {/* Destination Switcher Pills */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate='show'
          custom={0.15}
          className='flex gap-2 px-4 pt-4 overflow-x-auto scrollbar-none'
        >
          {destinations.map((dest, idx) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={idx}
              type='button'
              onClick={() => api?.scrollTo(idx)}
              className={`flex-none flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                idx === activeIdx
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {/* Icon slides in with layoutId for smooth transfer */}
              {idx === activeIdx && (
                <motion.span
                  layoutId='mobile-active-pill-icon'
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <MapPin className='w-3.5 h-3.5' />
                </motion.span>
              )}
              {dest.name}
            </button>
          ))}
        </motion.div>

        {/* Content Block */}
        <div className='flex flex-col flex-1 px-4 pt-5 pb-6 gap-5'>
          {/* Headline */}
          <div>
            <motion.h1
              variants={fadeUp}
              initial='hidden'
              animate='show'
              custom={0.2}
              className='text-4xl font-extrabold tracking-tight leading-[1.1]'
            >
              See the Beauty.
              <br />
              <span className='text-primary'>GoShare</span> the Story.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial='hidden'
              animate='show'
              custom={0.3}
              className='text-muted-foreground text-sm mt-2.5 leading-relaxed'
            >
              10,000+ travelers have found their paradise with us. Guided tours
              across Bangladesh&apos;s most breathtaking destinations.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate='show'
            custom={0.4}
            className='flex gap-3'
          >
            {/* Primary CTA — one-time pulse ring after load settles */}
            <div className='relative flex-1'>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.2, 0] }}
                transition={{ delay: 1.4, duration: 1.6, ease: 'easeOut' }}
                className='absolute inset-0 rounded-lg bg-primary pointer-events-none'
              />
              <Button
                size='lg'
                className='w-full h-12 text-sm gap-1.5 shadow-lg shadow-primary/20'
                asChild
              >
                <Link href='/packages'>
                  Explore Tours
                  <ArrowRight className='w-4 h-4' />
                </Link>
              </Button>
            </div>
            <Button
              variant='outline'
              size='lg'
              className='h-12 px-4 gap-1.5 text-sm'
              asChild
            >
              <Link href='/contact'>
                <Headset className='w-4 h-4' />
                Contact
              </Link>
            </Button>
          </motion.div>

          {/* Social Proof Bar */}
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate='show'
            custom={0.5}
            className='flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3 border border-border/40'
          >
            <div className='flex items-center gap-2.5'>
              <div className='flex -space-x-2.5'>
                {travelers.map((avatar, idx) => (
                  <motion.div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.55 + idx * 0.07,
                      duration: 0.35,
                      ease: 'easeOut',
                    }}
                    className='w-8 h-8 rounded-full border-2 border-background overflow-hidden'
                  >
                    <Image
                      src={avatar}
                      alt=''
                      width={32}
                      height={32}
                      className='object-cover'
                    />
                  </motion.div>
                ))}
              </div>
              <div>
                <p className='text-xs font-semibold'>10,247 happy travelers</p>
                <div className='flex items-center gap-0.5 mt-0.5'>
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      // biome-ignore lint/suspicious/noArrayIndexKey: static list
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.06, duration: 0.25 }}
                    >
                      <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-1.5 bg-green-500/10 rounded-full px-3 py-1.5'>
              <CheckCircle2 className='w-4 h-4 text-green-500' />
              <span className='text-xs font-bold text-green-700 dark:text-green-400'>
                98% Happy
              </span>
            </div>
          </motion.div>

          {/* Trust Micro-copy */}
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate='show'
            custom={0.6}
            className='flex items-center justify-center gap-4 text-xs text-muted-foreground'
          >
            {['Free Cancellation', 'Best Price', '24/7 Support'].map((f) => (
              <span key={f} className='flex items-center gap-1'>
                <CheckCircle2 className='w-3.5 h-3.5 text-primary' />
                {f}
              </span>
            ))}
          </motion.div>

          {/* Animated Stats Strip */}
          <div className='grid grid-cols-4 gap-2 pt-1'>
            {stats.map((stat, i) => (
              <MobileStatCounter key={stat.label} stat={stat} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT ──────────────────────────────────────────── */}
      <div className='hidden lg:flex min-h-screen items-center'>
        {/* Decorative blobs — slow ambient float */}
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none'
        />
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className='absolute bottom-20 right-10 w-120 h-120 bg-secondary/10 rounded-full blur-3xl pointer-events-none'
        />

        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10 w-full'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            {/* Left — Content */}
            <div className='space-y-8'>
              <div className='space-y-5'>
                <motion.h1
                  variants={fadeUp}
                  initial='hidden'
                  animate='show'
                  custom={0.1}
                  className='text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05]'
                >
                  See the Beauty. <br />
                  <span className='text-primary'>GoShare</span> the Story.
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  initial='hidden'
                  animate='show'
                  custom={0.25}
                  className='text-xl text-muted-foreground max-w-lg leading-relaxed'
                >
                  Go beyond the map with 10,000+ travelers who found their
                  paradise. Experience the raw beauty of pristine shores and
                  mystical highlands.
                </motion.p>
              </div>

              {/* Social proof */}
              <motion.div
                variants={fadeUp}
                initial='hidden'
                animate='show'
                custom={0.35}
                className='flex items-center gap-8'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex -space-x-3'>
                    {travelers.map((avatar, idx) => (
                      <motion.div
                        // biome-ignore lint/suspicious/noArrayIndexKey: static list
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.08, duration: 0.35 }}
                        className='w-10 h-10 rounded-full border-2 border-background overflow-hidden'
                      >
                        <Image
                          src={avatar}
                          alt=''
                          width={40}
                          height={40}
                          className='object-cover'
                        />
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.72, duration: 0.35 }}
                      className='w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground'
                    >
                      10K+
                    </motion.div>
                  </div>
                  <div>
                    <div className='flex gap-0.5 mb-0.5'>
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          // biome-ignore lint/suspicious/noArrayIndexKey: static list
                          key={i}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.5 + i * 0.07,
                            type: 'spring',
                            stiffness: 300,
                          }}
                        >
                          <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                        </motion.span>
                      ))}
                    </div>
                    <p className='text-sm font-semibold'>
                      4.8 · 10,247 reviews
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2 px-4 py-2.5 bg-green-500/10 rounded-full'>
                  <CheckCircle2 className='w-5 h-5 text-green-500' />
                  <div>
                    <p className='font-bold text-sm text-green-700 dark:text-green-400'>
                      98% Happy
                    </p>
                    <p className='text-xs text-muted-foreground'>Travelers</p>
                  </div>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                initial='hidden'
                animate='show'
                custom={0.45}
                className='flex gap-4'
              >
                <div className='relative'>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.15, 0] }}
                    transition={{ delay: 1.5, duration: 1.8, ease: 'easeOut' }}
                    className='absolute inset-0 rounded-lg bg-primary pointer-events-none'
                  />
                  <Button
                    size='lg'
                    className='h-14 px-8 gap-2 text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform'
                    asChild
                  >
                    <Link href='/packages'>
                      Explore All Tours
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
                <Button
                  size='lg'
                  variant='outline'
                  className='h-14 px-8 gap-2 text-base hover:scale-105 transition-transform'
                  asChild
                >
                  <Link href='/contact'>
                    <Headset className='w-5 h-5' />
                    Contact Us
                  </Link>
                </Button>
              </motion.div>

              {/* Trust micro-copy */}
              <motion.div
                variants={fadeUp}
                initial='hidden'
                animate='show'
                custom={0.55}
                className='flex gap-6'
              >
                {[
                  'Free Cancellation',
                  'Best Price Guarantee',
                  '24/7 Support',
                ].map((f) => (
                  <div
                    key={f}
                    className='flex items-center gap-2 text-sm text-muted-foreground'
                  >
                    <CheckCircle2 className='w-4 h-4 text-primary' />
                    {f}
                  </div>
                ))}
              </motion.div>

              {/* Animated Stats */}
              <div className='grid grid-cols-4 gap-3 pt-2'>
                {stats.map((stat) => (
                  <StatCounter key={stat.label} stat={stat} />
                ))}
              </div>
            </div>

            {/* Right — Image Grid */}
            <div className='relative h-150 xl:h-170'>
              {/* Main image */}
              <motion.div
                variants={scaleIn}
                initial='hidden'
                animate='show'
                custom={0.2}
                className='absolute top-0 right-0 w-[68%] h-[55%] rounded-2xl overflow-hidden shadow-2xl border-4 border-background z-10 group'
              >
                <Image
                  src={destinations[0].image}
                  alt={destinations[0].name}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                  <Badge className='bg-primary/90 backdrop-blur-sm mb-2 text-xs'>
                    <Sparkles className='w-3 h-3 mr-1' /> Featured
                  </Badge>
                  <p className='text-2xl font-bold'>{destinations[0].name}</p>
                  <p className='text-sm opacity-90'>
                    {destinations[0].subtitle}
                  </p>
                </div>
              </motion.div>

              {/* Secondary images — stagger in */}
              {([1, 2, 3] as const).map((destIdx, i) => (
                <motion.div
                  key={destIdx}
                  variants={scaleIn}
                  initial='hidden'
                  animate='show'
                  custom={0.3 + i * 0.12}
                  className={`absolute ${desktopPositions[i]} rounded-2xl overflow-hidden shadow-xl border-4 border-background group`}
                >
                  <Image
                    src={destinations[destIdx].image}
                    alt={destinations[destIdx].name}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent' />
                  <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                    <p className='font-bold text-sm'>
                      {destinations[destIdx].name}
                    </p>
                    <p className='text-xs opacity-90'>
                      {destinations[destIdx].subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Floating rating badge — gentle infinite bob */}
              <motion.div
                variants={scaleIn}
                initial='hidden'
                animate='show'
                custom={0.6}
                className='absolute top-[43%] left-[12%] z-40'
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className='bg-background/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-border/60'
                >
                  <p className='text-3xl font-bold text-primary text-center'>
                    4.8
                  </p>
                  <div className='flex gap-0.5 mt-1 justify-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: static list
                        key={i}
                        className='w-3.5 h-3.5 fill-primary text-primary'
                      />
                    ))}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1 font-medium text-center'>
                    10K+ Reviews
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
