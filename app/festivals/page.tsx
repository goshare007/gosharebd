'use client';

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Star,
  Ticket,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ─── Data ─────────────────────────────────────────────────────────────────────
const UPCOMING = [
  {
    id: 'rash-mela-2026',
    slug: 'rash-mela-2026',
    name: 'Rash Mela',
    tagline: 'The grand Vaishnava festival of Dublar Char',
    location: 'Dublar Char, Sundarbans',
    region: 'Khulna',
    date: 'November 2026',
    duration: '3 days',
    price: 8500,
    spots: 12,
    totalSpots: 20,
    image:
      'https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=900&q=80',
    tags: ['Vaishnava', 'Sundarbans', 'Cultural'],
    highlights: [
      'Overnight stay at Dublar Char fishing village',
      'Full-moon kirtan ceremony',
      'Sundarbans forest trail at dawn',
      'Freshwater fishing with local fishermen',
    ],
    status: 'upcoming',
    isFeatured: true,
  },
  {
    id: 'sreemangal-tea-harvest-2026',
    slug: 'sreemangal-tea-harvest-2026',
    name: 'Tea Garden Harvest Festival',
    tagline: 'Second flush harvest season in the tea capital of Bangladesh',
    location: 'Sreemangal, Sylhet',
    region: 'Sreemangal',
    date: 'June 2026',
    duration: '2 days',
    price: 5500,
    spots: 8,
    totalSpots: 16,
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
    tags: ['Tea', 'Nature', 'Sreemangal'],
    highlights: [
      'Guided tea plucking with garden workers',
      'Visit Lawachara National Park',
      'Seven-layer tea tasting at Nilkantha',
      'Khasi and Manipuri village walk',
    ],
    status: 'upcoming',
    isFeatured: false,
  },
  {
    id: 'rajshahi-silk-mela-2026',
    slug: 'rajshahi-silk-mela-2026',
    name: 'Rajshahi Silk & Mango Festival',
    tagline: 'Silk weavers, mango orchards, and the city of terracotta',
    location: 'Rajshahi',
    region: 'Rajshahi',
    date: 'May 2026',
    duration: '2 days',
    price: 5000,
    spots: 14,
    totalSpots: 20,
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
    tags: ['Silk', 'Craft', 'Rajshahi'],
    highlights: [
      'Rajshahi silk weaving workshop',
      'Mango orchard tour during peak season',
      'Varendra Research Museum visit',
      'Paharpur Buddhist Vihara day trip',
    ],
    status: 'upcoming',
    isFeatured: false,
  },
  {
    id: 'garo-wangala-2026',
    slug: 'garo-wangala-2026',
    name: 'Garo Wangala Festival',
    tagline: 'The harvest thanksgiving of the Garo people of Mymensingh',
    location: 'Modhupur, Mymensingh',
    region: 'Mymensingh',
    date: 'October 2026',
    duration: '2 days',
    price: 4800,
    spots: 10,
    totalSpots: 16,
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80',
    tags: ['Tribal', 'Garo', 'Cultural'],
    highlights: [
      'Traditional Wangala drum ceremony',
      'Garo traditional dance performances',
      'Modhupur forest trail',
      'Village feast with Garo community',
    ],
    status: 'upcoming',
    isFeatured: false,
  },
  {
    id: 'jessore-flower-mela-2026',
    slug: 'jessore-flower-mela-2026',
    name: 'Jessore Flower Festival',
    tagline: 'The flower capital of Bangladesh in full bloom',
    location: 'Jhikargacha, Jessore',
    region: 'Jessore',
    date: 'January 2026',
    duration: '1 day',
    price: 2800,
    spots: 6,
    totalSpots: 20,
    image:
      'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=900&q=80',
    tags: ['Flowers', 'Nature', 'Jessore'],
    highlights: [
      'Sunrise walk through Panisara flower fields',
      'Meet local flower farmers',
      'Photography tour of Gada, rose & gladiolus farms',
      'Wholesale flower market visit',
    ],
    status: 'upcoming',
    isFeatured: false,
  },
  {
    id: 'chakma-biju-2027',
    slug: 'chakma-biju-2027',
    name: 'Chakma Biju Festival',
    tagline: 'New Year celebrations of the Chakma people of the Hill Tracts',
    location: 'Rangamati, Chittagong Hill Tracts',
    region: 'Chittagong Hill Tracts',
    date: 'April 2027',
    duration: '3 days',
    price: 9500,
    spots: 20,
    totalSpots: 20,
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    tags: ['Tribal', 'Chakma', 'Hill Tracts'],
    highlights: [
      'Flower Biju — floral offerings at the riverbank',
      'Main Biju community feast',
      'Traditional Chakma weaving demonstration',
      'Kaptai Lake boat excursion',
    ],
    status: 'coming_soon',
    isFeatured: false,
  },
];

const PAST = [
  {
    id: 'rash-mela-2025',
    name: 'Rash Mela 2025',
    location: 'Dublar Char, Sundarbans',
    date: 'November 2025',
    image:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    attendees: 18,
    rating: 4.9,
  },
  {
    id: 'sreemangal-2025',
    name: 'Tea Harvest Festival 2025',
    location: 'Sreemangal',
    date: 'June 2025',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    attendees: 14,
    rating: 4.8,
  },
  {
    id: 'wangala-2025',
    name: 'Garo Wangala 2025',
    location: 'Modhupur, Mymensingh',
    date: 'October 2025',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    attendees: 12,
    rating: 5.0,
  },
  {
    id: 'jessore-2025',
    name: 'Jessore Flower Festival 2025',
    location: 'Jhikargacha, Jessore',
    date: 'January 2025',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    attendees: 20,
    rating: 4.7,
  },
];

const REGIONS = [
  'All',
  'Sreemangal',
  'Rajshahi',
  'Jessore',
  'Chittagong Hill Tracts',
  'Khulna',
  'Mymensingh',
];

// ─── Featured festival card ───────────────────────────────────────────────────
function FeaturedCard({ festival }: { festival: (typeof UPCOMING)[number] }) {
  const spotsPercent = (festival.spots / festival.totalSpots) * 100;

  return (
    <Link
      href={`/packages/${festival.slug}`}
      className='group grid md:grid-cols-[1.4fr_1fr] rounded-2xl border-2 border-border overflow-hidden hover:border-primary/40 transition-all duration-500'
    >
      {/* Image */}
      <div className='relative h-72 md:h-auto overflow-hidden'>
        <Image
          src={festival.image}
          alt={festival.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
        <div className='absolute top-4 left-4 flex gap-2'>
          <Badge className='bg-primary text-primary-foreground text-xs font-semibold'>
            Featured
          </Badge>
          {festival.spots <= 5 && (
            <Badge variant='destructive' className='text-xs font-semibold'>
              Almost full
            </Badge>
          )}
        </div>
        <div className='absolute bottom-5 left-5 right-5 text-white'>
          <div className='flex items-center gap-1.5 text-xs text-white/70 mb-1.5'>
            <MapPin className='w-3 h-3' />
            {festival.location}
          </div>
          <h2 className='font-display text-2xl font-bold leading-tight'>
            {festival.name}
          </h2>
          <p className='text-sm text-white/80 mt-1'>{festival.tagline}</p>
        </div>
      </div>

      {/* Details */}
      <div className='p-7 flex flex-col justify-between bg-card'>
        <div className='space-y-5'>
          {/* Meta */}
          <div className='grid grid-cols-2 gap-3'>
            {[
              { icon: CalendarDays, label: 'Date', value: festival.date },
              { icon: Clock, label: 'Duration', value: festival.duration },
              { icon: MapPin, label: 'Region', value: festival.region },
              {
                icon: Users,
                label: 'Group',
                value: `Max ${festival.totalSpots}`,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className='bg-muted/40 rounded-xl p-3'>
                <div className='flex items-center gap-1.5 mb-1'>
                  <Icon className='w-3 h-3 text-primary' />
                  <span className='text-xs text-muted-foreground'>{label}</span>
                </div>
                <p className='text-xs font-semibold'>{value}</p>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className='space-y-2'>
            <p className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
              What's included
            </p>
            {festival.highlights.map((h) => (
              <div
                key={h}
                className='flex items-start gap-2 text-xs text-muted-foreground'
              >
                <CheckCircle2 className='w-3 h-3 text-primary shrink-0 mt-0.5' />
                {h}
              </div>
            ))}
          </div>

          {/* Spots bar */}
          <div className='space-y-1.5'>
            <div className='flex justify-between text-xs'>
              <span className='text-muted-foreground'>Spots remaining</span>
              <span className='font-semibold text-primary'>
                {festival.spots} left
              </span>
            </div>
            <div className='h-1.5 w-full rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-primary transition-all'
                style={{ width: `${spotsPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className='mt-6 space-y-3'>
          <div className='flex items-end justify-between'>
            <div>
              <p className='text-xs text-muted-foreground'>From</p>
              <p className='font-display text-2xl font-bold text-primary'>
                ৳{festival.price.toLocaleString()}
              </p>
              <p className='text-xs text-muted-foreground'>
                per person · incl. VAT
              </p>
            </div>
            <Button className='gap-2'>
              Book now
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Festival card ────────────────────────────────────────────────────────────
function FestivalCard({
  festival,
  index,
}: {
  festival: (typeof UPCOMING)[number];
  index: number;
}) {
  const spotsLeft = festival.spots;
  const isComingSoon = festival.status === 'coming_soon';
  const isFull = festival.spots === 0;

  return (
    <Link
      href={isComingSoon ? '#' : `/packages/${festival.slug}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-border overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4',
        isComingSoon
          ? 'opacity-70 cursor-default'
          : 'hover:border-primary/30 hover:shadow-sm',
      )}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={isComingSoon ? (e) => e.preventDefault() : undefined}
    >
      {/* Image */}
      <div className='relative h-48 overflow-hidden'>
        <Image
          src={festival.image}
          alt={festival.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />

        {/* Badges */}
        <div className='absolute top-3 left-3 flex gap-1.5'>
          {isComingSoon && (
            <span className='text-xs font-semibold bg-muted/90 backdrop-blur-sm text-muted-foreground px-2.5 py-1 rounded-full'>
              Coming Soon
            </span>
          )}
          {isFull && !isComingSoon && (
            <span className='text-xs font-semibold bg-destructive text-destructive-foreground px-2.5 py-1 rounded-full'>
              Sold out
            </span>
          )}
          {spotsLeft <= 4 && !isComingSoon && !isFull && (
            <span className='text-xs font-semibold bg-amber-500 text-white px-2.5 py-1 rounded-full'>
              {spotsLeft} spots left
            </span>
          )}
        </div>

        {/* Location overlay */}
        <div className='absolute bottom-3 left-3 right-3'>
          <div className='flex items-center gap-1 text-xs text-white/80'>
            <MapPin className='w-3 h-3' />
            {festival.location}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-5 flex flex-col flex-1'>
        {/* Tags */}
        <div className='flex flex-wrap gap-1.5 mb-3'>
          {festival.tags.map((tag) => (
            <span
              key={tag}
              className='text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full font-medium'
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className='font-display text-base font-bold leading-snug mb-1 group-hover:text-primary transition-colors'>
          {festival.name}
        </h3>
        <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1'>
          {festival.tagline}
        </p>

        <Separator className='my-4' />

        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-1 text-xs text-muted-foreground mb-0.5'>
              <CalendarDays className='w-3 h-3' />
              {festival.date} · {festival.duration}
            </div>
            <p className='font-display text-lg font-bold text-primary'>
              ৳{festival.price.toLocaleString()}
              <span className='text-xs font-normal text-muted-foreground ml-1'>
                /person
              </span>
            </p>
          </div>
          {!isComingSoon && (
            <Button
              size='sm'
              variant={isFull ? 'outline' : 'default'}
              disabled={isFull}
            >
              {isFull ? 'Full' : 'Book'}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Past event card ──────────────────────────────────────────────────────────
function PastCard({ event }: { event: (typeof PAST)[number] }) {
  return (
    <div className='group rounded-2xl border border-border overflow-hidden opacity-80 hover:opacity-100 transition-opacity'>
      <div className='relative h-36 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500'>
        <Image
          src={event.image}
          alt={event.name}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />
        <div className='absolute bottom-3 left-3 right-3 text-white'>
          <p className='text-xs font-semibold leading-tight'>{event.name}</p>
          <div className='flex items-center gap-1 text-xs text-white/70 mt-0.5'>
            <MapPin className='w-2.5 h-2.5' />
            {event.location}
          </div>
        </div>
      </div>
      <div className='px-4 py-3 flex items-center justify-between bg-card'>
        <div>
          <p className='text-xs text-muted-foreground'>{event.date}</p>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Users className='w-3 h-3' />
            {event.attendees} travellers
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <Star className='w-3 h-3 text-amber-400 fill-amber-400' />
          <span className='text-xs font-bold'>{event.rating}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Calendar strip ───────────────────────────────────────────────────────────
function CalendarStrip() {
  const months = [
    { month: 'Jan', festivals: ['Jessore Flower Festival'] },
    { month: 'Feb', festivals: [] },
    { month: 'Mar', festivals: [] },
    { month: 'Apr', festivals: ['Chakma Biju (2027)'] },
    { month: 'May', festivals: ['Rajshahi Silk & Mango'] },
    { month: 'Jun', festivals: ['Tea Harvest Festival'] },
    { month: 'Jul', festivals: [] },
    { month: 'Aug', festivals: [] },
    { month: 'Sep', festivals: [] },
    { month: 'Oct', festivals: ['Garo Wangala'] },
    { month: 'Nov', festivals: ['Rash Mela'] },
    { month: 'Dec', festivals: [] },
  ];

  return (
    <div className='grid grid-cols-6 sm:grid-cols-12 gap-1.5'>
      {months.map(({ month, festivals }) => (
        <div
          key={month}
          className={cn(
            'rounded-xl border p-2.5 text-center transition-colors min-h-16',
            festivals.length > 0
              ? 'border-primary/30 bg-primary/5'
              : 'border-border bg-muted/20',
          )}
        >
          <p
            className={cn(
              'text-xs font-semibold mb-1.5',
              festivals.length > 0 ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {month}
          </p>
          {festivals.map((f) => (
            <p
              key={f}
              className='text-[10px] text-primary/80 leading-tight font-medium'
            >
              {f}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FestivalsPage() {
  const [activeRegion, setActiveRegion] = useState('All');

  const featured = UPCOMING.find((f) => f.isFeatured);
  const rest = UPCOMING.filter((f) => !f.isFeatured);

  const filtered =
    activeRegion === 'All'
      ? rest
      : rest.filter((f) => f.region === activeRegion);

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-14 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[6.5rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          FESTIVALS
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Festival Tours
              </span>
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              Experience Bangladesh{' '}
              <span className='italic font-light text-muted-foreground'>
                in celebration
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed'>
              From the sacred fires of Rash Mela at Dublar Char to the harvest
              drums of the Garo hills — we take you inside the festivals that
              define Bangladesh's cultural soul. Every tour is built around the
              event, not just near it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Festival calendar ────────────────────────────────────────────── */}
      <section className='py-10 border-b border-border bg-muted/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='h-px w-8 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Festival Calendar
            </span>
          </div>
          <CalendarStrip />
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────────── */}
      {featured && (
        <section className='py-12 md:py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Signature Festival
              </span>
            </div>
            <FeaturedCard festival={featured} />
          </div>
        </section>
      )}

      <Separator />

      {/* ── All upcoming ─────────────────────────────────────────────────── */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header + region filter */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
            <div className='flex items-center gap-3'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Upcoming Festivals
              </span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type='button'
                  onClick={() => setActiveRegion(region)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-medium transition-colors',
                    activeRegion === region
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70',
                  )}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {filtered.map((festival, i) => (
                <FestivalCard key={festival.id} festival={festival} index={i} />
              ))}
            </div>
          ) : (
            <div className='rounded-2xl border-2 border-dashed border-border p-12 text-center space-y-3'>
              <div className='flex justify-center'>
                <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
                  <Sparkles className='w-5 h-5 text-muted-foreground' />
                </div>
              </div>
              <p className='font-semibold text-sm'>
                No festivals in this region right now
              </p>
              <p className='text-xs text-muted-foreground'>
                Check back soon — we add new festivals throughout the year.
              </p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setActiveRegion('All')}
              >
                View all regions
              </Button>
            </div>
          )}
        </div>
      </section>

      <Separator />

      {/* ── Past events ──────────────────────────────────────────────────── */}
      <section className='py-12 md:py-16 bg-muted/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between mb-7'>
            <div className='flex items-center gap-3'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Previous Events
              </span>
            </div>
            <p className='text-xs text-muted-foreground hidden sm:block'>
              Hover to see in colour
            </p>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {PAST.map((event) => (
              <PastCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Notify CTA ──────────────────────────────────────────────────── */}
      <section className='py-14 border-t border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-xl mx-auto text-center space-y-5'>
            <div className='flex justify-center'>
              <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center'>
                <Ticket className='w-7 h-7 text-primary' />
              </div>
            </div>
            <div className='space-y-2'>
              <h2 className='font-display text-2xl sm:text-3xl font-bold'>
                Don't miss a festival
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Festival tours sell out early. Browse all packages or get in
                touch — we'll let you know as soon as new dates are confirmed.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 justify-center pt-1'>
              <Button asChild size='lg'>
                <Link href='/packages'>Browse all packages</Link>
              </Button>
              <Button asChild variant='outline' size='lg'>
                <Link href='/contact'>Get notified</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
