'use client';

import {
  AlertCircle,
  ArrowLeft,
  Baby,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Trash2,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  useDeleteBooking,
  useSingleBooking,
  useUpdateBookingStatus,
} from '@/services/booking';

// ─── Types ────────────────────────────────────────────────────────────────────
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
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
        'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
        className,
      )}
    >
      <Icon className='w-3 h-3' />
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-3'>
      {children}
    </p>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className='flex items-center justify-between py-2.5 border-b border-border last:border-0'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Icon className='w-3.5 h-3.5 shrink-0' />
        {label}
      </div>
      <span className='text-sm font-medium text-right'>{value}</span>
    </div>
  );
}

// ─── Delete dialog ────────────────────────────────────────────────────────────
function DeleteDialog({
  bookingId,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: {
  bookingId: string;
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
              #{bookingId.slice(-8).toUpperCase()}
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

// ─── Status dialog ────────────────────────────────────────────────────────────
function StatusDialog({
  bookingId,
  nextStatus,
  open,
  onClose,
  onConfirm,
  isUpdating,
}: {
  bookingId: string;
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
              #{bookingId.slice(-8).toUpperCase()}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SingleBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const router = useRouter();

  const { data, isPending, isError, refetch } = useSingleBooking(bookingId);
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateBookingStatus();

  const [showDelete, setShowDelete] = useState(false);
  const [nextStatus, setNextStatus] = useState<BookingStatus | null>(null);

  const handleDeleteConfirm = () => {
    deleteBooking(bookingId, {
      onSuccess: () => router.push('/dashboard/admin/bookings'),
    });
  };

  const handleStatusConfirm = () => {
    if (!nextStatus) return;
    updateStatus(
      { id: bookingId, status: nextStatus },
      { onSuccess: () => setNextStatus(null) },
    );
  };

  // ── Loading ──
  if (isPending) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-9 w-32' />
          <Skeleton className='h-6 w-48' />
        </div>
        <div className='grid lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            <Skeleton className='h-48 w-full rounded-2xl' />
            <Skeleton className='h-64 w-full rounded-2xl' />
          </div>
          <div className='space-y-6'>
            <Skeleton className='h-48 w-full rounded-2xl' />
            <Skeleton className='h-48 w-full rounded-2xl' />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError || !data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-4'>
        <div className='w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center'>
          <AlertCircle className='w-8 h-8 text-destructive' />
        </div>
        <div className='text-center space-y-1'>
          <h2 className='text-lg font-bold'>Booking not found</h2>
          <p className='text-sm text-muted-foreground max-w-sm'>
            This booking may have been deleted or the ID is invalid.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => refetch()} className='gap-2'>
            <RefreshCcw className='w-4 h-4' />
            Try again
          </Button>
          <Button asChild variant='outline'>
            <Link href='/dashboard/admin/bookings'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              All bookings
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const otherStatuses = (
    ['PENDING', 'CONFIRMED', 'CANCELLED'] as BookingStatus[]
  ).filter((s) => s !== data.status);
  const totalTravellers =
    data.adultCount + data.preteenCount + data.childCount + data.infantCount;

  return (
    <>
      <DeleteDialog
        bookingId={bookingId}
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      <StatusDialog
        bookingId={bookingId}
        nextStatus={nextStatus}
        open={!!nextStatus}
        onClose={() => setNextStatus(null)}
        onConfirm={handleStatusConfirm}
        isUpdating={isUpdating}
      />

      <div className='space-y-6'>
        {/* ── Header ── */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm' asChild className='gap-2'>
              <Link href='/dashboard/admin/bookings'>
                <ArrowLeft className='w-4 h-4' />
                Bookings
              </Link>
            </Button>
            <Separator orientation='vertical' className='h-5' />
            <div>
              <div className='flex items-center gap-2.5'>
                <h1 className='text-lg font-bold'>
                  #{bookingId.slice(-8).toUpperCase()}
                </h1>
                <StatusBadge status={data.status as BookingStatus} />
              </div>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Created {formatDateTime(data.createdAt)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='gap-2'>
                  Update status
                  <ChevronDown className='w-3.5 h-3.5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-44'>
                {otherStatuses.map((s) => {
                  const { label, icon: Icon } = STATUS_CONFIG[s];
                  return (
                    <DropdownMenuItem
                      key={s}
                      className='flex items-center gap-2'
                      onClick={() => setNextStatus(s)}
                    >
                      <Icon className='w-3.5 h-3.5' />
                      Mark {label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant='destructive'
              size='sm'
              className='gap-2'
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className='w-3.5 h-3.5' />
              Delete
            </Button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className='grid lg:grid-cols-3 gap-6'>
          {/* ── Left column (2/3) ── */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Package card */}
            <div className='rounded-2xl border border-border overflow-hidden'>
              <div className='relative h-44'>
                <Image
                  src={data.package.coverImage}
                  alt={data.package.name}
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                  <p className='font-bold text-base leading-tight'>
                    {data.package.name}
                  </p>
                  <div className='flex items-center gap-3 mt-1 text-xs text-white/80'>
                    <div className='flex items-center gap-1'>
                      <MapPin className='w-3 h-3' />
                      {data.package.destination.name},{' '}
                      {data.package.destination.division}
                    </div>
                    <span>·</span>
                    <div className='flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {data.package.durationDays} days
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-2 divide-x divide-border border-t border-border'>
                <div className='p-4 text-center'>
                  <p className='text-xs text-muted-foreground'>Travel Date</p>
                  <p className='text-sm font-semibold mt-0.5'>
                    {formatDate(data.travelDate)}
                  </p>
                </div>
                <div className='p-4 text-center'>
                  <p className='text-xs text-muted-foreground'>Location</p>
                  <p className='text-sm font-semibold mt-0.5'>
                    {data.package.Location}
                  </p>
                </div>
              </div>
            </div>

            {/* Members */}
            {data.members.length > 0 && (
              <div>
                <SectionLabel>
                  Traveller members · {data.members.length}
                </SectionLabel>
                <div className='space-y-3'>
                  {data.members.map((member) => (
                    <div
                      key={member.id}
                      className='rounded-xl border border-border p-4 animate-in fade-in slide-in-from-bottom-2'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-2'>
                          <div className='w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                            <User className='w-3.5 h-3.5 text-primary' />
                          </div>
                          <p className='text-sm font-semibold'>
                            {member.fullName}
                          </p>
                        </div>
                        <span className='text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full capitalize font-medium'>
                          {member.type} · {member.gender}
                        </span>
                      </div>
                      <div className='grid sm:grid-cols-3 gap-2'>
                        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                          <Mail className='w-3 h-3 shrink-0' />
                          <span className='truncate'>{member.email}</span>
                        </div>
                        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                          <Phone className='w-3 h-3 shrink-0' />
                          {member.phone}
                        </div>
                        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                          <CreditCard className='w-3 h-3 shrink-0' />
                          ID: {member.idNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {data.notes && (
              <div>
                <SectionLabel>Notes</SectionLabel>
                <p className='text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-4'>
                  {data.notes}
                </p>
              </div>
            )}
          </div>

          {/* ── Right column (1/3) ── */}
          <div className='space-y-6'>
            {/* Customer */}
            <div>
              <SectionLabel>Customer</SectionLabel>
              <div className='rounded-xl border border-border p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  {data.user.image ? (
                    <Image
                      src={data.user.image}
                      alt={data.user.name}
                      width={36}
                      height={36}
                      className='rounded-full shrink-0'
                    />
                  ) : (
                    <div className='w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                      <User className='w-4 h-4 text-primary' />
                    </div>
                  )}
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold truncate'>
                      {data.user.name}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                      {data.user.email}
                    </p>
                  </div>
                </div>
                <Separator className='my-3' />
                <div className='space-y-1'>
                  <InfoRow icon={Mail} label='Email' value={data.user.email} />
                </div>
              </div>
            </div>

            {/* Group composition */}
            <div>
              <SectionLabel>Group · {totalTravellers} travellers</SectionLabel>
              <div className='rounded-xl border border-border overflow-hidden'>
                {[
                  { label: 'Adults', count: data.adultCount, icon: User },
                  { label: 'Pre-teens', count: data.preteenCount, icon: Users },
                  { label: 'Children', count: data.childCount, icon: Users },
                  { label: 'Infants', count: data.infantCount, icon: Baby },
                ]
                  .filter(({ count }) => count > 0)
                  .map(({ label, count, icon: Icon }, i, arr) => (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center justify-between px-4 py-3',
                        i < arr.length - 1 && 'border-b border-border',
                      )}
                    >
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon className='w-3.5 h-3.5' />
                        {label}
                      </div>
                      <span className='text-sm font-bold'>{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <SectionLabel>Pricing</SectionLabel>
              <div className='rounded-xl border border-border overflow-hidden'>
                <div className='flex justify-between px-4 py-3 border-b border-border'>
                  <span className='text-sm text-muted-foreground'>
                    Subtotal
                  </span>
                  <span className='text-sm font-medium'>
                    ৳{Number(data.subtotal).toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between px-4 py-3 border-b border-border'>
                  <span className='text-sm text-muted-foreground'>VAT</span>
                  <span className='text-sm font-medium'>
                    ৳{Number(data.vat).toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between px-4 py-3 bg-primary/5'>
                  <span className='text-sm font-bold'>Total</span>
                  <span className='text-sm font-bold text-primary'>
                    ৳{Number(data.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div>
              <SectionLabel>Details</SectionLabel>
              <div className='rounded-xl border border-border py-3 px-4 overflow-hidden'>
                <InfoRow
                  icon={Calendar}
                  label='Booked on'
                  value={formatDate(data.createdAt)}
                />
                <InfoRow
                  icon={Calendar}
                  label='Updated on'
                  value={formatDate(data.updatedAt)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
