'use client';

// ─── app/dashboard/admin/bookings/page.tsx ────────────────────────────────────

import { format, parseISO } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  MoreHorizontal,
  RefreshCcw,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  useAdminBookingList,
  useDeleteBooking,
  useUpdateBookingStatus,
} from '@/services/booking';

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

type AdminBooking = {
  id: string;
  status: BookingStatus;
  travelDate: string;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
  subtotal: string;
  vat: string;
  total: string;
  adultCount: number;
  preteenCount: number;
  childCount: number;
  infantCount: number;
  user: { id: string; name: string; email: string };
  package: {
    id: string;
    name: string;
    slug: string;
    coverImage: string;
    durationDays: number;
    location: string;
    division: string;
  };
  members: {
    id: string;
    type: string;
    fullName: string;
    gender: string;
    idNumber: string;
    email: string;
    phone: string;
  }[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  },
  CONFIRMED: {
    label: 'Confirmed',
    icon: CheckCircle2,
    className:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap',
        className,
      )}
    >
      <Icon className='w-3 h-3' />
      {label}
    </span>
  );
}

function fmtDate(date: string) {
  return format(parseISO(date), 'd MMM yyyy');
}

function totalTravellers(b: AdminBooking) {
  return b.adultCount + b.preteenCount + b.childCount + b.infantCount;
}

// ─── Delete dialog ────────────────────────────────────────────────────────────

function DeleteDialog({
  booking,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: {
  booking: AdminBooking | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <div className='w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2'>
            <Trash2 className='w-5 h-5 text-destructive' />
          </div>
          <DialogTitle>Delete booking?</DialogTitle>
          <DialogDescription>
            Booking{' '}
            <span className='font-semibold text-foreground'>
              #{booking?.id.slice(-8).toUpperCase()}
            </span>{' '}
            for{' '}
            <span className='font-semibold text-foreground'>
              {booking?.user.name}
            </span>{' '}
            will be permanently removed. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isDeleting}
            className='gap-2'
          >
            <Trash2 className='w-4 h-4' />
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Status update dialog ─────────────────────────────────────────────────────

function StatusDialog({
  booking,
  nextStatus,
  open,
  onClose,
  onConfirm,
  isUpdating,
}: {
  booking: AdminBooking | null;
  nextStatus: BookingStatus | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isUpdating: boolean;
}) {
  if (!nextStatus) return null;
  const { label, icon: Icon, className } = STATUS_CONFIG[nextStatus];
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center mb-2',
              className,
            )}
          >
            <Icon className='w-5 h-5' />
          </div>
          <DialogTitle>Mark as {label}?</DialogTitle>
          <DialogDescription>
            Booking{' '}
            <span className='font-semibold text-foreground'>
              #{booking?.id.slice(-8).toUpperCase()}
            </span>{' '}
            for{' '}
            <span className='font-semibold text-foreground'>
              {booking?.user.name}
            </span>{' '}
            will be updated to{' '}
            <span className='font-semibold text-foreground lowercase'>
              {label}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isUpdating} className='gap-2'>
            <Icon className='w-4 h-4' />
            {isUpdating ? 'Updating…' : `Mark ${label}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row actions ──────────────────────────────────────────────────────────────

function RowActions({
  booking,
  onDelete,
  onStatusChange,
}: {
  booking: AdminBooking;
  onDelete: (b: AdminBooking) => void;
  onStatusChange: (b: AdminBooking, s: BookingStatus) => void;
}) {
  const others = (
    ['PENDING', 'CONFIRMED', 'CANCELLED'] as BookingStatus[]
  ).filter((s) => s !== booking.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/admin/bookings/${booking.id}`}
            className='flex items-center gap-2'
          >
            <ExternalLink className='w-3.5 h-3.5' />
            View details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {others.map((s) => {
          const { label, icon: Icon } = STATUS_CONFIG[s];
          return (
            <DropdownMenuItem
              key={s}
              className='flex items-center gap-2'
              onClick={() => onStatusChange(booking, s)}
            >
              <Icon className='w-3.5 h-3.5' />
              Mark {label}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='flex items-center gap-2 text-destructive focus:text-destructive'
          onClick={() => onDelete(booking)}
        >
          <Trash2 className='w-3.5 h-3.5' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Status tabs ──────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { value: '', label: 'All Bookings' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

// ─── Stats card ───────────────────────────────────────────────────────────────

function StatsCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  variant?: 'default' | 'pending' | 'confirmed' | 'cancelled';
}) {
  const variants = {
    default:
      'bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300',
    pending:
      'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
    confirmed:
      'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    cancelled: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300',
  };
  return (
    <div
      className={cn(
        'rounded-xl p-4 border border-opacity-20',
        variants[variant],
      )}
    >
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-xs font-medium opacity-75'>{label}</p>
          <p className='text-2xl font-bold mt-1'>{value.toLocaleString()}</p>
        </div>
        <div className='opacity-40'>
          <Icon className='w-6 h-6' />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton stats ───────────────────────────────────────────────────────────

function StatsCardSkeleton() {
  return (
    <div className='rounded-xl p-4 border border-border'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-7 w-12' />
        </div>
        <Skeleton className='h-6 w-6 rounded' />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingListPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminBooking | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminBooking | null>(null);
  const [nextStatus, setNextStatus] = useState<BookingStatus | null>(null);

  const { isPending, data, isError, refetch, isRefetching } =
    useAdminBookingList({
      status: statusFilter,
      page,
    });

  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateBookingStatus();

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteBooking(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const handleStatusConfirm = () => {
    if (!statusTarget || !nextStatus) return;
    updateStatus(
      { id: statusTarget.id, status: nextStatus },
      {
        onSuccess: () => {
          setStatusTarget(null);
          setNextStatus(null);
        },
      },
    );
  };

  // ── Error ──
  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-4'>
        <div className='w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center'>
          <AlertCircle className='w-8 h-8 text-destructive' />
        </div>
        <div className='text-center space-y-1'>
          <h2 className='text-lg font-bold'>Failed to load bookings</h2>
          <p className='text-sm text-muted-foreground max-w-sm'>
            There was a problem connecting to the server. Check your connection
            and try again.
          </p>
        </div>
        <Button onClick={() => refetch()} variant='outline' className='gap-2'>
          <RefreshCcw
            className={cn('w-4 h-4', isRefetching && 'animate-spin')}
          />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <>
      <DeleteDialog
        booking={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      <StatusDialog
        booking={statusTarget}
        nextStatus={nextStatus}
        open={!!statusTarget}
        onClose={() => {
          setStatusTarget(null);
          setNextStatus(null);
        }}
        onConfirm={handleStatusConfirm}
        isUpdating={isUpdating}
      />

      <div className='space-y-8'>
        {/* Header */}
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>Bookings</h1>
              <p className='text-sm text-muted-foreground mt-1'>
                {data
                  ? `Manage ${data.counts.all} bookings across your travel packages`
                  : 'Manage customer bookings'}
              </p>
            </div>
            <Button onClick={() => refetch()} className='gap-2 self-start'>
              <RefreshCcw
                className={cn('w-4 h-4', isRefetching && 'animate-spin')}
              />
              Refresh
            </Button>
          </div>

          {/* Stats grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {isPending ? (
              Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <StatsCardSkeleton key={i} />
              ))
            ) : data ? (
              <>
                <StatsCard
                  label='Total Bookings'
                  value={data.counts.all}
                  icon={Calendar}
                  variant='default'
                />
                <StatsCard
                  label='Pending'
                  value={data.counts.pending}
                  icon={Clock}
                  variant='pending'
                />
                <StatsCard
                  label='Confirmed'
                  value={data.counts.confirmed}
                  icon={CheckCircle2}
                  variant='confirmed'
                />
                <StatsCard
                  label='Cancelled'
                  value={data.counts.cancelled}
                  icon={XCircle}
                  variant='cancelled'
                />
              </>
            ) : null}
          </div>
        </div>

        {/* Status filter tabs */}
        <div className='flex gap-2 overflow-x-auto pb-1'>
          {STATUS_TABS.map(({ value, label }) => {
            const count = data?.counts
              ? value === ''
                ? data.counts.all
                : value === 'PENDING'
                  ? data.counts.pending
                  : value === 'CONFIRMED'
                    ? data.counts.confirmed
                    : data.counts.cancelled
              : null;

            return (
              <Button
                key={value}
                type='button'
                onClick={() => {
                  setStatusFilter(value);
                  setPage(1);
                }}
                variant={statusFilter === value ? 'default' : 'outline'}
                className='gap-2 shrink-0'
              >
                {label}
                {count !== null && (
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full font-semibold min-w-5 text-center',
                      statusFilter === value
                        ? 'bg-white/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
                    )}
                  >
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Table */}
        <Card className='p-0 overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading rows */}
              {isPending &&
                Array.from({ length: 8 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <TableRow key={i}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='w-10 h-10 rounded-xl shrink-0' />
                        <div className='space-y-1.5'>
                          <Skeleton className='h-3.5 w-36' />
                          <Skeleton className='h-3 w-24' />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-3.5 w-28' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-6 w-22 rounded-full' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-3.5 w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-3.5 w-16' />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Skeleton className='h-8 w-8 rounded-lg ml-auto' />
                    </TableCell>
                  </TableRow>
                ))}

              {/* Empty state */}
              {!isPending && data?.bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className='flex flex-col items-center justify-center py-12 space-y-3'>
                      <div className='w-12 h-12 rounded-2xl bg-muted flex items-center justify-center'>
                        <Calendar className='w-6 h-6 text-muted-foreground' />
                      </div>
                      <div className='text-center space-y-1'>
                        <p className='text-sm font-semibold'>
                          No bookings found
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {statusFilter
                            ? 'Try a different status filter.'
                            : 'Bookings will appear here once customers start booking.'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {!isPending &&
                data?.bookings.map((booking, i) => (
                  <TableRow
                    key={booking.id}
                    className='animate-in fade-in duration-300'
                    style={{
                      animationDelay: `${i * 25}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    {/* Package */}
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Link
                          href={`/dashboard/admin/bookings/${booking.id}`}
                          className='relative w-10 h-10 rounded-xl overflow-hidden shrink-0 block'
                        >
                          <Image
                            src={booking.package.coverImage}
                            alt={booking.package.name}
                            fill
                            className='object-cover hover:scale-105 transition-transform duration-300'
                          />
                        </Link>
                        <div className='min-w-0'>
                          <Link
                            href={`/dashboard/admin/bookings/${booking.id}`}
                            className='text-sm font-semibold truncate block hover:text-primary transition-colors'
                          >
                            {booking.package.name}
                          </Link>
                          <div className='flex items-center gap-1 text-xs text-muted-foreground mt-0.5'>
                            <MapPin className='w-3 h-3 shrink-0' />
                            <span className='truncate'>
                              {booking.package.division} ·{' '}
                              {booking.package.location}
                            </span>
                            <span className='text-muted-foreground/40 shrink-0'>
                              ·
                            </span>
                            <span className='shrink-0'>
                              {booking.package.durationDays}d
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <p className='text-sm font-medium'>{booking.user.name}</p>
                      <div className='flex items-center gap-1 text-xs text-muted-foreground mt-0.5'>
                        <Users className='w-3 h-3' />
                        {totalTravellers(booking)} travellers
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>

                    {/* Travel date */}
                    <TableCell>
                      <p className='text-sm'>{fmtDate(booking.travelDate)}</p>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        Booked {fmtDate(booking.createdAt)}
                      </p>
                    </TableCell>

                    {/* Total */}
                    <TableCell>
                      <p className='text-sm font-bold text-primary'>
                        ৳{Number(booking.total).toLocaleString()}
                      </p>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className='text-right'>
                      <RowActions
                        booking={booking}
                        onDelete={setDeleteTarget}
                        onStatusChange={(b, s) => {
                          setStatusTarget(b);
                          setNextStatus(s);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className='flex items-center justify-between'>
            <p className='text-xs text-muted-foreground'>
              Page {data.pagination.page} of {data.pagination.totalPages} ·{' '}
              {data.pagination.total} total
            </p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className='gap-1.5'
              >
                <ChevronLeft className='w-3.5 h-3.5' />
                Prev
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className='gap-1.5'
              >
                Next
                <ChevronRight className='w-3.5 h-3.5' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
