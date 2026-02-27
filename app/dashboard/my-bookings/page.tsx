'use client';

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Hourglass,
  Mail,
  MapPin,
  Phone,
  Receipt,
  StickyNote,
  Users,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useMyBookings } from '@/services/booking';
import type { Booking, BookingStatus } from '@/types/bookings';

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number | string) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function fmtDate(date: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
}

function fmtDateTime(date: string) {
  return new Date(date).toLocaleString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function totalTravelers(b: Booking) {
  return b.adultCount + b.preteenCount + b.childCount + b.infantCount;
}

const STATUS_TABS: Array<{ value: BookingStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

// ─── status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<
    BookingStatus,
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
  const s = map[status];
  const Icon = s.icon;
  return (
    <Badge
      variant='outline'
      className={cn('text-xs font-semibold tracking-wide gap-1.5', s.className)}
    >
      <Icon className='w-3 h-3' />
      {s.label}
    </Badge>
  );
}

// ─── booking detail dialog ────────────────────────────────────────────────────

function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!booking) return null;

  const travelers = totalTravelers(booking);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-display text-xl font-bold'>
            Booking{' '}
            <span className='italic font-light text-muted-foreground'>
              details
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 mt-2'>
          {/* package hero */}
          <div className='relative h-44 rounded-xl overflow-hidden'>
            <Image
              src={booking.package.coverImage}
              alt={booking.package.name}
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
            <div className='absolute bottom-4 left-4 right-4 flex items-end justify-between'>
              <div>
                <p className='font-display text-white font-bold text-lg leading-tight'>
                  {booking.package.name}
                </p>
                <div className='flex items-center gap-1 text-white/80 text-xs mt-0.5'>
                  <MapPin className='w-3 h-3' />
                  {booking.package.destination.name} ·{' '}
                  {booking.package.Location}
                </div>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          </div>

          {/* booking meta */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {[
              {
                icon: CalendarDays,
                label: 'Travel Date',
                value: fmtDate(booking.travelDate),
              },
              {
                icon: Clock,
                label: 'Duration',
                value: `${booking.package.durationDays} days`,
              },
              {
                icon: Users,
                label: 'Travelers',
                value: `${travelers} people`,
              },
              {
                icon: Receipt,
                label: 'Booked On',
                value: fmtDate(booking.createdAt),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className='bg-primary/5 rounded-xl p-3 space-y-1'
              >
                <div className='flex items-center gap-1.5 text-muted-foreground'>
                  <Icon className='w-3.5 h-3.5' />
                  <span className='text-xs font-semibold tracking-wide uppercase'>
                    {label}
                  </span>
                </div>
                <p className='text-sm font-bold'>{value}</p>
              </div>
            ))}
          </div>

          {/* traveler breakdown */}
          {(booking.adultCount > 0 ||
            booking.preteenCount > 0 ||
            booking.childCount > 0 ||
            booking.infantCount > 0) && (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <div className='h-px w-6 bg-primary shrink-0' />
                <span className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
                  Traveler Breakdown
                </span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {booking.adultCount > 0 && (
                  <Badge variant='secondary' className='gap-1'>
                    <Users className='w-3 h-3' />
                    {booking.adultCount} Adult
                    {booking.adultCount > 1 ? 's' : ''}
                  </Badge>
                )}
                {booking.preteenCount > 0 && (
                  <Badge variant='secondary' className='gap-1'>
                    {booking.preteenCount} Preteen
                    {booking.preteenCount > 1 ? 's' : ''}
                  </Badge>
                )}
                {booking.childCount > 0 && (
                  <Badge variant='secondary' className='gap-1'>
                    {booking.childCount} Child
                    {booking.childCount > 1 ? 'ren' : ''}
                  </Badge>
                )}
                {booking.infantCount > 0 && (
                  <Badge variant='secondary' className='gap-1'>
                    {booking.infantCount} Infant
                    {booking.infantCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* members */}
          {booking.members.length > 0 && (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <div className='h-px w-6 bg-primary shrink-0' />
                <span className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
                  Members
                </span>
              </div>
              <div className='space-y-2'>
                {booking.members.map((member) => (
                  <div
                    key={member.id}
                    className='flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-primary/20 transition-colors duration-200'
                  >
                    <Avatar className='h-9 w-9 border-2 border-border shrink-0'>
                      <AvatarFallback className='text-xs font-bold bg-primary/10 text-primary'>
                        {member.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <p className='text-sm font-semibold'>
                          {member.fullName}
                        </p>
                        <Badge
                          variant='outline'
                          className='text-xs capitalize px-1.5 py-0 h-4'
                        >
                          {member.type}
                        </Badge>
                        <Badge
                          variant='outline'
                          className='text-xs capitalize px-1.5 py-0 h-4'
                        >
                          {member.gender}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-3 mt-0.5 flex-wrap'>
                        <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                          <Mail className='w-3 h-3' />
                          {member.email}
                        </span>
                        <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                          <Phone className='w-3 h-3' />
                          {member.phone}
                        </span>
                      </div>
                    </div>
                    <p className='text-xs text-muted-foreground shrink-0 hidden sm:block'>
                      ID: {member.idNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* notes */}
          {booking.notes && (
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <div className='h-px w-6 bg-primary shrink-0' />
                <span className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
                  Notes
                </span>
              </div>
              <div className='flex gap-2.5 p-3 rounded-xl bg-primary/5 border-2 border-primary/10'>
                <StickyNote className='w-4 h-4 text-primary shrink-0 mt-0.5' />
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {booking.notes}
                </p>
              </div>
            </div>
          )}

          {/* pricing summary */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <div className='h-px w-6 bg-primary shrink-0' />
              <span className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
                Pricing
              </span>
            </div>
            <div className='rounded-xl border-2 border-border overflow-hidden'>
              <div className='divide-y divide-border'>
                <div className='flex justify-between items-center px-4 py-3'>
                  <span className='text-sm text-muted-foreground'>
                    Subtotal
                  </span>
                  <span className='text-sm font-semibold'>
                    {fmt(booking.subtotal)}
                  </span>
                </div>
                <div className='flex justify-between items-center px-4 py-3'>
                  <span className='text-sm text-muted-foreground'>VAT</span>
                  <span className='text-sm font-semibold'>
                    {fmt(booking.vat)}
                  </span>
                </div>
                <div className='flex justify-between items-center px-4 py-3 bg-primary/5'>
                  <div className='flex items-center gap-1.5'>
                    <CreditCard className='w-4 h-4 text-primary' />
                    <span className='text-sm font-bold'>Total</span>
                  </div>
                  <span className='text-base font-bold text-primary'>
                    {fmt(booking.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* booking id + timestamps */}
          <div className='text-xs text-muted-foreground space-y-1 pt-2 border-t border-border'>
            <p>
              Booking ID: <span className='font-mono'>{booking.id}</span>
            </p>
            <p>Created: {fmtDateTime(booking.createdAt)}</p>
            <p>Last updated: {fmtDateTime(booking.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── booking card ─────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  delay,
  onViewDetails,
}: {
  booking: Booking;
  delay: number;
  onViewDetails: (b: Booking) => void;
}) {
  const travelers = totalTravelers(booking);

  return (
    <Card
      className='group border-2 hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden p-0 animate-in fade-in slide-in-from-bottom'
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className='flex flex-col sm:flex-row'>
        {/* cover image */}
        <div className='relative sm:w-48 h-44 sm:h-auto shrink-0 overflow-hidden'>
          <Image
            src={booking.package.coverImage}
            alt={booking.package.name}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-500'
          />
          <div className='absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/60 via-black/20 to-transparent' />
          <div className='absolute bottom-3 left-3 sm:hidden'>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* content */}
        <CardContent className='flex-1 p-5 flex flex-col justify-between gap-4'>
          <div>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <h3 className='font-display font-bold text-base leading-tight line-clamp-1'>
                  {booking.package.name}
                </h3>
                <div className='flex items-center gap-1 mt-1 text-xs text-muted-foreground'>
                  <MapPin className='w-3 h-3 shrink-0' />
                  <span>
                    {booking.package.destination.name} ·{' '}
                    {booking.package.Location}
                  </span>
                </div>
              </div>
              <div className='hidden sm:block shrink-0'>
                <StatusBadge status={booking.status} />
              </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4'>
              {[
                {
                  icon: CalendarDays,
                  label: 'Travel',
                  value: fmtDate(booking.travelDate),
                },
                {
                  icon: Clock,
                  label: 'Duration',
                  value: `${booking.package.durationDays}D`,
                },
                {
                  icon: Users,
                  label: 'Travelers',
                  value: `${travelers} pax`,
                },
                {
                  icon: FileText,
                  label: 'Booked',
                  value: fmtDate(booking.createdAt),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className='space-y-0.5'>
                  <div className='flex items-center gap-1 text-muted-foreground'>
                    <Icon className='w-3 h-3' />
                    <span className='text-xs uppercase tracking-wide font-semibold'>
                      {label}
                    </span>
                  </div>
                  <p className='text-sm font-semibold'>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='flex items-center justify-between pt-3 border-t border-border'>
            <div className='flex items-center gap-2'>
              <div className='h-px w-4 bg-primary shrink-0' />
              <span className='text-base font-bold text-primary'>
                {fmt(booking.total)}
              </span>
            </div>
            <Button
              size='sm'
              variant='outline'
              className='text-xs h-8 gap-1.5 border-2 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200'
              onClick={() => onViewDetails(booking)}
            >
              <Receipt className='w-3.5 h-3.5' />
              View Details
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ─── skeletons ────────────────────────────────────────────────────────────────

function BookingCardSkeleton() {
  return (
    <Card className='border-2 overflow-hidden p-0'>
      <div className='flex flex-col sm:flex-row'>
        <Skeleton className='sm:w-48 h-44 sm:h-auto rounded-none shrink-0' />
        <CardContent className='flex-1 p-5 space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </div>
          <div className='grid grid-cols-4 gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <div key={i} className='space-y-1'>
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            ))}
          </div>
          <div className='flex justify-between pt-3 border-t border-border'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-8 w-28' />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ─── pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        className='h-8 w-8 p-0 border-2 hover:border-primary/40'
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className='w-4 h-4' />
      </Button>

      <div className='flex items-center gap-1'>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-200 border-2',
              p === page
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary/40 hover:bg-primary/5',
            )}
          >
            {p}
          </Button>
        ))}
      </div>

      <Button
        variant='outline'
        size='sm'
        className='h-8 w-8 p-0 border-2 hover:border-primary/40'
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className='w-4 h-4' />
      </Button>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isPending, isError } = useMyBookings({
    status: activeTab,
    page,
    limit: 8,
  });

  function handleTabChange(value: string) {
    setActiveTab(value as BookingStatus | 'ALL');
    setPage(1);
  }

  function handleViewDetails(booking: Booking) {
    setSelectedBooking(booking);
    setDialogOpen(true);
  }

  return (
    <div className='max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
      {/* ── page header ───────────────────────────────────────────────────── */}
      <div className='mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='h-px w-12 bg-primary' />
          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
            My Account
          </span>
        </div>
        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='font-display text-4xl font-bold leading-tight tracking-tight'>
              My{' '}
              <span className='italic font-light text-muted-foreground'>
                bookings
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-sm mt-1'>
              View and manage all your travel bookings.
            </p>
          </div>
          {data && (
            <div className='flex items-center gap-2 pb-1'>
              <div className='h-px w-4 bg-primary shrink-0' />
              <span className='text-sm text-muted-foreground'>
                <span className='font-bold text-foreground'>
                  {data.pagination.total}
                </span>{' '}
                total booking{data.pagination.total !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── filter tabs ───────────────────────────────────────────────────── */}
      <div
        className='mb-6 animate-in fade-in slide-in-from-bottom duration-700'
        style={{ animationDelay: '80ms' }}
      >
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className='h-9'>
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='text-xs'
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── error state ───────────────────────────────────────────────────── */}
      {isError && (
        <Card className='border-2 border-destructive/20'>
          <CardContent className='py-12 flex flex-col items-center gap-3 text-center'>
            <div className='w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center'>
              <XCircle className='w-5 h-5 text-destructive' />
            </div>
            <div>
              <p className='font-semibold text-sm'>Failed to load bookings</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Something went wrong. Please refresh the page.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── booking list ──────────────────────────────────────────────────── */}
      {!isError && (
        <div
          className='space-y-4 animate-in fade-in slide-in-from-bottom duration-700'
          style={{ animationDelay: '160ms' }}
        >
          {isPending ? (
            Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <BookingCardSkeleton key={i} />
            ))
          ) : data?.bookings.length === 0 ? (
            <Card className='border-2 border-dashed'>
              <CardContent className='py-16 flex flex-col items-center justify-center gap-3 text-center'>
                <div className='w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <FileText className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <p className='font-display font-bold text-base'>
                    No{' '}
                    <span className='italic font-light text-muted-foreground'>
                      bookings
                    </span>{' '}
                    found
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {activeTab === 'ALL'
                      ? "You haven't made any bookings yet."
                      : `No ${activeTab.toLowerCase()} bookings found.`}
                  </p>
                </div>
                <Button size='sm' asChild>
                  <Link href='/packages'>Browse Packages</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {data?.bookings.map((booking, i) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  delay={i * 50}
                  onViewDetails={handleViewDetails}
                />
              ))}

              {/* pagination */}
              {data && data.pagination.totalPages > 1 && (
                <div className='pt-4'>
                  <Pagination
                    page={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                  <p className='text-center text-xs text-muted-foreground mt-3'>
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── booking detail dialog ─────────────────────────────────────────── */}
      <BookingDetailDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
