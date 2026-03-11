'use client';

import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Hourglass,
  Package,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { motion, useInView, type Variants } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useAdminDashboardStats } from '@/services/dashboard';

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

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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

// ── Popular packages bar chart ────────────────────────────────────────────────

function PopularPackagesChart({
  packages,
}: {
  packages: Array<{
    package: {
      name: string;
      coverImage: string;
      destination: { name: string };
    } | null;
    bookingCount: number;
    totalRevenue: string | number;
  }>;
}) {
  const max = Math.max(...packages.map((p) => p.bookingCount), 1);

  return (
    <motion.div
      variants={gridVariants}
      initial='hidden'
      animate='show'
      className='space-y-5'
    >
      {packages.map((p, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
        <motion.div key={i} variants={cardVariants} className='space-y-2'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0'>
              <p className='text-sm font-semibold truncate leading-tight'>
                {p.package?.name ?? 'Unknown Package'}
              </p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {p.package?.destination?.name}
              </p>
            </div>
            <div className='text-right shrink-0'>
              <p className='text-sm font-bold tabular-nums text-primary'>
                {p.bookingCount}
              </p>
              <p className='text-xs text-muted-foreground'>
                {fmt(p.totalRevenue)}
              </p>
            </div>
          </div>
          <div className='h-1.5 w-full bg-primary/10 rounded-full overflow-hidden'>
            <motion.div
              className='h-full bg-primary rounded-full'
              initial={{ width: 0 }}
              animate={{ width: `${(p.bookingCount / max) * 100}%` }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function PackageBarSkeleton() {
  return (
    <div className='space-y-2'>
      <div className='flex justify-between'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-4 w-8' />
      </div>
      <Skeleton className='h-1.5 w-full rounded-full' />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { isPending, data, isError } = useAdminDashboardStats();
  const router = useRouter();

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' });
  const statusInView = useInView(statusRef, { once: true, margin: '-40px' });
  const bottomInView = useInView(bottomRef, { once: true, margin: '-40px' });

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
            Failed to load dashboard stats. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-10 mt-6 mb-16 md:mb-20'>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div ref={headerRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={headerInView ? 'show' : 'hidden'}
          custom={0}
        >
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Overview
            </span>
          </div>
          <h1 className='text-2xl md:text-4xl font-bold leading-tight tracking-tight'>
            Admin
            <span className='text-primary'>,</span>{' '}
            <span className='italic font-light text-muted-foreground'>
              dashboard
            </span>
            <span className='text-primary'>.</span>
          </h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Real-time snapshot of your business performance.
          </p>
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
                  label: 'Total Bookings',
                  icon: CalendarCheck,
                  value: data?.bookings.total,
                },
                {
                  label: 'This Month',
                  icon: TrendingUp,
                  value: data?.bookings.thisMonth,
                },
                {
                  label: 'Total Revenue',
                  icon: DollarSign,
                  value: data ? fmt(data.revenue.total) : null,
                },
                {
                  label: 'Monthly Revenue',
                  icon: DollarSign,
                  value: data ? fmt(data.revenue.thisMonth) : null,
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

      {/* ── Booking status strip ─────────────────────────────────────────── */}
      <div ref={statusRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={statusInView ? 'show' : 'hidden'}
          custom={0}
          className='mb-6'
        >
          <div className='flex items-center gap-3 mb-1'>
            <div className='h-px w-8 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              By Status
            </span>
          </div>
          <h2 className='text-xl font-bold tracking-tight'>
            Booking{' '}
            <span className='italic font-light text-muted-foreground'>
              breakdown
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial='hidden'
          animate={statusInView ? 'show' : 'hidden'}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <div className='grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border'>
            {(
              [
                {
                  label: 'Pending',
                  icon: Hourglass,
                  color: 'text-amber-600',
                  bg: 'bg-amber-500/10',
                  key: 'pending',
                },
                {
                  label: 'Confirmed',
                  icon: CheckCircle2,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-500/10',
                  key: 'confirmed',
                },
                {
                  label: 'Cancelled',
                  icon: XCircle,
                  color: 'text-red-500',
                  bg: 'bg-red-500/10',
                  key: 'cancelled',
                },
              ] as const
            ).map(({ label, icon: Icon, color, bg, key }) => (
              <motion.div
                key={key}
                variants={cardVariants}
                className='flex items-center gap-3 p-5'
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    bg,
                  )}
                >
                  <Icon className={cn('w-4 h-4', color)} />
                </div>
                <div className='min-w-0'>
                  <p className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    {label}
                  </p>
                  {isPending ? (
                    <Skeleton className='h-6 w-12 mt-1' />
                  ) : (
                    <p className='text-xl font-bold tabular-nums'>
                      {data.bookings.byStatus[key].toLocaleString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom two-col grid ──────────────────────────────────────────── */}
      <div ref={bottomRef} className='grid gap-6 lg:grid-cols-3'>
        {/* Popular packages */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={bottomInView ? 'show' : 'hidden'}
          custom={0}
          className='lg:col-span-1 rounded-2xl border border-border overflow-hidden'
        >
          <div className='p-6 border-b border-border'>
            <div className='flex items-center gap-3 mb-1'>
              <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Package className='w-4 h-4 text-primary' />
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <div className='h-px w-6 bg-primary' />
                  <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                    Top 5
                  </span>
                </div>
                <h2 className='text-base font-bold tracking-tight leading-tight'>
                  Popular{' '}
                  <span className='italic font-light text-muted-foreground'>
                    packages
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <div className='p-6'>
            {isPending ? (
              <div className='space-y-5'>
                {Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  <PackageBarSkeleton key={i} />
                ))}
              </div>
            ) : (
              <PopularPackagesChart packages={data.popularPackages} />
            )}
          </div>
        </motion.div>

        {/* Recent bookings */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={bottomInView ? 'show' : 'hidden'}
          custom={0.1}
          className='lg:col-span-2 rounded-2xl border border-border overflow-hidden'
        >
          <div className='p-6 border-b border-border flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Clock className='w-4 h-4 text-primary' />
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <div className='h-px w-6 bg-primary' />
                  <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                    Last 10
                  </span>
                </div>
                <h2 className='text-base font-bold tracking-tight leading-tight'>
                  Recent{' '}
                  <span className='italic font-light text-muted-foreground'>
                    bookings
                  </span>
                </h2>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              className='text-xs gap-1'
              onClick={() => router.push('/dashboard/admin/bookings')}
            >
              View all <ChevronRight className='w-3.5 h-3.5' />
            </Button>
          </div>

          {isPending ? (
            <div className='divide-y divide-border'>
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                <div key={i} className='flex items-center gap-4 p-4'>
                  <Skeleton className='h-8 w-8 rounded-full shrink-0' />
                  <div className='flex-1 space-y-1.5'>
                    <Skeleton className='h-3.5 w-32' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                  <Skeleton className='h-3.5 w-28 hidden md:block' />
                  <Skeleton className='h-3.5 w-20' />
                  <Skeleton className='h-5 w-20' />
                </div>
              ))}
            </div>
          ) : (
            <motion.div variants={gridVariants} initial='hidden' animate='show'>
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead className='pl-6 text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                      Customer
                    </TableHead>
                    <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                      Package
                    </TableHead>
                    <TableHead className='hidden md:table-cell text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                      Travel Date
                    </TableHead>
                    <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                      Total
                    </TableHead>
                    <TableHead className='pr-6 text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentBookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      variants={cardVariants}
                      onClick={() =>
                        router.push(`/dashboard/admin/bookings/${booking.id}`)
                      }
                      className='group hover:bg-primary/3 transition-colors duration-200 cursor-pointer border-b border-border last:border-0'
                    >
                      <TableCell className='pl-6 py-3'>
                        <div className='flex items-center gap-2.5'>
                          <Avatar className='h-8 w-8 border border-border'>
                            <AvatarImage src={booking.user.image} />
                            <AvatarFallback className='text-xs font-semibold bg-primary/10 text-primary'>
                              {initials(booking.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='min-w-0'>
                            <p className='text-sm font-semibold truncate leading-tight'>
                              {booking.user.name}
                            </p>
                            <p className='text-xs text-muted-foreground truncate'>
                              {booking.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-40 py-3'>
                        <p className='text-sm truncate'>
                          {booking.package.name}
                        </p>
                      </TableCell>
                      <TableCell className='hidden md:table-cell text-sm text-muted-foreground py-3'>
                        {fmtDate(booking.travelDate)}
                      </TableCell>
                      <TableCell className='py-3'>
                        <div className='flex items-center gap-1.5'>
                          <div className='h-px w-3 bg-primary shrink-0' />
                          <span className='text-sm font-bold text-primary'>
                            {fmt(booking.total)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='pr-6 py-3'>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
