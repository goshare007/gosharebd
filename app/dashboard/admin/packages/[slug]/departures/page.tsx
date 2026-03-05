'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import {
  ArrowLeft,
  BadgeInfo,
  Ban,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Repeat2,
  Save,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  type Departure,
  type DepartureStatus,
  useCreateDeparture,
  useDeleteDeparture,
  useDepartures,
  useUpdateDeparture,
} from '@/services/departure';

// ─── constants ────────────────────────────────────────────────────────────────

const WEEKDAYS = [
  { label: 'Su', value: 0 },
  { label: 'Mo', value: 1 },
  { label: 'Tu', value: 2 },
  { label: 'We', value: 3 },
  { label: 'Th', value: 4 },
  { label: 'Fr', value: 5 },
  { label: 'Sa', value: 6 },
];

const STATUS_CONFIG: Record<
  DepartureStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    icon: CheckCircle2,
  },
  FULL: {
    label: 'Full',
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    icon: Users,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
    icon: XCircle,
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    icon: Clock,
  },
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d: string | Date) {
  return format(new Date(d), 'dd MMM yyyy');
}

function seatsLeft(d: Departure) {
  return d.totalSeats - d.bookedSeats;
}

function seatsPercent(d: Departure) {
  return Math.round((d.bookedSeats / d.totalSeats) * 100);
}

const today = startOfDay(new Date());

// ─── zod schemas ──────────────────────────────────────────────────────────────

const singleSchema = z.object({
  startDate: z.date('Pick a start date'),
  startTime: z.string().min(1, 'Time is required'),
  totalSeats: z.number().int().min(1, 'At least 1 seat'),
  isGuaranteed: z.boolean(),
  note: z.string().optional(),
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
});

const bulkSchema = z.object({
  recurringDays: z.array(z.number()).min(1, 'Select at least one day'),
  rangeStart: z.date('Pick a start date'),
  rangeEnd: z.date('Pick an end date'),
  startTime: z.string().min(1, 'Time is required'),
  totalSeats: z.number().int().min(1, 'At least 1 seat'),
  isGuaranteed: z.boolean(),
  note: z.string().optional(),
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
});

const editSchema = z.object({
  startDate: z.date('Pick a date'),
  startTime: z.string().min(1),
  totalSeats: z.number().int().min(1),
  status: z.enum(['ACTIVE', 'FULL', 'CANCELLED', 'COMPLETED']),
  isGuaranteed: z.boolean(),
  note: z.string().optional().nullable(),
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
});

type SingleFormData = z.infer<typeof singleSchema>;
type BulkFormData = z.infer<typeof bulkSchema>;
type EditFormData = z.infer<typeof editSchema>;

// ─── date picker ──────────────────────────────────────────────────────────────

function DatePickerField({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  error,
}: {
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className='space-y-1.5'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-full h-9 justify-start text-sm font-normal border-2',
              !value && 'text-muted-foreground',
              error && 'border-destructive',
            )}
          >
            <CalendarDays className='w-3.5 h-3.5 mr-2 shrink-0 text-primary' />
            {value ? format(value, 'dd MMM yyyy') : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
}

function DateRangePickerFields({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startError,
  endError,
}: {
  startValue: Date | undefined;
  endValue: Date | undefined;
  onStartChange: (d: Date | undefined) => void;
  onEndChange: (d: Date | undefined) => void;
  startError?: string;
  endError?: string;
}) {
  return (
    <div className='space-y-3'>
      {/* inline range calendar */}
      <div className='rounded-xl border-2 overflow-hidden'>
        <Calendar
          mode='range'
          selected={{
            from: startValue,
            to: endValue,
          }}
          onSelect={(range) => {
            onStartChange(range?.from);
            onEndChange(range?.to);
          }}
          disabled={(d) => isBefore(d, today)}
          numberOfMonths={1}
          className='w-full'
        />
      </div>

      {/* text summary */}
      <div className='grid grid-cols-2 gap-2'>
        <div
          className={cn(
            'rounded-lg border-2 px-3 py-2 text-xs',
            startValue ? 'border-primary/40 bg-primary/5' : 'border-dashed',
            startError && 'border-destructive',
          )}
        >
          <p className='text-muted-foreground mb-0.5 uppercase tracking-wide text-[10px] font-semibold'>
            From
          </p>
          <p className='font-semibold'>
            {startValue ? format(startValue, 'dd MMM yyyy') : '—'}
          </p>
          {startError && (
            <p className='text-destructive text-[10px] mt-0.5'>{startError}</p>
          )}
        </div>
        <div
          className={cn(
            'rounded-lg border-2 px-3 py-2 text-xs',
            endValue ? 'border-primary/40 bg-primary/5' : 'border-dashed',
            endError && 'border-destructive',
          )}
        >
          <p className='text-muted-foreground mb-0.5 uppercase tracking-wide text-[10px] font-semibold'>
            To
          </p>
          <p className='font-semibold'>
            {endValue ? format(endValue, 'dd MMM yyyy') : '—'}
          </p>
          {endError && (
            <p className='text-destructive text-[10px] mt-0.5'>{endError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── reusable sub-components ──────────────────────────────────────────────────

function StatusBadge({ status }: { status: DepartureStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge
      variant='outline'
      className={cn(
        'text-xs font-semibold gap-1.5 tracking-wide',
        cfg.className,
      )}
    >
      <Icon className='w-3 h-3' />
      {cfg.label}
    </Badge>
  );
}

function SeatBar({ departure }: { departure: Departure }) {
  const pct = seatsPercent(departure);
  const left = seatsLeft(departure);
  const barColor =
    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-primary';

  return (
    <div className='space-y-1'>
      <div className='flex justify-between text-xs'>
        <span className='text-muted-foreground'>
          {departure.bookedSeats}/{departure.totalSeats} booked
        </span>
        <span
          className={cn(
            'font-semibold',
            left === 0
              ? 'text-red-500'
              : left <= 3
                ? 'text-amber-600'
                : 'text-emerald-600',
          )}
        >
          {left} left
        </span>
      </div>
      <div className='h-1.5 w-full bg-primary/10 rounded-full overflow-hidden'>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            barColor,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className='text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground'>
      {children}
    </Label>
  );
}

function PriceField({
  label,
  name,
  register,
  error,
}: {
  label: string;
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: register type
  register: any;
  error?: string;
}) {
  return (
    <div className='space-y-1.5'>
      <FieldLabel>{label}</FieldLabel>
      <Input
        type='number'
        min={0}
        step='0.01'
        placeholder='Override (optional)'
        className='h-9 text-sm border-2'
        {...register(name, {
          setValueAs: (v: string) =>
            v === '' || v === undefined ? null : Number(v) || null,
        })}
      />
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
}

// ─── single departure form ────────────────────────────────────────────────────

function SingleDepartureForm({
  slug,
  durationDays,
}: {
  slug: string;
  durationDays: number;
}) {
  const { mutate, isPending } = useCreateDeparture(slug);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<SingleFormData>({
    resolver: zodResolver(singleSchema),
    defaultValues: { isGuaranteed: false, totalSeats: 20, startTime: '08:00' },
  });

  const startDate = watch('startDate');

  const onSubmit = (data: SingleFormData) => {
    const [hours, minutes] = data.startTime.split(':').map(Number);
    const dt = new Date(data.startDate);
    dt.setHours(hours, minutes, 0, 0);

    mutate(
      {
        mode: 'single',
        startDate: dt.toISOString(),
        totalSeats: data.totalSeats,
        isGuaranteed: data.isGuaranteed,
        note: data.note || undefined,
        pricePerPerson: data.pricePerPerson ?? null,
        originalPrice: data.originalPrice ?? null,
      },
      {
        onSuccess: () => {
          toast.success('Departure created');
          reset();
        },
        onError: () => toast.error('Failed to create departure'),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Date picker */}
      <div className='space-y-1.5'>
        <FieldLabel>
          Start Date <span className='text-destructive'>*</span>
        </FieldLabel>
        <Controller
          control={control}
          name='startDate'
          render={({ field }) => (
            <DatePickerField
              value={field.value}
              onChange={field.onChange}
              placeholder='Pick departure date'
              disabled={(d) => isBefore(d, today)}
              error={errors.startDate?.message}
            />
          )}
        />
      </div>

      {/* Time + seats row */}
      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-1.5'>
          <FieldLabel>
            Departure Time <span className='text-destructive'>*</span>
          </FieldLabel>
          <Input
            type='time'
            className='h-9 text-sm border-2'
            {...register('startTime')}
          />
          {errors.startTime && (
            <p className='text-xs text-destructive'>
              {errors.startTime.message}
            </p>
          )}
        </div>
        <div className='space-y-1.5'>
          <FieldLabel>
            Total Seats <span className='text-destructive'>*</span>
          </FieldLabel>
          <Input
            type='number'
            min={1}
            className='h-9 text-sm border-2'
            {...register('totalSeats', { valueAsNumber: true })}
          />
          {errors.totalSeats && (
            <p className='text-xs text-destructive'>
              {errors.totalSeats.message}
            </p>
          )}
        </div>
      </div>

      {/* End date preview */}
      {startDate && (
        <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border-2 border-primary/20'>
          <CalendarRange className='w-3.5 h-3.5 text-primary shrink-0' />
          <p className='text-xs'>
            <span className='text-muted-foreground'>Ends on </span>
            <span className='font-semibold text-foreground'>
              {fmtDate(addDays(startDate, durationDays))}
            </span>
            <span className='text-muted-foreground ml-1'>
              ({durationDays}d)
            </span>
          </p>
        </div>
      )}

      {/* Note */}
      <div className='space-y-1.5'>
        <FieldLabel>Label / Note</FieldLabel>
        <Input
          placeholder='e.g., Eid Special, Monsoon Tour'
          className='h-9 text-sm border-2'
          {...register('note')}
        />
      </div>

      {/* Price overrides */}
      <div className='grid grid-cols-2 gap-3'>
        <PriceField
          label='Price / Person (BDT)'
          name='pricePerPerson'
          register={register}
          error={errors.pricePerPerson?.message}
        />
        <PriceField
          label='Original Price (BDT)'
          name='originalPrice'
          register={register}
          error={errors.originalPrice?.message}
        />
      </div>

      {/* Guaranteed toggle */}
      <div className='flex items-center justify-between px-3 py-2.5 rounded-xl border-2 bg-muted/30'>
        <div>
          <p className='text-sm font-semibold'>Guaranteed</p>
          <p className='text-xs text-muted-foreground'>
            Runs regardless of seat count
          </p>
        </div>
        <Controller
          control={control}
          name='isGuaranteed'
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <Button type='submit' className='w-full gap-2' disabled={isPending}>
        {isPending ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='w-4 h-4' />
        )}
        Add Departure
      </Button>
    </form>
  );
}

// ─── bulk generate form ───────────────────────────────────────────────────────

function BulkGenerateForm({
  slug,
  durationDays,
}: {
  slug: string;
  durationDays: number;
}) {
  const { mutate, isPending } = useCreateDeparture(slug);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BulkFormData>({
    resolver: zodResolver(bulkSchema),
    defaultValues: {
      isGuaranteed: false,
      totalSeats: 20,
      recurringDays: [],
      startTime: '08:00',
    },
  });

  const rangeStart = watch('rangeStart');
  const rangeEnd = watch('rangeEnd');

  const toggleDay = (day: number) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(next);
    setValue('recurringDays', next, { shouldValidate: true });
  };

  // Preview count
  const previewCount = (() => {
    if (!rangeStart || !rangeEnd || selectedDays.length === 0) return 0;
    let count = 0;
    const cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      if (selectedDays.includes(cursor.getDay())) count++;
      cursor.setDate(cursor.getDate() + 1);
    }
    return count;
  })();

  const onSubmit = (data: BulkFormData) => {
    const [hours, minutes] = data.startTime.split(':').map(Number);

    const rangeStartDt = new Date(data.rangeStart);
    rangeStartDt.setHours(hours, minutes, 0, 0);
    const rangeEndDt = new Date(data.rangeEnd);
    rangeEndDt.setHours(23, 59, 59, 999);

    mutate(
      {
        mode: 'bulk',
        recurringDays: data.recurringDays,
        rangeStart: rangeStartDt.toISOString(),
        rangeEnd: rangeEndDt.toISOString(),
        totalSeats: data.totalSeats,
        isGuaranteed: data.isGuaranteed,
        note: data.note || undefined,
        pricePerPerson: data.pricePerPerson ?? null,
        originalPrice: data.originalPrice ?? null,
      },
      {
        onSuccess: (res) => {
          toast.success(`${res.count} departures generated`);
          reset();
          setSelectedDays([]);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ?? 'Failed to generate';
          toast.error(msg);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Weekday picker */}
      <div className='space-y-2'>
        <FieldLabel>
          Repeat on <span className='text-destructive'>*</span>
        </FieldLabel>
        <div className='grid grid-cols-7 gap-1'>
          {WEEKDAYS.map((day) => (
            <button
              type='button'
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={cn(
                'h-8 rounded-md text-[11px] font-bold border-2 transition-all',
                selectedDays.includes(day.value)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5',
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
        {errors.recurringDays && (
          <p className='text-xs text-destructive'>
            {errors.recurringDays.message}
          </p>
        )}
      </div>

      {/* Range calendar */}
      <div className='space-y-1.5'>
        <FieldLabel>
          Date Range <span className='text-destructive'>*</span>
        </FieldLabel>
        <Controller
          control={control}
          name='rangeStart'
          render={({ field: startField }) => (
            <Controller
              control={control}
              name='rangeEnd'
              render={({ field: endField }) => (
                <DateRangePickerFields
                  startValue={startField.value}
                  endValue={endField.value}
                  onStartChange={startField.onChange}
                  onEndChange={endField.onChange}
                  startError={errors.rangeStart?.message}
                  endError={errors.rangeEnd?.message}
                />
              )}
            />
          )}
        />
      </div>

      {/* Time + seats */}
      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-1.5'>
          <FieldLabel>Departure Time</FieldLabel>
          <Input
            type='time'
            className='h-9 text-sm border-2'
            {...register('startTime')}
          />
        </div>
        <div className='space-y-1.5'>
          <FieldLabel>
            Seats each <span className='text-destructive'>*</span>
          </FieldLabel>
          <Input
            type='number'
            min={1}
            className='h-9 text-sm border-2'
            {...register('totalSeats', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Preview banner */}
      {previewCount > 0 && (
        <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border-2 border-emerald-500/20'>
          <Sparkles className='w-3.5 h-3.5 text-emerald-600 shrink-0' />
          <p className='text-xs text-emerald-700 font-medium'>
            Will create <strong>{previewCount}</strong> departure
            {previewCount !== 1 ? 's' : ''}, each{' '}
            <strong>{durationDays}d</strong> long
          </p>
        </div>
      )}

      {/* Note */}
      <div className='space-y-1.5'>
        <FieldLabel>Label / Note</FieldLabel>
        <Input
          placeholder='e.g., Weekend Tour'
          className='h-9 text-sm border-2'
          {...register('note')}
        />
      </div>

      {/* Price overrides */}
      <div className='grid grid-cols-2 gap-3'>
        <PriceField
          label='Price / Person (BDT)'
          name='pricePerPerson'
          register={register}
          error={errors.pricePerPerson?.message}
        />
        <PriceField
          label='Original Price (BDT)'
          name='originalPrice'
          register={register}
          error={errors.originalPrice?.message}
        />
      </div>

      {/* Guaranteed */}
      <div className='flex items-center justify-between px-3 py-2.5 rounded-xl border-2 bg-muted/30'>
        <div>
          <p className='text-sm font-semibold'>Guaranteed</p>
          <p className='text-xs text-muted-foreground'>
            All departures confirmed
          </p>
        </div>
        <Controller
          control={control}
          name='isGuaranteed'
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <Button type='submit' className='w-full gap-2' disabled={isPending}>
        {isPending ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <Sparkles className='w-4 h-4' />
        )}
        Generate {previewCount > 0 ? `${previewCount} ` : ''}Departures
      </Button>
    </form>
  );
}

// ─── edit dialog ──────────────────────────────────────────────────────────────

function EditDepartureDialog({
  departure,
  slug,
  open,
  onOpenChange,
}: {
  departure: Departure | null;
  slug: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate, isPending } = useUpdateDeparture(slug);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    values: departure
      ? {
          startDate: new Date(departure.startDate),
          startTime: format(new Date(departure.startDate), 'HH:mm'),
          totalSeats: departure.totalSeats,
          status: departure.status,
          isGuaranteed: departure.isGuaranteed,
          note: departure.note ?? '',
          pricePerPerson: departure.pricePerPerson
            ? Number(departure.pricePerPerson)
            : null,
          originalPrice: departure.originalPrice
            ? Number(departure.originalPrice)
            : null,
        }
      : undefined,
  });

  if (!departure) return null;

  const onSubmit = (data: EditFormData) => {
    const [hours, minutes] = data.startTime.split(':').map(Number);
    const dt = new Date(data.startDate);
    dt.setHours(hours, minutes, 0, 0);

    mutate(
      {
        departureId: departure.id,
        payload: {
          startDate: dt.toISOString(),
          totalSeats: data.totalSeats,
          status: data.status,
          isGuaranteed: data.isGuaranteed,
          note: data.note || null,
          pricePerPerson: data.pricePerPerson ?? null,
          originalPrice: data.originalPrice ?? null,
        },
      },
      {
        onSuccess: () => {
          toast.success('Departure updated');
          onOpenChange(false);
        },
        onError: () => toast.error('Failed to update departure'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>
            Edit Departure
          </DialogTitle>
          <DialogDescription className='text-xs'>
            {fmtDate(departure.startDate)} · {departure._count?.bookings ?? 0}{' '}
            booking
            {(departure._count?.bookings ?? 0) !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-1'>
          {/* Date */}
          <div className='space-y-1.5'>
            <FieldLabel>Date</FieldLabel>
            <Controller
              control={control}
              name='startDate'
              render={({ field }) => (
                <DatePickerField
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.startDate?.message}
                />
              )}
            />
          </div>

          {/* Time + seats */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <FieldLabel>Time</FieldLabel>
              <Input
                type='time'
                className='h-9 text-sm border-2'
                {...register('startTime')}
              />
            </div>
            <div className='space-y-1.5'>
              <FieldLabel>Total Seats</FieldLabel>
              <Input
                type='number'
                min={departure.bookedSeats}
                className='h-9 text-sm border-2'
                {...register('totalSeats', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Status */}
          <div className='space-y-1.5'>
            <FieldLabel>Status</FieldLabel>
            <Controller
              control={control}
              name='status'
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='h-9 text-sm border-2'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                      <SelectItem key={val} value={val}>
                        <div className='flex items-center gap-2'>
                          <cfg.icon className='w-3.5 h-3.5' />
                          {cfg.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Note */}
          <div className='space-y-1.5'>
            <FieldLabel>Label / Note</FieldLabel>
            <Input
              className='h-9 text-sm border-2'
              placeholder='e.g., Eid Special'
              {...register('note')}
            />
          </div>

          {/* Prices */}
          <div className='grid grid-cols-2 gap-3'>
            <PriceField
              label='Price / Person'
              name='pricePerPerson'
              register={register}
              error={errors.pricePerPerson?.message}
            />
            <PriceField
              label='Original Price'
              name='originalPrice'
              register={register}
              error={errors.originalPrice?.message}
            />
          </div>

          {/* Guaranteed */}
          <div className='flex items-center justify-between px-3 py-2.5 rounded-xl border-2 bg-muted/30'>
            <p className='text-sm font-semibold'>Guaranteed</p>
            <Controller
              control={control}
              name='isGuaranteed'
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter className='gap-2 pt-1'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending} className='gap-2'>
              {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
              <Save className='w-4 h-4' />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── delete dialog ────────────────────────────────────────────────────────────

function DeleteConfirmDialog({
  departure,
  slug,
  open,
  onOpenChange,
}: {
  departure: Departure | null;
  slug: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate, isPending } = useDeleteDeparture(slug);
  if (!departure) return null;
  const bookings = departure._count?.bookings ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>
            Delete Departure
          </DialogTitle>
          <DialogDescription>{fmtDate(departure.startDate)}</DialogDescription>
        </DialogHeader>

        <div className='my-1'>
          {bookings > 0 ? (
            <div className='flex gap-2.5 p-3 rounded-xl bg-destructive/10 border-2 border-destructive/20'>
              <Ban className='w-4 h-4 text-destructive shrink-0 mt-0.5' />
              <p className='text-sm text-destructive'>
                Has{' '}
                <strong>
                  {bookings} booking{bookings !== 1 ? 's' : ''}
                </strong>
                . Cancel it instead to preserve records.
              </p>
            </div>
          ) : (
            <div className='flex gap-2.5 p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/20'>
              <BadgeInfo className='w-4 h-4 text-amber-600 shrink-0 mt-0.5' />
              <p className='text-sm text-amber-700'>This cannot be undone.</p>
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            disabled={isPending || bookings > 0}
            className='gap-2'
            onClick={() =>
              mutate(departure.id, {
                onSuccess: () => {
                  toast.success('Departure deleted');
                  onOpenChange(false);
                },
                onError: (err: unknown) => {
                  const msg =
                    (err as { response?: { data?: { error?: string } } })
                      ?.response?.data?.error ?? 'Failed to delete';
                  toast.error(msg);
                },
              })
            }
          >
            {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
            <Trash2 className='w-4 h-4' />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── departure card ───────────────────────────────────────────────────────────

function DepartureCard({
  departure,
  delay,
  onEdit,
  onDelete,
}: {
  departure: Departure;
  delay: number;
  onEdit: (d: Departure) => void;
  onDelete: (d: Departure) => void;
}) {
  const isPast = new Date(departure.startDate) < new Date();

  return (
    <Card
      className={cn(
        'border-2 hover:border-primary/40 hover:shadow-md transition-all duration-200 group animate-in fade-in slide-in-from-bottom',
        isPast && 'opacity-55',
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <CardContent className='p-4 space-y-3'>
        {/* top row */}
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <p className='font-bold text-sm tabular-nums'>
                {fmtDate(departure.startDate)}
              </p>
              <span className='text-xs text-muted-foreground tabular-nums'>
                {format(new Date(departure.startDate), 'HH:mm')}
              </span>
              {departure.isGuaranteed && (
                <Badge
                  variant='outline'
                  className='text-[10px] gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-1.5'
                >
                  <ShieldCheck className='w-2.5 h-2.5' />G
                </Badge>
              )}
            </div>
            <p className='text-[11px] text-muted-foreground mt-0.5'>
              → {fmtDate(departure.endDate)}
            </p>
          </div>
          <StatusBadge status={departure.status} />
        </div>

        {/* note */}
        {departure.note && (
          <div className='flex items-center gap-1.5'>
            <Tag className='w-3 h-3 text-primary shrink-0' />
            <span className='text-xs font-medium text-primary truncate'>
              {departure.note}
            </span>
          </div>
        )}

        {/* seat bar */}
        <SeatBar departure={departure} />

        {/* price override */}
        {departure.pricePerPerson && (
          <div className='flex items-center gap-2'>
            <div className='h-px w-3 bg-primary shrink-0' />
            <span className='text-xs font-bold text-primary'>
              ৳{Number(departure.pricePerPerson).toLocaleString()}
            </span>
            {departure.originalPrice && (
              <span className='text-xs text-muted-foreground line-through'>
                ৳{Number(departure.originalPrice).toLocaleString()}
              </span>
            )}
            <span className='text-xs text-muted-foreground'>/ person</span>
          </div>
        )}

        {/* actions */}
        <div className='flex gap-2 pt-1 border-t border-border'>
          <Button
            size='sm'
            variant='outline'
            className='flex-1 h-7 text-xs gap-1.5 border-2 hover:border-primary/40'
            onClick={() => onEdit(departure)}
          >
            <Pencil className='w-3 h-3' />
            Edit
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='flex-1 h-7 text-xs gap-1.5 border-2 hover:border-destructive/40 hover:text-destructive hover:bg-destructive/5'
            onClick={() => onDelete(departure)}
          >
            <Trash2 className='w-3 h-3' />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function DepartureManagementPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, isPending, isError, refetch } = useDepartures(slug);

  const [editTarget, setEditTarget] = useState<Departure | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Departure | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<DepartureStatus | 'ALL'>(
    'ALL',
  );

  function handleEdit(d: Departure) {
    setEditTarget(d);
    setEditOpen(true);
  }
  function handleDelete(d: Departure) {
    setDeleteTarget(d);
    setDeleteOpen(true);
  }

  const departures = data?.departures ?? [];
  const filtered =
    statusFilter === 'ALL'
      ? departures
      : departures.filter((d) => d.status === statusFilter);

  const totalSeats = departures.reduce((s, d) => s + d.totalSeats, 0);
  const totalBooked = departures.reduce((s, d) => s + d.bookedSeats, 0);
  const activeCount = departures.filter((d) => d.status === 'ACTIVE').length;
  const guaranteedCount = departures.filter((d) => d.isGuaranteed).length;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* ── header ──────────────────────────────────────────────────────── */}
      <div className='mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        <Button variant='ghost' size='sm' className='mb-4 gap-2 -ml-2' asChild>
          <Link href='/dashboard/admin/packages'>
            <ArrowLeft className='w-4 h-4' />
            Back to Packages
          </Link>
        </Button>

        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            <p className='text-xs font-bold tracking-[0.2em] uppercase text-primary mb-1'>
              Schedule Manager
            </p>
            <h1 className='text-3xl font-bold tracking-tight'>
              {isPending ? (
                <Skeleton className='h-9 w-56' />
              ) : (
                <>
                  {data?.package.name}
                  <span className='text-muted-foreground font-light italic ml-2'>
                    departures
                  </span>
                </>
              )}
            </h1>
            {data && (
              <p className='text-sm text-muted-foreground mt-1'>
                {data.package.durationDays}d per trip · {departures.length}{' '}
                scheduled
              </p>
            )}
          </div>
          <Button
            variant='outline'
            size='sm'
            className='gap-2 border-2'
            onClick={() => refetch()}
          >
            <RefreshCw className='w-3.5 h-3.5' />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── stats ────────────────────────────────────────────────────────── */}
      {!isPending && departures.length > 0 && (
        <div
          className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-in fade-in duration-500'
          style={{ animationDelay: '80ms', animationFillMode: 'both' }}
        >
          {[
            {
              label: 'Active',
              value: activeCount,
              icon: CalendarDays,
              color: 'text-primary',
              bg: 'bg-primary/10',
            },
            {
              label: 'Guaranteed',
              value: guaranteedCount,
              icon: ShieldCheck,
              color: 'text-emerald-600',
              bg: 'bg-emerald-500/10',
            },
            {
              label: 'Total Seats',
              value: totalSeats,
              icon: Users,
              color: 'text-violet-600',
              bg: 'bg-violet-500/10',
            },
            {
              label: 'Booked',
              value: `${totalBooked}/${totalSeats}`,
              icon: CheckCircle2,
              color: 'text-amber-600',
              bg: 'bg-amber-500/10',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className='border-2'>
              <CardContent className='p-3 flex items-center gap-3'>
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    bg,
                  )}
                >
                  <Icon className={cn('w-4 h-4', color)} />
                </div>
                <div className='min-w-0'>
                  <p className='text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground'>
                    {label}
                  </p>
                  <p className='text-lg font-bold tabular-nums'>{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className='grid gap-6 lg:grid-cols-[380px_1fr]'>
        {/* ── left: add forms ────────────────────────────────────────────── */}
        <div
          className='space-y-4 animate-in fade-in duration-500'
          style={{ animationDelay: '120ms', animationFillMode: 'both' }}
        >
          <Card className='border-2'>
            <CardHeader className='pb-3 pt-5 px-5'>
              <div className='flex items-center gap-2'>
                <div className='w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <CalendarDays className='w-3.5 h-3.5 text-primary' />
                </div>
                <CardTitle className='text-sm font-bold'>
                  Add Departure
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='px-5 pb-5'>
              <Tabs defaultValue='single'>
                <TabsList className='w-full mb-4 h-8 border-2'>
                  <TabsTrigger
                    value='single'
                    className='flex-1 text-xs gap-1.5 h-6'
                  >
                    <CalendarRange className='w-3 h-3' /> Single
                  </TabsTrigger>
                  <TabsTrigger
                    value='bulk'
                    className='flex-1 text-xs gap-1.5 h-6'
                  >
                    <Repeat2 className='w-3 h-3' /> Bulk
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='single'>
                  {data ? (
                    <SingleDepartureForm
                      slug={slug}
                      durationDays={data.package.durationDays}
                    />
                  ) : (
                    <div className='space-y-3'>
                      {[...Array(4)].map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                        <Skeleton key={i} className='h-9 w-full' />
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value='bulk'>
                  {data ? (
                    <BulkGenerateForm
                      slug={slug}
                      durationDays={data.package.durationDays}
                    />
                  ) : (
                    <div className='space-y-3'>
                      {[...Array(5)].map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                        <Skeleton key={i} className='h-9 w-full' />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* ── right: list ────────────────────────────────────────────────── */}
        <div
          className='space-y-4 animate-in fade-in duration-500'
          style={{ animationDelay: '180ms', animationFillMode: 'both' }}
        >
          {/* filter */}
          <div className='flex items-center justify-between gap-3'>
            <p className='text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground'>
              {filtered.length}{' '}
              {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''}{' '}
              departure{filtered.length !== 1 ? 's' : ''}
            </p>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as DepartureStatus | 'ALL')
              }
            >
              <SelectTrigger className='w-36 h-8 text-xs border-2'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                  <SelectItem key={val} value={val}>
                    <div className='flex items-center gap-2 text-xs'>
                      <cfg.icon className='w-3.5 h-3.5' />
                      {cfg.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* error */}
          {isError && (
            <Card className='border-2 border-destructive/20'>
              <CardContent className='py-10 flex flex-col items-center gap-3 text-center'>
                <XCircle className='w-7 h-7 text-destructive' />
                <p className='text-sm font-semibold'>
                  Failed to load departures
                </p>
                <Button size='sm' variant='outline' onClick={() => refetch()}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* loading */}
          {isPending && (
            <div className='grid sm:grid-cols-2 gap-3'>
              {[...Array(6)].map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <Card key={i} className='border-2'>
                  <CardContent className='p-4 space-y-3'>
                    <div className='flex justify-between'>
                      <Skeleton className='h-4 w-28' />
                      <Skeleton className='h-4 w-16' />
                    </div>
                    <Skeleton className='h-1.5 w-full rounded-full' />
                    <div className='flex gap-2'>
                      <Skeleton className='h-7 flex-1' />
                      <Skeleton className='h-7 flex-1' />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* empty */}
          {!isPending && !isError && filtered.length === 0 && (
            <Card className='border-2 border-dashed'>
              <CardContent className='py-14 flex flex-col items-center gap-3 text-center'>
                <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <CalendarDays className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className='font-semibold text-sm'>No departures found</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {departures.length === 0
                      ? 'Use the form to schedule your first departure.'
                      : `No ${statusFilter.toLowerCase()} departures.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* grid */}
          {!isPending && !isError && filtered.length > 0 && (
            <div className='grid sm:grid-cols-2 gap-3'>
              {filtered.map((d, i) => (
                <DepartureCard
                  key={d.id}
                  departure={d}
                  delay={i * 30}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* dialogs */}
      <EditDepartureDialog
        departure={editTarget}
        slug={slug}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteConfirmDialog
        departure={deleteTarget}
        slug={slug}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
