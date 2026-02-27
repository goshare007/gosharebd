'use client';

import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Hourglass,
  Package,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── stat card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <Card
      className='border-2 hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom'
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
            <Icon className='w-5 h-5 text-primary' />
          </div>
          <ArrowUpRight className='w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors duration-300' />
        </div>
        <p className='font-display text-3xl font-bold tracking-tight mb-1'>
          {value}
        </p>
        <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
          {title}
        </p>
        <div className='flex items-center gap-2 mt-3 pt-3 border-t border-border'>
          <div className='h-px w-6 bg-primary shrink-0' />
          <p className='text-xs text-muted-foreground'>{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: 'Pending',
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    CONFIRMED: {
      label: 'Confirmed',
      className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    },
    CANCELLED: {
      label: 'Cancelled',
      className: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
  };
  const s = map[status] ?? { label: status, className: '' };
  return (
    <Badge
      variant='outline'
      className={cn('text-xs font-semibold tracking-wide', s.className)}
    >
      {s.label}
    </Badge>
  );
}

// ─── popular packages bar chart ───────────────────────────────────────────────

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
    <div className='space-y-5'>
      {packages.map((p, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
          key={i}
          className='space-y-2 animate-in fade-in slide-in-from-bottom duration-500'
          style={{ animationDelay: `${i * 60}ms` }}
        >
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
            <div
              className='h-full bg-primary rounded-full transition-all duration-700 ease-out'
              style={{ width: `${(p.bookingCount / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── skeletons ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card className='border-2'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <Skeleton className='h-11 w-11 rounded-xl' />
          <Skeleton className='h-4 w-4 rounded' />
        </div>
        <Skeleton className='h-8 w-28 mb-2' />
        <Skeleton className='h-3 w-24' />
        <div className='mt-3 pt-3 border-t border-border'>
          <Skeleton className='h-3 w-32' />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { isPending, data, isError } = useAdminDashboardStats();
  const router = useRouter();

  if (isError) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-center space-y-2'>
          <div className='flex items-center gap-3 justify-center mb-4'>
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
    <div className='flex flex-col gap-10 p-4 pt-0'>
      {/* ── page header ─────────────────────────────────────────────────── */}
      <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='h-px w-12 bg-primary' />
          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
            Overview
          </span>
        </div>
        <h1 className='font-display text-4xl font-bold leading-tight tracking-tight'>
          Admin{' '}
          <span className='italic font-light text-muted-foreground'>
            dashboard
          </span>
          <span className='text-primary'>.</span>
        </h1>
        <p className='text-muted-foreground text-sm mt-1'>
          Real-time snapshot of your business performance.
        </p>
      </div>

      {/* ── stat cards ──────────────────────────────────────────────────── */}
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {isPending ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title='Total Bookings'
              value={data.bookings.total.toLocaleString()}
              sub='All time'
              icon={CalendarCheck}
              delay={0}
            />
            <StatCard
              title='This Month'
              value={data.bookings.thisMonth.toLocaleString()}
              sub='Bookings in current month'
              icon={TrendingUp}
              delay={80}
            />
            <StatCard
              title='Total Revenue'
              value={fmt(data.revenue.total)}
              sub='Confirmed bookings only'
              icon={DollarSign}
              delay={160}
            />
            <StatCard
              title='Monthly Revenue'
              value={fmt(data.revenue.thisMonth)}
              sub='Confirmed this month'
              icon={DollarSign}
              delay={240}
            />
          </>
        )}
      </div>

      {/* ── booking status row ───────────────────────────────────────────── */}
      <div
        className='grid gap-4 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom duration-700'
        style={{ animationDelay: '300ms' }}
      >
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
          <Card key={key} className='border-2 transition-all duration-300'>
            <CardContent className='p-5 flex items-center gap-4'>
              <div
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
                  bg,
                )}
              >
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              <div>
                <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
                  {label}
                </p>
                {isPending ? (
                  <Skeleton className='h-7 w-12 mt-1' />
                ) : (
                  <p className='font-display text-2xl font-bold'>
                    {data.bookings.byStatus[key].toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── bottom two-col grid ──────────────────────────────────────────── */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* popular packages */}
        <Card
          className='lg:col-span-1 border-2 hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom'
          style={{ animationDelay: '350ms' }}
        >
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Package className='w-4 h-4 text-primary' />
              </div>
              <CardTitle className='font-display text-lg font-bold'>
                Popular Packages
              </CardTitle>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-px w-6 bg-primary' />
              <p className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
                Top 5 by bookings
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className='space-y-5'>
                {Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  <div key={i} className='space-y-2'>
                    <div className='flex justify-between'>
                      <Skeleton className='h-4 w-36' />
                      <Skeleton className='h-4 w-8' />
                    </div>
                    <Skeleton className='h-1.5 w-full rounded-full' />
                  </div>
                ))}
              </div>
            ) : (
              <PopularPackagesChart packages={data.popularPackages} />
            )}
          </CardContent>
        </Card>

        {/* recent bookings */}
        <Card
          className='lg:col-span-2 border-2 hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom'
          style={{ animationDelay: '420ms' }}
        >
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Clock className='w-4 h-4 text-primary' />
              </div>
              <CardTitle className='font-display text-lg font-bold'>
                Recent Bookings
              </CardTitle>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-px w-6 bg-primary' />
              <p className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
                Last 10 bookings
              </p>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {isPending ? (
              <div className='space-y-3 px-6 pb-6'>
                {Array.from({ length: 6 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  <div key={i} className='flex items-center gap-3'>
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
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead className='pl-6 text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
                      Customer
                    </TableHead>
                    <TableHead className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
                      Package
                    </TableHead>
                    <TableHead className='hidden md:table-cell text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
                      Travel Date
                    </TableHead>
                    <TableHead className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
                      Total
                    </TableHead>
                    <TableHead className='pr-6 text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentBookings.map((booking, i) => (
                    <TableRow
                      key={booking.id}
                      className='group hover:bg-primary/5 transition-colors duration-150 animate-in fade-in'
                      style={{ animationDelay: `${i * 40}ms` }}
                      onClick={() =>
                        router.push(`/dashboard/admin/bookings/${booking.id}`)
                      }
                    >
                      <TableCell className='pl-6 py-3'>
                        <div className='flex items-center gap-2.5'>
                          <Avatar className='h-8 w-8 border-2 border-border'>
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
                      <TableCell className='text-sm font-bold text-primary py-3'>
                        {fmt(booking.total)}
                      </TableCell>
                      <TableCell className='pr-6 py-3'>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
