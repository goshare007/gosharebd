'use client';

import { format } from 'date-fns';
import {
  AlertCircle,
  Baby,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Shield,
  Star,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useSinglePackages } from '@/services/packages';
import type { SinglePackageType } from '@/types/package';

// ─── Constants ────────────────────────────────────────────────────────────────
const VAT_RATE = 0.15;

const TIERS = {
  adult: {
    label: 'Adults',
    sublabel: '15+ years',
    multiplier: 1,
    needsDetails: true,
  },
  senior: {
    label: 'Pre-teen',
    sublabel: '11–14 years · 75%',
    multiplier: 0.75,
    needsDetails: true,
  },
  child: {
    label: 'Children',
    sublabel: '6–10 years · 50%',
    multiplier: 0.5,
    needsDetails: false,
  },
  infant: {
    label: 'Under 5',
    sublabel: '0–5 years · Free',
    multiplier: 0,
    needsDetails: false,
  },
} as const;

type TierKey = keyof typeof TIERS;

const TIER_ICONS: Record<TierKey, React.ElementType> = {
  adult: User,
  senior: User,
  child: Users,
  infant: Baby,
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Gender = 'male' | 'female' | 'other' | '';

type GroupMember = {
  fullName: string;
  gender: Gender;
  idNumber: string;
  email: string;
  phone: string;
};

type GroupComposition = Record<TierKey, number>;

type BookingForm = {
  travelDate: Date | undefined;
  group: GroupComposition;
  members: GroupMember[];
  notes: string;
};

const emptyMember = (): GroupMember => ({
  fullName: '',
  gender: '',
  idNumber: '',
  email: '',
  phone: '',
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcPricing(pkg: SinglePackageType, group: GroupComposition) {
  const base = Number(pkg.pricePerPerson);
  const breakdown = (Object.keys(TIERS) as TierKey[]).map((key) => ({
    key,
    count: group[key],
    total: base * TIERS[key].multiplier * group[key],
    multiplier: TIERS[key].multiplier,
    label: TIERS[key].label,
  }));
  const subtotal = breakdown.reduce((s, r) => s + r.total, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  const paxCount = (Object.keys(TIERS) as TierKey[]).reduce(
    (s, k) => s + group[k],
    0,
  );
  return { breakdown, subtotal, vat, total, paxCount };
}

function buildMembers(
  group: GroupComposition,
  existing: GroupMember[],
): GroupMember[] {
  const count = group.adult + group.senior;
  return Array.from({ length: count }, (_, i) => existing[i] ?? emptyMember());
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header skeleton — mirrors real header */}
      <section className='relative pt-12 pb-8 bg-primary/5 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3 mb-3'>
            <Skeleton className='h-px w-10' />
            <Skeleton className='h-3 w-20' />
          </div>
          <Skeleton className='h-10 w-64' />
        </div>
      </section>

      <section className='py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start'>
            {/* Left: pricing summary skeleton */}
            <div className='space-y-6'>
              <Skeleton className='h-52 w-full rounded-2xl' />
              <div className='grid grid-cols-3 gap-2'>
                {Array.from({ length: 3 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <Skeleton key={i} className='h-16 rounded-xl' />
                ))}
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-3 w-24' />
                {Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <Skeleton key={i} className='h-3 w-full' />
                ))}
              </div>
              <Separator />
              <div className='space-y-2'>
                {Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <div key={i} className='flex justify-between'>
                    <Skeleton className='h-4 w-28' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form skeleton */}
            <div className='space-y-10'>
              {/* Travel date */}
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-px w-8' />
                  <Skeleton className='h-3 w-24' />
                </div>
                <Skeleton className='h-11 w-full rounded-md' />
              </div>

              {/* Group composition */}
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-px w-8' />
                  <Skeleton className='h-3 w-36' />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                    key={i}
                    className='flex items-center justify-between py-3 border-b border-border last:border-0'
                  >
                    <div className='flex items-center gap-3'>
                      <Skeleton className='h-8 w-8 rounded-full' />
                      <div className='space-y-1.5'>
                        <Skeleton className='h-3.5 w-20' />
                        <Skeleton className='h-3 w-28' />
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-8 w-8 rounded-full' />
                      <Skeleton className='h-4 w-4' />
                      <Skeleton className='h-8 w-8 rounded-full' />
                    </div>
                  </div>
                ))}
              </div>

              {/* Traveller details */}
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-px w-8' />
                  <Skeleton className='h-3 w-32' />
                </div>
                <Skeleton className='h-14 w-full rounded-xl' />
              </div>

              {/* Submit button */}
              <Skeleton className='h-12 w-full rounded-md' />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Keep the real header so the page doesn't jump */}
      <section className='relative pt-12 pb-8 bg-primary/5 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
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

      <div className='py-32 flex items-center justify-center px-4'>
        <div className='text-center space-y-5 max-w-sm'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-destructive/10 p-5'>
              <AlertCircle className='w-8 h-8 text-destructive' />
            </div>
          </div>
          <div className='space-y-2'>
            <h2 className='font-display text-xl font-bold'>
              Package not found
            </h2>
            <p className='text-sm text-muted-foreground'>
              This package may no longer be available or the link may be
              incorrect.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-2 justify-center'>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
              onClick={() => window.location.reload()}
            >
              <RefreshCw className='w-3.5 h-3.5' />
              Try again
            </Button>
            <Button size='sm' asChild>
              <Link href='/packages'>Browse packages</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small shared components ──────────────────────────────────────────────────
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
  onChange,
  maxGroupSize,
}: {
  group: GroupComposition;
  onChange: (g: GroupComposition) => void;
  maxGroupSize: number;
}) {
  const totalPax = (Object.keys(TIERS) as TierKey[]).reduce(
    (s, k) => s + group[k],
    0,
  );

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
              onChange={(v) => onChange({ ...group, [key]: v })}
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

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({
  index,
  tierLabel,
  member,
  onChange,
}: {
  index: number;
  tierLabel: string;
  member: GroupMember;
  onChange: (m: GroupMember) => void;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className='border border-border rounded-xl overflow-hidden'>
      <button
        type='button'
        onClick={() => setOpen((p) => !p)}
        className='w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left'
      >
        <div className='flex items-center gap-2.5'>
          <div className='w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
            <User className='w-3.5 h-3.5 text-primary' />
          </div>
          <div>
            <p className='text-sm font-medium leading-tight'>
              {member.fullName || `Traveller ${index + 1}`}
            </p>
            <p className='text-xs text-muted-foreground'>{tierLabel}</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className='w-4 h-4 text-muted-foreground shrink-0' />
        ) : (
          <ChevronDown className='w-4 h-4 text-muted-foreground shrink-0' />
        )}
      </button>

      {open && (
        <div className='p-4 space-y-3'>
          <div className='space-y-1.5'>
            <Label>Full Name</Label>
            <Input
              placeholder='As on National ID / Passport'
              value={member.fullName}
              onChange={(e) =>
                onChange({ ...member, fullName: e.target.value })
              }
            />
          </div>
          <div className='grid sm:grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <Label>Gender</Label>
              <Select
                value={member.gender}
                onValueChange={(v) =>
                  onChange({ ...member, gender: v as Gender })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='male'>Male</SelectItem>
                  <SelectItem value='female'>Female</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1.5'>
              <Label>National ID / Passport No.</Label>
              <Input
                placeholder='e.g. 1234567890123'
                value={member.idNumber}
                onChange={(e) =>
                  onChange({ ...member, idNumber: e.target.value })
                }
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Email Address</Label>
              <Input
                type='email'
                placeholder='you@example.com'
                value={member.email}
                onChange={(e) => onChange({ ...member, email: e.target.value })}
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Phone Number</Label>
              <Input
                placeholder='+880 1XXX-XXXXXX'
                value={member.phone}
                onChange={(e) => onChange({ ...member, phone: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pricing Summary ──────────────────────────────────────────────────────────
function PricingSummary({
  pkg,
  group,
  travelDate,
}: {
  pkg: SinglePackageType;
  group: GroupComposition;
  travelDate: Date | undefined;
}) {
  const { breakdown, subtotal, vat, total, paxCount } = calcPricing(pkg, group);

  return (
    <div className='space-y-6'>
      <div className='relative h-52 rounded-2xl overflow-hidden'>
        <Image
          src={pkg.coverImage}
          alt={pkg.name}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/70 to-transparent' />
        {pkg.isBestseller && (
          <div className='absolute top-3 left-3'>
            <Badge className='bg-primary text-primary-foreground text-xs font-semibold'>
              Bestseller
            </Badge>
          </div>
        )}
        <div className='absolute bottom-4 left-4 right-4 text-white'>
          <h2 className='font-display text-lg font-bold leading-tight'>
            {pkg.name}
          </h2>
          <div className='flex items-center gap-1.5 mt-1 text-xs text-white/80'>
            <MapPin className='w-3 h-3' />
            <span>{pkg.Location}</span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        {[
          { icon: Clock, label: 'Duration', value: `${pkg.durationDays}d` },
          { icon: Users, label: 'Travellers', value: `${paxCount} pax` },
          { icon: Shield, label: 'Status', value: 'Verified' },
          ...(pkg.averageRating
            ? [
                {
                  icon: Star,
                  label: 'Rating',
                  value: `${pkg.averageRating} (${pkg.reviewCount})`,
                },
              ]
            : []),
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className='bg-primary/5 rounded-xl p-3 text-center'>
            <Icon className='w-3.5 h-3.5 text-primary mx-auto mb-1' />
            <p className='text-xs text-muted-foreground'>{label}</p>
            <p className='text-xs font-semibold'>{value}</p>
          </div>
        ))}
      </div>

      {pkg.highlights?.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
            Highlights
          </p>
          <ul className='space-y-1.5'>
            {pkg.highlights.slice(0, 4).map((h, i) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: static
                key={i}
                className='flex items-start gap-2 text-xs text-muted-foreground'
              >
                <CheckCircle2 className='w-3 h-3 text-primary shrink-0 mt-0.5' />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator />

      <div className='space-y-2 text-sm'>
        {breakdown.map(
          ({ key, count, total: lineTotal, multiplier, label }) => {
            if (count === 0) return null;
            return (
              <div
                key={key}
                className='flex justify-between text-muted-foreground'
              >
                <span>
                  {label} × {count}
                  {multiplier > 0 && multiplier < 1 && (
                    <span className='text-xs ml-1'>({multiplier * 100}%)</span>
                  )}
                  {multiplier === 0 && (
                    <span className='text-xs ml-1'>(free)</span>
                  )}
                </span>
                {multiplier === 0 ? (
                  <span className='text-green-600 font-medium'>৳0</span>
                ) : (
                  <span>৳{lineTotal.toLocaleString()}</span>
                )}
              </div>
            );
          },
        )}

        {travelDate && (
          <div className='flex justify-between text-muted-foreground'>
            <span>Travel date</span>
            <span>{format(travelDate, 'dd MMM yyyy')}</span>
          </div>
        )}

        <Separator />

        <div className='flex justify-between text-muted-foreground'>
          <span>Subtotal</span>
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
        <p className='text-xs text-muted-foreground'>
          * Final price confirmed after review
        </p>
      </div>
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────
function SuccessState({
  name,
  packageName,
}: {
  name: string;
  packageName: string;
}) {
  return (
    <div className='min-h-[60vh] flex items-center justify-center px-4'>
      <div className='text-center space-y-5 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className='flex justify-center'>
          <div className='rounded-full bg-primary/10 p-5'>
            <CheckCircle2 className='w-10 h-10 text-primary' />
          </div>
        </div>
        <div className='space-y-2'>
          <h2 className='font-display text-2xl font-bold'>
            Booking Request Sent!
          </h2>
          <p className='text-muted-foreground text-sm'>
            Thanks <span className='font-medium text-foreground'>{name}</span>!
            We've received your request for{' '}
            <span className='font-medium text-foreground'>{packageName}</span>{' '}
            and will confirm within 24 hours via email.
          </p>
        </div>
        <Button asChild variant='outline'>
          <Link href='/packages'>Browse more packages</Link>
        </Button>
      </div>
    </div>
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

  const [form, setForm] = useState<BookingForm>({
    travelDate: undefined,
    group: { adult: 1, senior: 0, child: 0, infant: 0 },
    members: [emptyMember()],
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleGroupChange = (group: GroupComposition) => {
    setForm((prev) => ({
      ...prev,
      group,
      members: buildMembers(group, prev.members),
    }));
  };

  const handleMemberChange = (index: number, member: GroupMember) => {
    setForm((prev) => {
      const members = [...prev.members];
      members[index] = member;
      return { ...prev, members };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 1400));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const canSubmit =
    !!form.travelDate &&
    form.members.length > 0 &&
    form.members.every((m) => m.fullName && m.email && m.phone);

  if (isPending) return <LoadingSkeleton />;
  if (isError || !pkg) return <ErrorState />;

  if (submitted) {
    return (
      <SuccessState
        name={form.members[0]?.fullName ?? ''}
        packageName={pkg.name}
      />
    );
  }

  return (
    <div className='min-h-screen bg-background'>
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
          <div className='grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start'>
            {/* Left: pricing summary */}
            <div className='lg:sticky lg:top-8'>
              <Card className='border-2 p-6'>
                <CardContent className='p-0'>
                  <PricingSummary
                    pkg={pkg}
                    group={form.group}
                    travelDate={form.travelDate}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right: form */}
            <div className='space-y-10'>
              {/* Travel date */}
              <div>
                <SectionLabel>Travel Date</SectionLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal h-11',
                        !form.travelDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {form.travelDate
                        ? format(form.travelDate, 'PPP')
                        : 'Pick a travel date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={form.travelDate}
                      onSelect={(date) =>
                        setForm((p) => ({ ...p, travelDate: date }))
                      }
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Group composition */}
              <div>
                <SectionLabel>Group Composition</SectionLabel>
                <GroupCompositionSection
                  group={form.group}
                  onChange={handleGroupChange}
                  maxGroupSize={pkg.maxGroupSize}
                />
              </div>

              {/* Traveller details */}
              <div>
                <SectionLabel>Traveller Details</SectionLabel>
                <p className='text-xs text-muted-foreground mb-4 -mt-2'>
                  Required for adults and pre-teens (11–14). Names must match
                  your ID or passport.
                </p>
                <div className='space-y-3'>
                  {form.members.map((member, i) => (
                    <MemberCard
                      // biome-ignore lint/suspicious/noArrayIndexKey: dynamic list keyed by index
                      key={i}
                      index={i}
                      tierLabel={
                        i < form.group.adult
                          ? 'Adult (15+)'
                          : 'Pre-teen (11–14)'
                      }
                      member={member}
                      onChange={(m) => handleMemberChange(i, m)}
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <SectionLabel>Additional Notes</SectionLabel>
                <Textarea
                  placeholder='Dietary requirements, accessibility needs, anything else we should know...'
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  className='min-h-24 resize-none'
                />
              </div>

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
                size='lg'
                className='w-full h-12 text-base font-semibold'
                onClick={handleSubmit}
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? 'Submitting…' : 'Confirm Booking Request'}
              </Button>

              <p className='text-xs text-center text-muted-foreground -mt-4'>
                By booking you agree to our terms and privacy policy. We'll
                confirm within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
