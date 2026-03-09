'use client';

import { format } from 'date-fns';
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
import { type FestivalItem, useFestivals } from '@/services/festivals';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDivision(division: string) {
  return division.charAt(0) + division.slice(1).toLowerCase();
}

function formatTravelDate(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
) {
  if (!startDate) return '—';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  if (!end) return format(start, 'd MMM yyyy');
  if (format(start, 'MMM yyyy') === format(end, 'MMM yyyy')) {
    return `${format(start, 'd')}–${format(end, 'd MMM yyyy')}`;
  }
  return `${format(start, 'd MMM')} – ${format(end, 'd MMM yyyy')}`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      <section className='relative pt-16 pb-14 bg-primary/5 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-6 w-32 bg-muted rounded animate-pulse mb-4' />
          <div className='h-12 w-96 bg-muted rounded animate-pulse mb-3' />
          <div className='h-4 w-80 bg-muted rounded animate-pulse' />
        </div>
      </section>
      <section className='py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-72 rounded-2xl bg-muted animate-pulse' />
        </div>
      </section>
      <section className='py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[...Array(3)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            <div key={i} className='h-80 rounded-2xl bg-muted animate-pulse' />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Featured festival card ───────────────────────────────────────────────────
function FeaturedCard({ festival }: { festival: FestivalItem }) {
  const spotsLeft = festival.spotsLeft ?? festival.maxGroupSize;
  const spotsPercent = Math.min(100, (spotsLeft / festival.maxGroupSize) * 100);
  const isAlmostFull = spotsLeft <= 4 && spotsLeft > 0;
  const isFull = spotsLeft === 0;

  return (
    <Link
      href={`/packages/${festival.slug}`}
      className='group grid md:grid-cols-[1.4fr_1fr] rounded-2xl border-2 border-border overflow-hidden hover:border-primary/40 transition-all duration-500'
    >
      {/* Image */}
      <div className='relative h-72 md:h-auto overflow-hidden'>
        <Image
          src={festival.coverImage}
          alt={festival.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
        <div className='absolute top-4 left-4 flex gap-2'>
          <Badge className='bg-primary text-primary-foreground text-xs font-semibold'>
            Featured
          </Badge>
          {isAlmostFull && (
            <Badge variant='destructive' className='text-xs font-semibold'>
              Almost full
            </Badge>
          )}
          {isFull && (
            <Badge variant='destructive' className='text-xs font-semibold'>
              Sold out
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
          <p className='text-sm text-white/80 mt-1 line-clamp-2'>
            {festival.summary}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className='p-7 flex flex-col justify-between bg-card'>
        <div className='space-y-5'>
          {/* Meta */}
          <div className='grid grid-cols-2 gap-3'>
            {[
              {
                icon: CalendarDays,
                label: 'Date',
                value: formatTravelDate(
                  festival.nextDeparture?.startDate,
                  festival.nextDeparture?.endDate,
                ),
              },
              {
                icon: Clock,
                label: 'Duration',
                value: `${festival.durationDays} day${festival.durationDays !== 1 ? 's' : ''}`,
              },
              {
                icon: MapPin,
                label: 'Region',
                value: formatDivision(festival.division),
              },
              {
                icon: Users,
                label: 'Group',
                value: `Max ${festival.maxGroupSize}`,
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
          {festival.highlights.length > 0 && (
            <div className='space-y-2'>
              <p className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
                Highlights
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
          )}

          {/* Spots bar — only show if we have real departure data */}
          {festival.nextDeparture && (
            <div className='space-y-1.5'>
              <div className='flex justify-between text-xs'>
                <span className='text-muted-foreground'>Spots remaining</span>
                <span className='font-semibold text-primary'>
                  {isFull ? 'Full' : `${spotsLeft} left`}
                </span>
              </div>
              <div className='h-1.5 w-full rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-primary transition-all'
                  style={{ width: `${spotsPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className='mt-6 space-y-3'>
          <div className='flex items-end justify-between'>
            <div>
              <p className='text-xs text-muted-foreground'>From</p>
              <div className='flex items-baseline gap-2'>
                <p className='font-display text-2xl font-bold text-primary'>
                  ৳{festival.pricePerPerson.toLocaleString()}
                </p>
                {festival.originalPrice && (
                  <p className='text-sm text-muted-foreground line-through'>
                    ৳{festival.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                per person · incl. VAT
              </p>
            </div>
            <Button className='gap-2' disabled={isFull}>
              {isFull ? 'Sold out' : 'Book now'}
              {!isFull && <ChevronRight className='w-4 h-4' />}
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
  festival: FestivalItem;
  index: number;
}) {
  const spotsLeft = festival.spotsLeft;
  const isComingSoon = festival.status === 'coming_soon';
  const isFull = spotsLeft === 0;

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
          src={festival.coverImage}
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
          {spotsLeft !== null &&
            spotsLeft <= 4 &&
            spotsLeft > 0 &&
            !isComingSoon && (
              <span className='text-xs font-semibold bg-amber-500 text-white px-2.5 py-1 rounded-full'>
                {spotsLeft} spots left
              </span>
            )}
          {festival.isBestseller && (
            <span className='text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-1 rounded-full'>
              Bestseller
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
          {festival.summary}
        </p>

        <Separator className='my-4' />

        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-1 text-xs text-muted-foreground mb-0.5'>
              <CalendarDays className='w-3 h-3' />
              {formatTravelDate(
                festival.nextDeparture?.startDate,
                festival.nextDeparture?.endDate,
              )}
            </div>
            <div className='flex items-center gap-1 text-xs text-muted-foreground mb-0.5'>
              <Clock className='w-3 h-3' />
              {festival.durationDays} day
              {festival.durationDays !== 1 ? 's' : ''}
            </div>
            <div className='flex items-baseline gap-1.5'>
              <p className='font-display text-lg font-bold text-primary'>
                ৳{festival.pricePerPerson.toLocaleString()}
                <span className='text-xs font-normal text-muted-foreground ml-1'>
                  /person
                </span>
              </p>
              {festival.originalPrice && (
                <span className='text-xs text-muted-foreground line-through'>
                  ৳{festival.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
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
function PastCard({ festival }: { festival: FestivalItem }) {
  const bookedSeats = festival.lastDeparture ? festival.maxGroupSize : 0;

  return (
    <div className='group rounded-2xl border border-border overflow-hidden opacity-80 hover:opacity-100 transition-opacity'>
      <div className='relative h-36 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500'>
        <Image
          src={festival.coverImage}
          alt={festival.name}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />
        <div className='absolute bottom-3 left-3 right-3 text-white'>
          <p className='text-xs font-semibold leading-tight'>{festival.name}</p>
          <div className='flex items-center gap-1 text-xs text-white/70 mt-0.5'>
            <MapPin className='w-2.5 h-2.5' />
            {festival.location}
          </div>
        </div>
      </div>
      <div className='px-4 py-3 flex items-center justify-between bg-card'>
        <div>
          <p className='text-xs text-muted-foreground'>
            {formatTravelDate(
              festival.lastDeparture?.startDate,
              festival.lastDeparture?.endDate,
            )}
          </p>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Users className='w-3 h-3' />
            {bookedSeats} travellers
          </div>
        </div>
        <div className='flex items-center gap-1'>
          {festival.averageRating ? (
            <>
              <Star className='w-3 h-3 text-amber-400 fill-amber-400' />
              <span className='text-xs font-bold'>
                {festival.averageRating}
              </span>
            </>
          ) : (
            <span className='text-xs text-muted-foreground'>No reviews</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FestivalsPage() {
  const [activeRegion, setActiveRegion] = useState('All');

  const { data, isPending, isError } = useFestivals();

  // ── Guard: render loading/error states before touching data ───────────────
  if (isPending) return <PageSkeleton />;

  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-3'>
          <p className='font-semibold'>Failed to load festivals</p>
          <p className='text-sm text-muted-foreground'>
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // ── Data is guaranteed to exist past this point ───────────────────────────
  const festivals: FestivalItem[] = data ?? [];

  const upcoming = festivals.filter(
    (f) => f.status === 'upcoming' || f.status === 'coming_soon',
  );
  const past = festivals.filter((f) => f.status === 'past');

  const featured = upcoming.find((f) => f.isBestseller) ?? upcoming[0];
  const rest = upcoming.filter((f) => f.id !== featured?.id);

  const regions = [
    'All',
    ...Array.from(new Set(upcoming.map((f) => formatDivision(f.division)))),
  ];

  const filtered =
    activeRegion === 'All'
      ? rest
      : rest.filter((f) => formatDivision(f.division) === activeRegion);

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
          <div className='flex flex-col gap-4 mb-8'>
            <div className='flex items-center gap-3'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Upcoming Festivals
              </span>
            </div>
            {/* Region pills — only render when there are 2+ regions */}
            {regions.length > 2 && (
              <div className='flex flex-wrap gap-2'>
                {regions.map((r) => (
                  <Button
                    key={r}
                    size='sm'
                    variant={activeRegion === r ? 'default' : 'outline'}
                    onClick={() => setActiveRegion(r)}
                    className='rounded-full text-xs h-7 px-3'
                  >
                    {r}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {filtered.map((festival, i) => (
                <FestivalCard key={festival.id} festival={festival} index={i} />
              ))}
            </div>
          ) : rest.length === 0 && upcoming.length > 0 ? (
            <div className='rounded-2xl border-2 border-dashed border-border p-12 text-center space-y-3'>
              <div className='flex justify-center'>
                <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
                  <Sparkles className='w-5 h-5 text-muted-foreground' />
                </div>
              </div>
              <p className='font-semibold text-sm'>
                More festivals coming soon
              </p>
              <p className='text-xs text-muted-foreground'>
                We're adding new festivals throughout the year.
              </p>
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

      {/* ── Past events ──────────────────────────────────────────────────── */}
      {past.length > 0 && (
        <>
          <Separator />
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
                {past.map((festival) => (
                  <PastCard key={festival.id} festival={festival} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

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
