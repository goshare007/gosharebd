'use client';

import { format, parseISO } from 'date-fns';
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
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/lib/auth-client';
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

function fmtDate(date: string) {
  return format(parseISO(date), 'd MMM yyyy');
}

function fmtDateTime(date: string) {
  return format(parseISO(date), 'd MMM yyyy, hh:mm a');
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
      className={cn(
        'text-xs font-semibold tracking-wide gap-1.5 px-2.5 py-1',
        s.className,
      )}
    >
      <Icon className='w-3 h-3' />
      {s.label}
    </Badge>
  );
}

// ─── section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex items-center gap-3 mb-3'>
      <div className='h-px w-8 bg-primary shrink-0' />
      <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
        {children}
      </span>
    </div>
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
  // Fix: capture wheel events so they scroll the dialog content,
  // not the page behind the overlay.
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop === 0 && e.deltaY < 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
    if (!atTop && !atBottom) {
      e.stopPropagation();
    }
  };

  if (!booking) return null;

  const travelers = totalTravelers(booking);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Remove default padding; we control all layout inside */}
      <DialogContent className='max-w-3xl p-0 gap-0 overflow-hidden'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Booking details for {booking.package.name}</DialogTitle>
        </DialogHeader>
        <div
          ref={scrollRef}
          onWheel={handleWheel}
          className='max-h-[90vh] overflow-y-auto overscroll-contain'
        >
          {/* Hero image */}
          <div className='relative h-52 shrink-0'>
            <Image
              src={booking.package.coverImage}
              alt={booking.package.name}
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />
            <div className='absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3'>
              <div className='min-w-0'>
                <p className='font-display text-white font-bold text-xl leading-tight line-clamp-2'>
                  {booking.package.name}
                </p>
                <div className='flex items-center gap-1.5 text-white/70 text-xs mt-1'>
                  <MapPin className='w-3 h-3 shrink-0' />
                  <span>
                    {booking.package.division} · {booking.package.location}
                  </span>
                </div>
              </div>
              <div className='shrink-0'>
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className='p-6 space-y-7'>
            {/* Meta grid */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5'>
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
                  className='rounded-xl border border-border bg-muted/30 p-3 space-y-1.5'
                >
                  <div className='flex items-center gap-1.5 text-muted-foreground'>
                    <Icon className='w-3.5 h-3.5' />
                    <span className='text-[10px] font-bold tracking-[0.15em] uppercase'>
                      {label}
                    </span>
                  </div>
                  <p className='text-sm font-bold leading-tight'>{value}</p>
                </div>
              ))}
            </div>

            {/* Traveler breakdown */}
            {travelers > 0 && (
              <div>
                <SectionLabel>Traveler Breakdown</SectionLabel>
                <div className='flex flex-wrap gap-2'>
                  {booking.adultCount > 0 && (
                    <Badge variant='secondary' className='gap-1.5 px-3 py-1'>
                      <Users className='w-3 h-3' />
                      {booking.adultCount} Adult
                      {booking.adultCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {booking.preteenCount > 0 && (
                    <Badge variant='secondary' className='gap-1.5 px-3 py-1'>
                      {booking.preteenCount} Preteen
                      {booking.preteenCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {booking.childCount > 0 && (
                    <Badge variant='secondary' className='gap-1.5 px-3 py-1'>
                      {booking.childCount} Child
                      {booking.childCount > 1 ? 'ren' : ''}
                    </Badge>
                  )}
                  {booking.infantCount > 0 && (
                    <Badge variant='secondary' className='gap-1.5 px-3 py-1'>
                      {booking.infantCount} Infant
                      {booking.infantCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Members */}
            {booking.members.length > 0 && (
              <div>
                <SectionLabel>Members</SectionLabel>
                <div className='space-y-2'>
                  {booking.members.map((member, i) => (
                    <div
                      key={member.id}
                      className='flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/20 hover:bg-primary/2 transition-all duration-200'
                    >
                      <div className='w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0'>
                        <span className='text-xs font-bold text-primary'>
                          {member.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <p className='text-sm font-semibold'>
                            {member.fullName}
                          </p>
                          {i === 0 && (
                            <span className='text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full'>
                              Lead
                            </span>
                          )}
                          <Badge
                            variant='outline'
                            className='text-[10px] capitalize px-1.5 py-0 h-4'
                          >
                            {member.type}
                          </Badge>
                          <Badge
                            variant='outline'
                            className='text-[10px] capitalize px-1.5 py-0 h-4'
                          >
                            {member.gender}
                          </Badge>
                        </div>
                        <div className='flex flex-wrap gap-x-4 gap-y-0.5 mt-1'>
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
                      <p className='text-[10px] text-muted-foreground font-mono shrink-0 hidden sm:block'>
                        {member.idNumber}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {booking.notes && (
              <div>
                <SectionLabel>Notes</SectionLabel>
                <div className='flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15'>
                  <StickyNote className='w-4 h-4 text-primary shrink-0 mt-0.5' />
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    {booking.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div>
              <SectionLabel>Pricing</SectionLabel>
              <div className='rounded-xl border border-border overflow-hidden'>
                <div className='flex justify-between items-center px-4 py-3'>
                  <span className='text-sm text-muted-foreground'>
                    Subtotal
                  </span>
                  <span className='text-sm font-semibold'>
                    {fmt(booking.subtotal)}
                  </span>
                </div>
                <Separator />
                <div className='flex justify-between items-center px-4 py-3'>
                  <span className='text-sm text-muted-foreground'>
                    VAT (15%)
                  </span>
                  <span className='text-sm font-semibold'>
                    {fmt(booking.vat)}
                  </span>
                </div>
                <Separator />
                <div className='flex justify-between items-center px-4 py-3.5 bg-primary/5'>
                  <div className='flex items-center gap-2'>
                    <CreditCard className='w-4 h-4 text-primary' />
                    <span className='text-sm font-bold'>Total</span>
                  </div>
                  <span className='text-lg font-bold text-primary'>
                    {fmt(booking.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer meta */}
            <div className='pt-1 border-t border-border space-y-1'>
              <p className='text-xs text-muted-foreground'>
                Booking ID:{' '}
                <span className='font-mono text-foreground/60'>
                  {booking.id}
                </span>
              </p>
              <p className='text-xs text-muted-foreground'>
                Created: {fmtDateTime(booking.createdAt)}
              </p>
              <p className='text-xs text-muted-foreground'>
                Updated: {fmtDateTime(booking.updatedAt)}
              </p>
            </div>
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
      className='group border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden p-0 animate-in fade-in slide-in-from-bottom-2'
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className='flex flex-col sm:flex-row'>
        {/* Cover image */}
        <div className='relative sm:w-44 h-44 sm:h-auto shrink-0 overflow-hidden'>
          <Image
            src={booking.package.coverImage}
            alt={booking.package.name}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-500'
          />
          <div className='absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/50 via-black/10 to-transparent' />
          <div className='absolute top-3 left-3 sm:hidden'>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Content */}
        <CardContent className='flex-1 p-5 flex flex-col justify-between gap-3 min-w-0'>
          {/* Top */}
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <h3 className='font-display font-bold text-base leading-snug line-clamp-1'>
                {booking.package.name}
              </h3>
              <div className='flex items-center gap-1 mt-1 text-xs text-muted-foreground'>
                <MapPin className='w-3 h-3 shrink-0 text-primary/50' />
                <span className='truncate'>
                  {booking.package.division} · {booking.package.location}
                </span>
              </div>
            </div>
            <div className='hidden sm:block shrink-0'>
              <StatusBadge status={booking.status} />
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {[
              {
                icon: CalendarDays,
                label: 'Travel',
                value: fmtDate(booking.travelDate),
              },
              {
                icon: Clock,
                label: 'Duration',
                value: `${booking.package.durationDays}d`,
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
                  <span className='text-[10px] font-bold uppercase tracking-wide'>
                    {label}
                  </span>
                </div>
                <p className='text-sm font-semibold'>{value}</p>
              </div>
            ))}
          </div>

          {/* Bottom */}
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
              className='text-xs h-8 gap-1.5 border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200'
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

// ─── skeleton ─────────────────────────────────────────────────────────────────

function BookingCardSkeleton() {
  return (
    <Card className='border overflow-hidden p-0'>
      <div className='flex flex-col sm:flex-row'>
        <Skeleton className='sm:w-44 h-44 sm:h-auto rounded-none shrink-0' />
        <CardContent className='flex-1 p-5 space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-3 w-1/3' />
          </div>
          <div className='grid grid-cols-4 gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <div key={i} className='space-y-1.5'>
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-4 w-4/5' />
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

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ activeTab }: { activeTab: BookingStatus | 'ALL' }) {
  return (
    <Card className='border border-dashed'>
      <CardContent className='py-20 flex flex-col items-center justify-center gap-4 text-center'>
        <div className='w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center'>
          <FileText className='w-7 h-7 text-primary/60' />
        </div>
        <div className='space-y-1'>
          <p className='font-display font-bold text-lg'>
            No{' '}
            <span className='italic font-light text-muted-foreground'>
              bookings
            </span>{' '}
            found
          </p>
          <p className='text-sm text-muted-foreground'>
            {activeTab === 'ALL'
              ? "You haven't made any bookings yet."
              : `No ${activeTab.toLowerCase()} bookings to show.`}
          </p>
        </div>
        <Button size='sm' asChild className='mt-1'>
          <Link href='/packages'>Browse Packages</Link>
        </Button>
      </CardContent>
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
    <div className='flex items-center justify-center gap-1.5'>
      <Button
        variant='outline'
        size='icon'
        className='h-8 w-8 border hover:border-primary/40'
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className='w-4 h-4' />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          size='icon'
          variant={p === page ? 'default' : 'outline'}
          className={cn(
            'h-8 w-8 text-xs font-semibold border',
            p !== page && 'hover:border-primary/40 hover:bg-primary/5',
          )}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}

      <Button
        variant='outline'
        size='icon'
        className='h-8 w-8 border hover:border-primary/40'
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className='w-4 h-4' />
      </Button>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

function MyBookingsPage() {
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
    <div className='min-h-screen bg-background'>
      {/* Hero header — matches contact page pattern */}
      <section className='relative pt-14 pb-10 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[8rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          TRIPS
        </div>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                My Account
              </span>
            </div>
            <div className='flex items-end justify-between gap-4 flex-wrap'>
              <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight'>
                My{' '}
                <span className='italic font-light text-muted-foreground'>
                  bookings
                </span>
                <span className='text-primary'>.</span>
              </h1>
              {data && (
                <p className='text-sm text-muted-foreground pb-1'>
                  <span className='font-bold text-foreground'>
                    {data.pagination.total}
                  </span>{' '}
                  total booking{data.pagination.total !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <p className='text-muted-foreground text-sm mt-2'>
              View and manage all your travel bookings.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className='py-10'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6'>
          {/* Filter tabs */}
          <div
            className='animate-in fade-in slide-in-from-bottom duration-700'
            style={{ animationDelay: '80ms', animationFillMode: 'both' }}
          >
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className='h-9'>
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='text-xs px-4'
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Error */}
          {isError && (
            <Card className='border border-destructive/20'>
              <CardContent className='py-14 flex flex-col items-center gap-3 text-center'>
                <div className='w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center'>
                  <XCircle className='w-5 h-5 text-destructive' />
                </div>
                <div>
                  <p className='font-semibold text-sm'>
                    Failed to load bookings
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Something went wrong. Please refresh the page.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* List */}
          {!isError && (
            <div
              className='space-y-3 animate-in fade-in slide-in-from-bottom duration-700'
              style={{ animationDelay: '160ms', animationFillMode: 'both' }}
            >
              {isPending ? (
                Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <BookingCardSkeleton key={i} />
                ))
              ) : data?.bookings.length === 0 ? (
                <EmptyState activeTab={activeTab} />
              ) : (
                <>
                  {data?.bookings.map((booking, i) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      delay={i * 40}
                      onViewDetails={handleViewDetails}
                    />
                  ))}

                  {data && data.pagination.totalPages > 1 && (
                    <div className='pt-4 space-y-2'>
                      <Pagination
                        page={data.pagination.page}
                        totalPages={data.pagination.totalPages}
                        onPageChange={(p) => {
                          setPage(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                      <p className='text-center text-xs text-muted-foreground'>
                        Page {data.pagination.page} of{' '}
                        {data.pagination.totalPages}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Detail dialog */}
      <BookingDetailDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

// ─── export with auth guard ───────────────────────────────────────────────────

export default function Bookings() {
  const { isPending, data: session } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className='max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!session) {
    router.push('/sign-in');
    return null;
  }

  return <MyBookingsPage />;
}
