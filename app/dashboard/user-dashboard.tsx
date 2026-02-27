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
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useUserDashboardStats } from '@/services/dashboard';
import type { UserDashboardStats } from '@/types/dashboard';

// ─── helpers ──────────────────────────────────────────────────────────────────

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

// ─── status badge ─────────────────────────────────────────────────────────────

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
      className={cn('text-xs font-semibold tracking-wide gap-1', s.className)}
    >
      <Icon className='w-3 h-3' />
      {s.label}
    </Badge>
  );
}

// ─── upcoming trip card ───────────────────────────────────────────────────────

function UpcomingTripCard({
  trip,
  delay,
}: {
  trip: UserDashboardStats['upcomingTrips'][number];
  delay: number;
}) {
  const days = daysUntil(trip.travelDate);

  return (
    <Card
      className='group border-2 hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden p-0 animate-in fade-in slide-in-from-bottom'
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* cover image */}
      <div className='relative h-40 overflow-hidden'>
        <Image
          src={trip.package.coverImage}
          alt={trip.package.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />

        {/* countdown pill */}
        <div className='absolute top-3 right-3'>
          <div className='bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full'>
            {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `${days} days`}
          </div>
        </div>

        {/* destination label bottom-left */}
        <div className='absolute bottom-3 left-3'>
          <div className='flex items-center gap-1 text-white'>
            <MapPin className='w-3.5 h-3.5 shrink-0' />
            <span className='text-xs font-semibold'>
              {trip.package.destination.name}
            </span>
          </div>
        </div>
      </div>

      <CardContent className='p-4 space-y-3'>
        <div>
          <h3 className='font-display font-bold text-base leading-tight line-clamp-1'>
            {trip.package.name}
          </h3>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {trip.package.Location}
          </p>
        </div>

        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <CalendarDays className='w-3.5 h-3.5' />
            <span>{fmtDate(trip.travelDate)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='w-3.5 h-3.5' />
            <span>{trip.package.durationDays}D</span>
          </div>
        </div>

        <div className='flex items-center gap-2 pt-2 border-t border-border'>
          <div className='h-px w-4 bg-primary shrink-0' />
          <span className='text-xs font-bold text-primary'>
            {fmt(trip.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── booking list row ─────────────────────────────────────────────────────────

function BookingRow({
  booking,
  delay,
}: {
  booking: UserDashboardStats['bookings'][number];
  delay: number;
}) {
  return (
    <div
      className='group flex items-center gap-4 p-4 rounded-xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 animate-in fade-in slide-in-from-bottom'
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* package image */}
      <div className='relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-border'>
        <Image
          src={booking.package.coverImage}
          alt={booking.package.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* main info */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <p className='font-semibold text-sm truncate leading-tight'>
              {booking.package.name}
            </p>
            <div className='flex items-center gap-1 mt-0.5 text-xs text-muted-foreground'>
              <MapPin className='w-3 h-3 shrink-0' />
              <span className='truncate'>
                {booking.package.destination.name}
              </span>
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className='flex items-center gap-4 mt-2'>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <CalendarDays className='w-3 h-3' />
            <span>{fmtDate(booking.travelDate)}</span>
          </div>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Users className='w-3 h-3' />
            <span>{totalTravelers(booking)} travelers</span>
          </div>
          <span className='text-xs font-bold text-primary ml-auto'>
            {fmt(booking.total)}
          </span>
        </div>
      </div>

      <ChevronRight className='w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors duration-200 shrink-0 hidden sm:block' />
    </div>
  );
}

// ─── skeletons ────────────────────────────────────────────────────────────────

function UpcomingTripSkeleton() {
  return (
    <Card className='border-2 overflow-hidden p-0'>
      <Skeleton className='h-40 w-full rounded-none' />
      <CardContent className='p-4 space-y-3'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
        <div className='flex justify-between'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-12' />
        </div>
        <div className='pt-2 border-t border-border'>
          <Skeleton className='h-3 w-20' />
        </div>
      </CardContent>
    </Card>
  );
}

function BookingRowSkeleton() {
  return (
    <div className='flex items-center gap-4 p-4'>
      <Skeleton className='w-16 h-16 rounded-xl shrink-0' />
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

// ─── main ─────────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const { data: session } = useSession();
  const { isPending, data, isError } = useUserDashboardStats();

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
          <div className='flex items-center gap-3 justify-center mb-4'>
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
    <div className='flex flex-col gap-10 p-4 pt-0'>
      {/* ── welcome header ───────────────────────────────────────────────── */}
      <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className='flex items-start justify-between gap-4 flex-wrap'>
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-12 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                My Dashboard
              </span>
            </div>
            <h1 className='font-display text-4xl font-bold leading-tight tracking-tight'>
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

          {/* user avatar + profile snippet */}
          <div className='flex items-center gap-3 self-end pb-1'>
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-semibold'>{user?.name}</p>
              <p className='text-xs text-muted-foreground'>{user?.email}</p>
            </div>
            <Avatar className='h-11 w-11 border-2 border-primary/20'>
              <AvatarImage src={user?.image ?? ''} />
              <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                {user?.name ? initials(user.name) : '?'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* ── stats strip ─────────────────────────────────────────────────── */}
      <div
        className='grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom duration-700'
        style={{ animationDelay: '80ms' }}
      >
        {(
          [
            {
              label: 'Total Trips',
              icon: CalendarDays,
              value: data?.stats.total,
              color: 'text-primary',
              bg: 'bg-primary/10',
            },
            {
              label: 'Confirmed',
              icon: CheckCircle2,
              value: data?.stats.confirmed,
              color: 'text-emerald-600',
              bg: 'bg-emerald-500/10',
            },
            {
              label: 'Pending',
              icon: Hourglass,
              value: data?.stats.pending,
              color: 'text-amber-600',
              bg: 'bg-amber-500/10',
            },
            {
              label: 'Total Spent',
              icon: Wallet,
              value: data ? fmt(data.stats.totalSpent) : null,
              color: 'text-violet-600',
              bg: 'bg-violet-500/10',
            },
          ] as const
        ).map(({ label, icon: Icon, value, color, bg }, i) => (
          <Card
            key={label}
            className='border-2 transition-all duration-300'
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <CardContent className='p-4 flex items-center gap-3'>
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  bg,
                )}
              >
                <Icon className={cn('w-4 h-4', color)} />
              </div>
              <div className='min-w-0'>
                <p className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
                  {label}
                </p>
                {isPending ? (
                  <Skeleton className='h-6 w-12 mt-0.5' />
                ) : (
                  <p className='font-display text-xl font-bold truncate'>
                    {value ?? 0}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── upcoming trips ───────────────────────────────────────────────── */}
      <div
        className='animate-in fade-in slide-in-from-bottom duration-700'
        style={{ animationDelay: '200ms' }}
      >
        <div className='flex items-center justify-between mb-5'>
          <div>
            <div className='flex items-center gap-3 mb-1'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Up Next
              </span>
            </div>
            <h2 className='font-display text-xl font-bold'>
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
        </div>

        {isPending ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <UpcomingTripSkeleton key={i} />
            ))}
          </div>
        ) : data?.upcomingTrips.length === 0 ? (
          <Card className='border-2 border-dashed'>
            <CardContent className='py-12 flex flex-col items-center justify-center gap-3 text-center'>
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
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
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {data?.upcomingTrips.map((trip, i) => (
              <UpcomingTripCard key={trip.id} trip={trip} delay={i * 80} />
            ))}
          </div>
        )}
      </div>

      {/* ── booking history tabs ─────────────────────────────────────────── */}
      <div
        className='animate-in fade-in slide-in-from-bottom duration-700'
        style={{ animationDelay: '300ms' }}
      >
        <div className='mb-5'>
          <div className='flex items-center gap-3 mb-1'>
            <div className='h-px w-8 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              History
            </span>
          </div>
          <h2 className='font-display text-xl font-bold'>
            All{' '}
            <span className='italic font-light text-muted-foreground'>
              bookings
            </span>
          </h2>
        </div>

        <Tabs defaultValue='all'>
          <TabsList className='mb-4 h-9'>
            <TabsTrigger value='all' className='text-xs gap-1.5'>
              All
              {!isPending && (
                <Badge variant='secondary' className='text-xs px-1.5 py-0 h-4'>
                  {data?.bookings.length ?? 0}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value='confirmed' className='text-xs gap-1.5'>
              Confirmed
              {!isPending && (
                <Badge variant='secondary' className='text-xs px-1.5 py-0 h-4'>
                  {confirmed.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value='pending' className='text-xs gap-1.5'>
              Pending
              {!isPending && (
                <Badge variant='secondary' className='text-xs px-1.5 py-0 h-4'>
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value='cancelled' className='text-xs gap-1.5'>
              Cancelled
              {!isPending && (
                <Badge variant='secondary' className='text-xs px-1.5 py-0 h-4'>
                  {cancelled.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

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
                  <Card className='border-2'>
                    <CardContent className='p-2 divide-y divide-border'>
                      {isPending ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: This is fine
                          <BookingRowSkeleton key={i} />
                        ))
                      ) : list.length === 0 ? (
                        <div className='py-12 flex flex-col items-center justify-center gap-2 text-center'>
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
                        list.map((booking, i) => (
                          <BookingRow
                            key={booking.id}
                            booking={booking}
                            delay={i * 40}
                          />
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            },
          )}
        </Tabs>
      </div>
    </div>
  );
}
