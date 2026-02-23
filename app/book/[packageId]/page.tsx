'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  Shield,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { TIERS } from '@/constants/vat-rate';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useBooking } from '@/services/booking';
import { useSinglePackages } from '@/services/packages';
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

// ─── Group Composition ────────────────────────────────────────────────────────
function GroupCompositionSection({
  group,
  maxGroupSize,
  onChangeGroup,
  onResizeMembers,
}: {
  group: BookingFormValues['group'];
  maxGroupSize: number;
  onChangeGroup: (key: TierKey, value: number) => void;
  onResizeMembers: (newCount: number) => void;
}) {
  const totalPax = (Object.keys(TIERS) as TierKey[]).reduce(
    (s, k) => s + group[k],
    0,
  );

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
              max={maxGroupSize - (totalPax - group[key])}
              onChange={(v) => handleChange(key, v)}
            />
          </div>
        );
      })}
      <p className='text-xs text-muted-foreground pt-2'>
        Total: <span className='font-semibold text-foreground'>{totalPax}</span>{' '}
        · Max: {maxGroupSize}
      </p>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmBookingDialog({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  values,
  packageName,
  packageLocation,
  pricePerPerson,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  values: BookingFormValues;
  packageName: string;
  packageLocation: string;
  pricePerPerson: number;
}) {
  const { subtotal, vat, total } = calcPricing(pricePerPerson, values.group);
  const leadTraveller = values.members[0];
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
            {values.travelDate && (
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <CalendarIcon className='w-3 h-3' />
                <span>{format(values.travelDate, 'dd MMMM yyyy')}</span>
              </div>
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
            <p className='text-sm font-medium'>{leadTraveller?.fullName}</p>
            <p className='text-xs text-muted-foreground'>
              {leadTraveller?.email}
            </p>
            <p className='text-xs text-muted-foreground'>
              {leadTraveller?.phone}
            </p>
          </div>

          <Separator />

          {/* Pricing summary */}
          <div className='space-y-1.5 text-sm'>
            <div className='flex justify-between text-muted-foreground'>
              <span>Subtotal ({totalPax} travellers)</span>
              <span>৳{subtotal.toLocaleString()}</span>
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
  const { data: pkg, isPending, isError } = useSinglePackages(packageId);
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<BookingFormValues | null>(
    null,
  );
  const { mutateAsync, isPending: isConfirming } = useBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      travelDate: undefined,
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
  const travelDate = form.watch('travelDate');
  const travelDateError = form.formState.errors.travelDate;

  const handleGroupChange = (key: TierKey, value: number) => {
    form.setValue(`group.${key}`, value, { shouldValidate: true });
  };

  const handleResizeMembers = (newCount: number) => {
    const current = fields.length;
    if (newCount > current) {
      for (let i = current; i < newCount; i++) {
        const type = i < group.adult ? 'adult' : 'preteen';
        append(emptyMember(type));
      }
    } else if (newCount < current) {
      for (let i = current - 1; i >= newCount; i--) remove(i);
    }
  };

  const handleFormSubmit = (values: BookingFormValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;

    const formData = new FormData();
    formData.append('packageId', packageId);
    formData.append('travelDate', pendingValues.travelDate.toISOString());
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

  return (
    <div className='min-h-screen bg-background'>
      {/* Confirm dialog */}
      {pendingValues && (
        <ConfirmBookingDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          isSubmitting={isConfirming}
          values={pendingValues}
          packageName={pkg.name}
          packageLocation={pkg.Location}
          pricePerPerson={Number(pkg.pricePerPerson)}
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
        </div>
      </section>

      {/* Content */}
      <section className='py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className='grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start'>
              {/* Left: pricing summary */}
              <div className='lg:sticky lg:top-8'>
                <Card className='border-2 p-6'>
                  <CardContent className='p-0'>
                    <PricingSummary
                      pkg={pkg}
                      group={group}
                      travelDate={travelDate}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right: form */}
              <div className='space-y-10'>
                {/* Travel date */}
                <FieldSet>
                  <FieldLegend className='sr-only'>Travel Date</FieldLegend>
                  <SectionLabel>Travel Date</SectionLabel>
                  <Field data-invalid={!!travelDateError}>
                    <FieldLabel htmlFor='travelDate'>Departure Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id='travelDate'
                          variant='outline'
                          aria-invalid={!!travelDateError}
                          className={cn(
                            'w-full justify-start text-left font-normal h-11',
                            !travelDate && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {travelDate
                            ? format(travelDate, 'PPP')
                            : 'Pick a travel date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={travelDate}
                          onSelect={(date) =>
                            form.setValue('travelDate', date as Date, {
                              shouldValidate: true,
                            })
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError
                      errors={travelDateError ? [travelDateError] : undefined}
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
                  disabled={form.formState.isSubmitting}
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
