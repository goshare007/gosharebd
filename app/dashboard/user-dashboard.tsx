'use client';

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Hourglass,
  MapPin,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react';
import { motion, useInView, type Variants } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useUserDashboardStats } from '@/services/dashboard';
import type { UserDashboardStats } from '@/types/dashboard';

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
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(amount: number | string) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function fmtDate(date: string) {
  return new Date(date).toLocaleDateString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function totalTravelers(booking: {
  adultCount: number;
  preteenCount: number;
  childCount: number;
  infantCount: number;
}) {
  return (
    booking.adultCount +
    booking.preteenCount +
    booking.childCount +
    booking.infantCount
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; className: string; icon: React.ElementType }
  > = {
    PENDING: {
      label: 'Pending',
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      icon: Hourglass,
    },
    CONFIRMED: {
      label: 'Confirmed',
      className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: 'Cancelled',
      className: 'bg-red-500/10 text-red-500 border-red-500/20',
      icon: XCircle,
    },
  };
  const s = map[status] ?? { label: status, className: '', icon: Clock };
  const Icon = s.icon;
  return (
    <Badge
      variant='outline'
      className={cn(
        'text-xs font-semibold tracking-wide gap-1 shrink-0',
        s.className,
      )}
    >
      <Icon className='w-3 h-3' />
      {s.label}
    </Badge>
  );
}

// ── Upcoming trip card ────────────────────────────────────────────────────────

function UpcomingTripCard({
  trip,
}: {
  trip: UserDashboardStats['upcomingTrips'][number];
}) {
  const days = daysUntil(trip.travelDate);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className='group rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-black/5 transition-colors duration-300 flex flex-col'
    >
      {/* Image */}
      <div className='relative h-44 overflow-hidden shrink-0'>
        <Image
          src={trip.package.coverImage}
          alt={trip.package.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent' />

        {/* Countdown pill */}
        <div className='absolute top-3 right-3 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1.5 rounded-full'>
          {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `${days} days`}
        </div>

        {/* Name + location */}
        <div className='absolute bottom-0 left-0 right-0 p-4'>
          <h3 className='text-white text-base font-bold leading-snug line-clamp-1'>
            {trip.package.name}
          </h3>
          <div className='flex items-center gap-1.5 mt-1'>
            <MapPin className='w-3.5 h-3.5 text-white/70 shrink-0' />
            <span className='text-white/70 text-xs'>
              {trip.package.destination.name}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='p-4 flex flex-col gap-3 flex-1 bg-background'>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <div className='flex items-center gap-1.5'>
            <CalendarDays className='w-3.5 h-3.5 shrink-0' />
            <span>{fmtDate(trip.travelDate)}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Clock className='w-3.5 h-3.5 shrink-0' />
            <span>{trip.package.durationDays} days</span>
          </div>
        </div>

        {/* Divider rule — design system pattern */}
        <div className='h-px bg-border' />

        <div className='flex items-center gap-2'>
          <div className='h-px w-4 bg-primary shrink-0' />
          <span className='text-sm font-bold text-primary'>
            {fmt(trip.total)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Booking list row ──────────────────────────────────────────────────────────

function BookingRow({
  booking,
}: {
  booking: UserDashboardStats['bookings'][number];
}) {
  return (
    <motion.div
      variants={cardVariants}
      className='group flex items-center gap-4 p-4 rounded-xl hover:bg-primary/3 transition-colors duration-200'
    >
      {/* Package image */}
      <div className='relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border'>
        <Image
          src={booking.package.coverImage}
          alt={booking.package.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <p className='font-semibold text-sm truncate leading-tight'>
              {booking.package.name}
            </p>
            <div className='flex items-center gap-1 mt-0.5 text-xs text-muted-foreground'>
              <MapPin className='w-3 h-3 shrink-0' />
              <span className='truncate'>{booking.package.location}</span>
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-2'>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <CalendarDays className='w-3 h-3' />
            <span>{fmtDate(booking.travelDate)}</span>
          </div>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Users className='w-3 h-3' />
            <span>{totalTravelers(booking)} travelers</span>
          </div>
          <div className='flex items-center gap-1.5 ml-auto'>
            <div className='h-px w-3 bg-primary shrink-0' />
            <span className='text-xs font-bold text-primary'>
              {fmt(booking.total)}
            </span>
          </div>
        </div>
      </div>

      <ChevronRight className='w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors duration-200 shrink-0 hidden sm:block' />
    </motion.div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function UpcomingTripSkeleton() {
  return (
    <div className='rounded-2xl border border-border overflow-hidden'>
      <Skeleton className='h-44 w-full rounded-none' />
      <div className='p-4 space-y-3'>
        <div className='flex justify-between'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-12' />
        </div>
        <div className='h-px bg-border' />
        <Skeleton className='h-4 w-20' />
      </div>
    </div>
  );
}

function BookingRowSkeleton() {
  return (
    <div className='flex items-center gap-4 p-4'>
      <Skeleton className='w-14 h-14 rounded-xl shrink-0' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-3 w-32' />
        <div className='flex gap-4'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const { data: session } = useSession();
  const { isPending, data, isError } = useUserDashboardStats();

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tripsRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' });
  const tripsInView = useInView(tripsRef, { once: true, margin: '-40px' });
  const historyInView = useInView(historyRef, { once: true, margin: '-40px' });

  const user = session?.user;
  const confirmed =
    data?.bookings.filter((b) => b.status === 'CONFIRMED') ?? [];
  const pending = data?.bookings.filter((b) => b.status === 'PENDING') ?? [];
  const cancelled =
    data?.bookings.filter((b) => b.status === 'CANCELLED') ?? [];

  if (isError) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-center'>
          <div className='flex items-center gap-3 justify-center mb-3'>
            <div className='h-px w-8 bg-destructive' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-destructive'>
              Error
            </span>
            <div className='h-px w-8 bg-destructive' />
          </div>
          <p className='text-muted-foreground text-sm'>
            Failed to load your dashboard. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-10 mt-6 mb-16 md:mb-20'>
      {/* ── Welcome header ───────────────────────────────────────────────── */}
      <div ref={headerRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={headerInView ? 'show' : 'hidden'}
          custom={0}
          className='flex items-start justify-between gap-4 flex-wrap'
        >
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                My Dashboard
              </span>
            </div>
            <h1 className='text-2xl md:text-4xl font-bold leading-tight tracking-tight'>
              Welcome back
              <span className='text-primary'>,</span>{' '}
              <span className='italic font-light text-muted-foreground'>
                {user?.name?.split(' ')[0] ?? 'traveler'}
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-sm mt-1'>
              Track your trips and manage your bookings.
            </p>
          </div>

          {/* Avatar */}
          <div className='flex items-center gap-3 self-end pb-1'>
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-semibold'>{user?.name}</p>
              <p className='text-xs text-muted-foreground'>{user?.email}</p>
            </div>
            <Avatar className='h-11 w-11 border border-border'>
              <AvatarImage src={user?.image ?? ''} />
              <AvatarFallback className='bg-primary/10 text-primary font-bold text-sm'>
                {user?.name ? initials(user.name) : '?'}
              </AvatarFallback>
            </Avatar>
          </div>
        </motion.div>
      </div>

      {/* ── Stats strip — divided table pattern ──────────────────────────── */}
      <div ref={statsRef}>
        <motion.div
          variants={gridVariants}
          initial='hidden'
          animate={statsInView ? 'show' : 'hidden'}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border'>
            {(
              [
                {
                  label: 'Total Trips',
                  icon: CalendarDays,
                  value: data?.stats.total,
                  formatted: false,
                },
                {
                  label: 'Confirmed',
                  icon: CheckCircle2,
                  value: data?.stats.confirmed,
                  formatted: false,
                },
                {
                  label: 'Pending',
                  icon: Hourglass,
                  value: data?.stats.pending,
                  formatted: false,
                },
                {
                  label: 'Total Spent',
                  icon: Wallet,
                  value: data ? fmt(data.stats.totalSpent) : null,
                  formatted: true,
                },
              ] as const
            ).map(({ label, icon: Icon, value }) => (
              <motion.div
                key={label}
                variants={cardVariants}
                className='flex items-center gap-3 p-5'
              >
                <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                  <Icon className='w-4 h-4 text-primary' />
                </div>
                <div className='min-w-0'>
                  <p className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    {label}
                  </p>
                  {isPending ? (
                    <Skeleton className='h-6 w-12 mt-1' />
                  ) : (
                    <p className='text-xl font-bold tabular-nums truncate'>
                      {value ?? 0}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Upcoming trips ───────────────────────────────────────────────── */}
      <div ref={tripsRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={tripsInView ? 'show' : 'hidden'}
          custom={0}
          className='flex items-center justify-between mb-6'
        >
          <div>
            <div className='flex items-center gap-3 mb-1'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Up Next
              </span>
            </div>
            <h2 className='text-xl font-bold tracking-tight'>
              Upcoming{' '}
              <span className='italic font-light text-muted-foreground'>
                trips
              </span>
            </h2>
          </div>
          <Button variant='ghost' size='sm' asChild className='text-xs gap-1'>
            <Link href='/packages'>
              Browse more <ChevronRight className='w-3.5 h-3.5' />
            </Link>
          </Button>
        </motion.div>

        {isPending ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <UpcomingTripSkeleton key={i} />
            ))}
          </div>
        ) : data?.upcomingTrips.length === 0 ? (
          <div className='rounded-2xl border border-border border-dashed p-12 flex flex-col items-center justify-center gap-3 text-center'>
            <div className='w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center'>
              <MapPin className='w-5 h-5 text-primary' />
            </div>
            <div>
              <p className='font-semibold text-sm'>No upcoming trips</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Your next adventure is waiting.
              </p>
            </div>
            <Button size='sm' asChild>
              <Link href='/packages'>Explore Packages</Link>
            </Button>
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial='hidden'
            animate={tripsInView ? 'show' : 'hidden'}
            className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
          >
            {data?.upcomingTrips.map((trip) => (
              <UpcomingTripCard key={trip.id} trip={trip} />
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Booking history ──────────────────────────────────────────────── */}
      <div ref={historyRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={historyInView ? 'show' : 'hidden'}
          custom={0}
          className='mb-6'
        >
          <div className='flex items-center gap-3 mb-1'>
            <div className='h-px w-8 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              History
            </span>
          </div>
          <h2 className='text-xl font-bold tracking-tight'>
            All{' '}
            <span className='italic font-light text-muted-foreground'>
              bookings
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={historyInView ? 'show' : 'hidden'}
          custom={0.1}
        >
          <Tabs defaultValue='all'>
            {/* Scrollable tab list — prevents overflow on small screens */}
            <div className='overflow-x-auto scrollbar-none mb-4'>
              <TabsList className='h-9 w-max min-w-full'>
                {(
                  [
                    {
                      value: 'all',
                      label: 'All',
                      count: data?.bookings.length ?? 0,
                    },
                    {
                      value: 'confirmed',
                      label: 'Confirmed',
                      count: confirmed.length,
                    },
                    {
                      value: 'pending',
                      label: 'Pending',
                      count: pending.length,
                    },
                    {
                      value: 'cancelled',
                      label: 'Cancelled',
                      count: cancelled.length,
                    },
                  ] as const
                ).map(({ value, label, count }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className='text-xs gap-1.5'
                  >
                    {label}
                    {!isPending && (
                      <Badge
                        variant='secondary'
                        className='text-xs px-1.5 py-0 h-4'
                      >
                        {count}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {(['all', 'confirmed', 'pending', 'cancelled'] as const).map(
              (tab) => {
                const list =
                  tab === 'all'
                    ? (data?.bookings ?? [])
                    : tab === 'confirmed'
                      ? confirmed
                      : tab === 'pending'
                        ? pending
                        : cancelled;

                return (
                  <TabsContent key={tab} value={tab}>
                    <div className='rounded-2xl border border-border overflow-hidden'>
                      {isPending ? (
                        <div className='divide-y divide-border'>
                          {Array.from({ length: 4 }).map((_, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                            <BookingRowSkeleton key={i} />
                          ))}
                        </div>
                      ) : list.length === 0 ? (
                        <div className='py-14 flex flex-col items-center justify-center gap-2 text-center'>
                          <p className='text-sm font-semibold text-muted-foreground'>
                            No bookings here
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {tab === 'all'
                              ? "You haven't made any bookings yet."
                              : `No ${tab} bookings found.`}
                          </p>
                        </div>
                      ) : (
                        <motion.div
                          variants={gridVariants}
                          initial='hidden'
                          animate='show'
                          className='divide-y divide-border'
                        >
                          {list.map((booking) => (
                            <BookingRow key={booking.id} booking={booking} />
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </TabsContent>
                );
              },
            )}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
