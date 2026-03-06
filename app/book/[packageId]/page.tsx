'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, isSameDay } from 'date-fns';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  Shield,
  ShieldCheck,
  Star,
  Tag,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { TIERS } from '@/constants/vat-rate';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useBooking } from '@/services/booking';
import { useSinglePackagesWithDepartures } from '@/services/departure';
import ErrorState from './error-state';
import { TIER_ICONS, type TierKey } from './helper';
import LoadingSkeleton from './loading-skeleton';
import MemberCard from './member-card';
import PricingSummary from './pricing-summary';
import {
  type BookingFormValues,
  bookingSchema,
  type GroupMember,
} from './schema';
import SuccessState from './success-state';

const VAT_RATE = 0.15;

// ─── Types ────────────────────────────────────────────────────────────────────

type Urgency = 'available' | 'low' | 'critical' | 'full';

type Departure = {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  fillPct: number;
  urgency: Urgency;
  isGuaranteed: boolean;
  note: string | null;
  effectivePricePerPerson: number;
  effectiveOriginalPrice: number | null;
  effectiveCouplePrice: number | null;
  effectiveOriginalCouplePrice: number | null;
  hasPriceOverride: boolean;
  discountPct: number | null;
};

// ─── Urgency config ───────────────────────────────────────────────────────────

const URGENCY: Record<
  Urgency,
  { label: (n: number) => string; text: string; bar: string }
> = {
  available: {
    label: (n) => `${n} spots left`,
    text: 'text-emerald-600',
    bar: 'bg-emerald-500',
  },
  low: {
    label: (n) => `${n} spots left`,
    text: 'text-amber-600',
    bar: 'bg-amber-500',
  },
  critical: {
    label: (n) => `Only ${n} left!`,
    text: 'text-red-500',
    bar: 'bg-red-500',
  },
  full: {
    label: () => 'Fully booked',
    text: 'text-muted-foreground',
    bar: 'bg-muted-foreground',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyMember = (type: 'adult' | 'preteen'): GroupMember => ({
  type,
  fullName: '',
  gender: '' as 'male' | 'female' | 'other',
  idNumber: '',
  email: '',
  phone: '',
});

function calcPricing(
  pricePerPerson: number,
  group: BookingFormValues['group'],
) {
  const subtotal = (Object.keys(TIERS) as TierKey[]).reduce(
    (s, k) => s + pricePerPerson * TIERS[k].multiplier * group[k],
    0,
  );
  const vat = subtotal * VAT_RATE;
  return { subtotal, vat, total: subtotal + vat };
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex items-center gap-3 mb-4'>
      <div className='h-px w-8 bg-primary' />
      <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
        {children}
      </span>
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className='flex items-center gap-2'>
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='h-8 w-8 rounded-full'
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className='w-3 h-3' />
      </Button>
      <span className='w-6 text-center text-sm font-bold tabular-nums'>
        {value}
      </span>
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='h-8 w-8 rounded-full'
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus className='w-3 h-3' />
      </Button>
    </div>
  );
}

// ─── Departure slot ───────────────────────────────────────────────────────────

function DepartureSlot({
  departure,
  selected,
  onSelect,
  packageIsCouple,
}: {
  departure: Departure;
  selected: boolean;
  onSelect: () => void;
  packageIsCouple: boolean;
}) {
  const u = URGENCY[departure.urgency];
  const isFull = departure.urgency === 'full';

  return (
    <button
      type='button'
      disabled={isFull}
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-xl border-2 p-4 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : isFull
            ? 'border-border bg-muted/20 cursor-not-allowed opacity-60'
            : 'border-border hover:border-primary/40 hover:bg-muted/20',
      )}
    >
      <div className='flex items-start justify-between gap-3'>
        {/* Left */}
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='font-bold text-sm'>
              {format(new Date(departure.startDate), 'dd MMM yyyy')}
            </span>
            <span className='text-muted-foreground text-xs'>→</span>
            <span className='text-sm text-muted-foreground'>
              {format(new Date(departure.endDate), 'dd MMM yyyy')}
            </span>
          </div>

          {/* Badges */}
          <div className='flex items-center gap-1.5 flex-wrap mt-1.5'>
            {departure.isGuaranteed && (
              <span className='inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'>
                <ShieldCheck className='w-2.5 h-2.5' />
                Guaranteed
              </span>
            )}
            {departure.hasPriceOverride && (
              <span className='inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20'>
                <Tag className='w-2.5 h-2.5' />
                Special Rate
              </span>
            )}
            {departure.discountPct && (
              <span className='inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20'>
                {departure.discountPct}% off
              </span>
            )}
          </div>

          {departure.note && (
            <p className='text-xs text-muted-foreground mt-1.5 italic'>
              "{departure.note}"
            </p>
          )}

          {/* Seat bar */}
          <div className='mt-3 space-y-1'>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-muted-foreground'>
                {departure.bookedSeats}/{departure.totalSeats} booked
              </span>
              <span className={cn('font-semibold', u.text)}>
                {u.label(departure.availableSeats)}
              </span>
            </div>
            <div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  u.bar,
                )}
                style={{ width: `${Math.max(departure.fillPct, 2)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: price + radio */}
        <div className='shrink-0 text-right flex flex-col items-end gap-3'>
          <div>
            <p className='font-bold text-base text-primary'>
              ৳{departure.effectivePricePerPerson.toLocaleString()}
            </p>
            {departure.effectiveOriginalPrice &&
              departure.effectiveOriginalPrice !==
                departure.effectivePricePerPerson && (
                <p className='text-xs text-muted-foreground line-through'>
                  ৳{departure.effectiveOriginalPrice.toLocaleString()}
                </p>
              )}
            <p className='text-[10px] text-muted-foreground'>/ person</p>
          </div>
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
              selected ? 'border-primary bg-primary' : 'border-border',
            )}
          >
            {selected && (
              <div className='w-2 h-2 rounded-full bg-primary-foreground' />
            )}
          </div>
        </div>
      </div>

      {/* Couple price row */}
      {packageIsCouple && departure.effectiveCouplePrice && (
        <div className='mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs'>
          <span className='text-muted-foreground'>Couple price</span>
          <div className='flex items-center gap-2'>
            {departure.effectiveOriginalCouplePrice &&
              departure.effectiveOriginalCouplePrice !==
                departure.effectiveCouplePrice && (
                <span className='text-muted-foreground line-through'>
                  ৳{departure.effectiveOriginalCouplePrice.toLocaleString()}
                </span>
              )}
            <span className='font-bold text-primary'>
              ৳{departure.effectiveCouplePrice.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Departure picker ─────────────────────────────────────────────────────────

function DeparturePicker({
  departures,
  selectedId,
  onSelect,
  error,
  packageIsCouple,
}: {
  departures: Departure[];
  selectedId: string | undefined;
  onSelect: (d: Departure) => void;
  error?: string;
  packageIsCouple: boolean;
}) {
  const departureDates = useMemo(
    () => departures.map((d) => new Date(d.startDate)),
    [departures],
  );

  const [calendarMonth, setCalendarMonth] = useState<Date>(
    departureDates[0] ?? new Date(),
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Departures matching the selected calendar date
  const matchingDepartures = useMemo(() => {
    if (!selectedDate) return [];
    return departures.filter((d) =>
      isSameDay(new Date(d.startDate), selectedDate),
    );
  }, [departures, selectedDate]);

  if (departures.length === 0) {
    return (
      <div className='flex items-center gap-3 p-5 rounded-xl border-2 border-dashed text-muted-foreground'>
        <AlertCircle className='w-5 h-5 shrink-0' />
        <div>
          <p className='text-sm font-semibold'>No upcoming departures</p>
          <p className='text-xs mt-0.5'>
            Check back soon — new dates are added regularly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      {/* Step 1 — Calendar */}
      <div
        className={cn(
          'rounded-xl border-2 overflow-hidden w-fit transition-colors',
          error
            ? 'border-destructive'
            : 'border-border hover:border-primary/30',
        )}
      >
        <Calendar
          mode='single'
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          selected={selectedDate}
          onSelect={(d) => {
            if (!d) return;
            const hasDep = departureDates.some((dep) => isSameDay(dep, d));
            if (!hasDep) return;
            // Toggle off if clicking the already-selected date
            setSelectedDate((prev) =>
              prev && isSameDay(prev, d) ? undefined : d,
            );
          }}
          disabled={(d) => !departureDates.some((dep) => isSameDay(dep, d))}
          modifiers={{ departure: departureDates }}
          modifiersClassNames={{
            departure: [
              'font-bold text-primary relative',
              'after:absolute after:bottom-0.5 after:left-1/2',
              'after:-translate-x-1/2 after:w-1.5 after:h-1.5',
              'after:rounded-full after:bg-primary',
            ].join(' '),
          }}
          className='p-4'
        />
      </div>

      {/* Hint — only shown when no date is selected */}
      {!selectedDate && (
        <p className='text-xs text-muted-foreground flex items-center gap-1.5'>
          <CalendarDays className='w-3.5 h-3.5 text-primary shrink-0' />
          Select a highlighted date to see available departures
        </p>
      )}

      {/* Step 2 — Slots for selected date */}
      {selectedDate && matchingDepartures.length > 0 && (
        <div className='space-y-3 animate-in fade-in slide-in-from-top-2 duration-300'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-semibold text-muted-foreground'>
              {matchingDepartures.length} departure
              {matchingDepartures.length > 1 ? 's' : ''} on{' '}
              {format(selectedDate, 'dd MMM yyyy')}
            </p>
            <button
              type='button'
              onClick={() => setSelectedDate(undefined)}
              className='text-xs text-primary underline underline-offset-2 hover:text-primary/80'
            >
              Change date
            </button>
          </div>

          {matchingDepartures.map((d) => (
            <DepartureSlot
              key={d.id}
              departure={d}
              selected={selectedId === d.id}
              onSelect={() => onSelect(d)}
              packageIsCouple={packageIsCouple}
            />
          ))}
        </div>
      )}

      {error && (
        <p className='text-xs text-destructive flex items-center gap-1.5'>
          <AlertCircle className='w-3.5 h-3.5' />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Group composition ────────────────────────────────────────────────────────

function GroupCompositionSection({
  group,
  maxGroupSize,
  availableSeats,
  onChangeGroup,
  onResizeMembers,
}: {
  group: BookingFormValues['group'];
  maxGroupSize: number;
  availableSeats: number;
  onChangeGroup: (key: TierKey, value: number) => void;
  onResizeMembers: (newCount: number) => void;
}) {
  const totalPax = (Object.keys(TIERS) as TierKey[]).reduce(
    (s, k) => s + group[k],
    0,
  );
  const effectiveMax = Math.min(maxGroupSize, availableSeats);

  const handleChange = (key: TierKey, value: number) => {
    onChangeGroup(key, value);
    if (key === 'adult' || key === 'preteen') {
      const otherKey = key === 'adult' ? 'preteen' : 'adult';
      onResizeMembers(value + group[otherKey]);
    }
  };

  return (
    <div className='space-y-1'>
      {(Object.keys(TIERS) as TierKey[]).map((key) => {
        const { label, sublabel } = TIERS[key];
        const Icon = TIER_ICONS[key];
        const remaining = effectiveMax - (totalPax - group[key]);
        return (
          <div
            key={key}
            className='flex items-center justify-between py-3 border-b border-border last:border-0'
          >
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                <Icon className='w-4 h-4 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>{label}</p>
                <p className='text-xs text-muted-foreground'>{sublabel}</p>
              </div>
            </div>
            <Stepper
              value={group[key]}
              min={key === 'adult' ? 1 : 0}
              max={remaining}
              onChange={(v) => handleChange(key, v)}
            />
          </div>
        );
      })}
      <div className='flex items-center justify-between pt-2 text-xs text-muted-foreground'>
        <span>
          Total:{' '}
          <span className='font-semibold text-foreground'>{totalPax}</span>
          {' · '}Max: {effectiveMax}
        </span>
        <span className='flex items-center gap-1'>
          <Users className='w-3 h-3' />
          {availableSeats} seats on this departure
        </span>
      </div>
    </div>
  );
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────

function ConfirmBookingDialog({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  values,
  packageName,
  packageLocation,
  selectedDeparture,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  values: BookingFormValues;
  packageName: string;
  packageLocation: string;
  selectedDeparture: Departure;
}) {
  const { subtotal, vat, total } = calcPricing(
    selectedDeparture.effectivePricePerPerson,
    values.group,
  );
  const lead = values.members[0];
  const totalPax = (Object.keys(TIERS) as TierKey[]).reduce(
    (s, k) => s + values.group[k],
    0,
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-display text-xl'>
            Confirm your booking
          </DialogTitle>
          <DialogDescription>
            Please review the details below before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          {/* Package info */}
          <div className='rounded-xl bg-muted/40 p-4 space-y-2'>
            <p className='font-semibold text-sm'>{packageName}</p>
            <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
              <MapPin className='w-3 h-3' />
              <span>{packageLocation}</span>
            </div>
            <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
              <CalendarDays className='w-3 h-3' />
              <span>
                {format(new Date(selectedDeparture.startDate), 'dd MMM yyyy')}
                {' → '}
                {format(new Date(selectedDeparture.endDate), 'dd MMM yyyy')}
              </span>
            </div>
            {selectedDeparture.note && (
              <p className='text-xs italic text-muted-foreground'>
                "{selectedDeparture.note}"
              </p>
            )}
          </div>

          {/* Group summary */}
          <div className='space-y-1.5'>
            <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
              Group
            </p>
            <div className='flex flex-wrap gap-2'>
              {(Object.keys(TIERS) as TierKey[]).map((key) => {
                const count = values.group[key];
                if (count === 0) return null;
                const Icon = TIER_ICONS[key];
                return (
                  <span
                    key={key}
                    className='inline-flex items-center gap-1.5 text-xs bg-primary/8 text-primary px-2.5 py-1 rounded-full'
                  >
                    <Icon className='w-3 h-3' />
                    {TIERS[key].label} × {count}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Lead traveller */}
          <div className='space-y-1'>
            <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
              Lead Traveller
            </p>
            <p className='text-sm font-medium'>{lead?.fullName}</p>
            <p className='text-xs text-muted-foreground'>{lead?.email}</p>
            <p className='text-xs text-muted-foreground'>{lead?.phone}</p>
          </div>

          <Separator />

          {/* Pricing */}
          <div className='space-y-1.5 text-sm'>
            <div className='flex justify-between text-muted-foreground'>
              <span>Subtotal ({totalPax} travellers)</span>
              <span>৳{Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div className='flex justify-between text-muted-foreground'>
              <span>VAT (15%)</span>
              <span>৳{Math.round(vat).toLocaleString()}</span>
            </div>
            <Separator />
            <div className='flex justify-between font-bold text-base'>
              <span>Total</span>
              <span className='text-primary'>
                ৳{Math.round(total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={onClose} disabled={isSubmitting}>
            Go back
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting} className='gap-2'>
            {isSubmitting ? (
              'Confirming…'
            ) : (
              <>
                <CheckCircle2 className='w-4 h-4' />
                Confirm Booking
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookNowPage({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = use(params);
  const {
    data: pkg,
    isPending,
    isError,
  } = useSinglePackagesWithDepartures(packageId);
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<BookingFormValues | null>(
    null,
  );
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(
    null,
  );
  const { mutateAsync, isPending: isConfirming } = useBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      departureId: '',
      group: { adult: 1, preteen: 0, child: 0, infant: 0 },
      members: [emptyMember('adult')],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  });

  // ✅ Must be before any early returns
  useEffect(() => {
    if (!isPending && !isSessionPending && !session) {
      router.push(`/sign-in?callbackUrl=/book/${packageId}`);
    }
  }, [isPending, isSessionPending, session, router, packageId]);

  const group = form.watch('group');
  const departureIdError = form.formState.errors.departureId;

  const handleGroupChange = (key: TierKey, value: number) => {
    form.setValue(`group.${key}`, value, { shouldValidate: true });
  };

  const handleResizeMembers = (newCount: number) => {
    const current = fields.length;
    if (newCount > current) {
      for (let i = current; i < newCount; i++) {
        append(emptyMember(i < group.adult ? 'adult' : 'preteen'));
      }
    } else if (newCount < current) {
      for (let i = current - 1; i >= newCount; i--) remove(i);
    }
  };

  const handleSelectDeparture = (d: Departure) => {
    setSelectedDeparture(d);
    form.setValue('departureId', d.id, { shouldValidate: true });
    // Reset group if it exceeds this departure's available seats
    const totalPax = Object.values(group).reduce((s, v) => s + v, 0);
    if (totalPax > d.availableSeats) {
      form.setValue('group', { adult: 1, preteen: 0, child: 0, infant: 0 });
      handleResizeMembers(1);
    }
  };

  const handleFormSubmit = (values: BookingFormValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues || !selectedDeparture) return;
    const formData = new FormData();
    formData.append('departureId', selectedDeparture.id);
    formData.append('slug', packageId);
    formData.append('group', JSON.stringify(pendingValues.group));
    formData.append('members', JSON.stringify(pendingValues.members));
    if (pendingValues.notes) formData.append('notes', pendingValues.notes);
    try {
      await mutateAsync(formData);
      setConfirmOpen(false);
      setSubmitted(true);
    } catch {
      // error handled in useBooking
    }
  };

  // ✅ Early returns AFTER all hooks
  if (isPending || isSessionPending || !session) return <LoadingSkeleton />;
  if (isError || !pkg) return <ErrorState />;
  if (submitted) {
    return (
      <SuccessState
        name={form.getValues('members.0.fullName')}
        packageName={pkg.name}
      />
    );
  }

  const departures: Departure[] = Array.isArray(pkg.departures)
    ? pkg.departures
    : [];

  return (
    <div className='min-h-screen bg-background'>
      {/* Confirm dialog */}
      {pendingValues && selectedDeparture && (
        <ConfirmBookingDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          isSubmitting={isConfirming}
          values={pendingValues}
          packageName={pkg.name}
          packageLocation={pkg.location}
          selectedDeparture={selectedDeparture}
        />
      )}

      {/* Header */}
      <section className='relative pt-12 pb-8 bg-primary/5 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Book Now
            </span>
          </div>
          <h1 className='font-display text-3xl sm:text-4xl font-bold leading-tight'>
            Reserve your{' '}
            <span className='italic font-light text-muted-foreground'>
              spot
            </span>
            <span className='text-primary'>.</span>
          </h1>
          <p className='text-sm text-muted-foreground mt-2'>{pkg.name}</p>
        </div>
      </section>

      {/* Content */}
      <section className='py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className='grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start'>
              {/* Left: sticky pricing summary */}
              <div className='lg:sticky lg:top-8'>
                <Card className='border-2 p-6'>
                  <CardContent className='p-0'>
                    {/* Selected departure snapshot */}
                    {selectedDeparture && (
                      <div className='mb-5 pb-5 border-b border-border'>
                        <p className='text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-2'>
                          Selected Departure
                        </p>
                        <p className='text-sm font-semibold'>
                          {format(
                            new Date(selectedDeparture.startDate),
                            'dd MMM',
                          )}
                          {' → '}
                          {format(
                            new Date(selectedDeparture.endDate),
                            'dd MMM yyyy',
                          )}
                        </p>
                        <div className='flex items-center gap-3 mt-1.5 text-xs text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <Users className='w-3 h-3' />
                            {selectedDeparture.availableSeats} seats left
                          </span>
                          {selectedDeparture.isGuaranteed && (
                            <span className='flex items-center gap-1 text-emerald-600'>
                              <ShieldCheck className='w-3 h-3' />
                              Guaranteed
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <PricingSummary
                      pkg={pkg}
                      group={group}
                      travelDate={
                        selectedDeparture
                          ? new Date(selectedDeparture.startDate)
                          : undefined
                      }
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right: form */}
              <div className='space-y-10'>
                {/* Departure selection */}
                <FieldSet>
                  <FieldLegend className='sr-only'>
                    Select Departure
                  </FieldLegend>
                  <SectionLabel>Select Departure</SectionLabel>
                  <Field data-invalid={!!departureIdError}>
                    <DeparturePicker
                      departures={departures}
                      selectedId={selectedDeparture?.id}
                      onSelect={handleSelectDeparture}
                      error={departureIdError?.message}
                      packageIsCouple={pkg.isCouple}
                    />
                  </Field>
                </FieldSet>

                {/* Group composition */}
                <FieldSet>
                  <FieldLegend className='sr-only'>
                    Group Composition
                  </FieldLegend>
                  <SectionLabel>Group Composition</SectionLabel>
                  <GroupCompositionSection
                    group={group}
                    maxGroupSize={pkg.maxGroupSize}
                    availableSeats={
                      selectedDeparture?.availableSeats ?? pkg.maxGroupSize
                    }
                    onChangeGroup={handleGroupChange}
                    onResizeMembers={handleResizeMembers}
                  />
                  {form.formState.errors.group?.adult && (
                    <FieldError errors={[form.formState.errors.group.adult]} />
                  )}
                </FieldSet>

                {/* Traveller details */}
                {fields.length > 0 && (
                  <FieldSet>
                    <FieldLegend className='sr-only'>
                      Traveller Details
                    </FieldLegend>
                    <SectionLabel>Traveller Details</SectionLabel>
                    <p className='text-xs text-muted-foreground mb-4 -mt-2'>
                      Required for adults and pre-teens (11–14). Names must
                      match your ID or passport.
                    </p>
                    <div className='space-y-3'>
                      {fields.map((field, i) => (
                        <MemberCard
                          key={field.id}
                          index={i}
                          tierLabel={
                            i < group.adult ? 'Adult (15+)' : 'Pre-teen (11–14)'
                          }
                          form={form}
                        />
                      ))}
                    </div>
                  </FieldSet>
                )}

                {/* Notes */}
                <FieldSet>
                  <FieldLegend className='sr-only'>
                    Additional Notes
                  </FieldLegend>
                  <SectionLabel>Additional Notes</SectionLabel>
                  <Field>
                    <FieldLabel htmlFor='notes'>Special Requests</FieldLabel>
                    <Textarea
                      id='notes'
                      placeholder='Dietary requirements, accessibility needs, anything else we should know...'
                      className='min-h-24 resize-none'
                      {...form.register('notes')}
                    />
                  </Field>
                </FieldSet>

                {/* Trust badges */}
                <div className='flex flex-wrap gap-5'>
                  {[
                    { icon: Shield, label: 'Secure booking' },
                    { icon: CheckCircle2, label: 'Free cancellation' },
                    { icon: Star, label: 'Verified operator' },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className='flex items-center gap-1.5 text-xs text-muted-foreground'
                    >
                      <Icon className='w-3.5 h-3.5 text-primary' />
                      {label}
                    </div>
                  ))}
                </div>

                <Button
                  type='submit'
                  size='lg'
                  className='w-full h-12 text-base font-semibold'
                  disabled={form.formState.isSubmitting || !selectedDeparture}
                >
                  Review & Confirm Booking
                </Button>

                <p className='text-xs text-center text-muted-foreground -mt-4'>
                  By booking you agree to our terms and privacy policy. We'll
                  confirm within 24 hours.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
