'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
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
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
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

function fmtDate(d: string) {
  return format(new Date(d), 'dd MMM yyyy');
}

function fmtDateInput(d: Date) {
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

function seatsLeft(d: Departure) {
  return d.totalSeats - d.bookedSeats;
}

function seatsPercent(d: Departure) {
  return Math.round((d.bookedSeats / d.totalSeats) * 100);
}

// ─── zod schemas ──────────────────────────────────────────────────────────────

const singleSchema = z.object({
  startDate: z.string().min(1, 'Date is required'),
  totalSeats: z.number().int().min(1, 'At least 1 seat'),
  isGuaranteed: z.boolean(),
  note: z.string().optional(),
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
});

const bulkSchema = z.object({
  recurringDays: z.array(z.number()).min(1, 'Select at least one day'),
  rangeStart: z.string().min(1, 'Start date required'),
  rangeEnd: z.string().min(1, 'End date required'),
  totalSeats: z.number().int().min(1, 'At least 1 seat'),
  isGuaranteed: z.boolean(),
  note: z.string().optional(),
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
});

const editSchema = z.object({
  startDate: z.string().min(1),
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

// ─── sub-components ───────────────────────────────────────────────────────────

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

function PriceField({
  label,
  name,
  register,
  error,
}: {
  label: string;
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: this is fine
  register: any;
  error?: string;
}) {
  return (
    <div className='space-y-1.5'>
      <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
        {label}
      </Label>
      <Input
        type='number'
        min={0}
        step='0.01'
        placeholder='Override (optional)'
        className='h-9 text-sm'
        {...register(name, {
          setValueAs: (v: string) =>
            v === '' || v === undefined ? null : Number(v) || null,
        })}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}

// ─── single departure form ────────────────────────────────────────────────────

function SingleDepartureForm({
  packageId,
  durationDays,
  onSuccess,
}: {
  packageId: string;
  durationDays: number;
  onSuccess: () => void;
}) {
  const { mutate, isPending } = useCreateDeparture(packageId);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SingleFormData>({
    resolver: zodResolver(singleSchema),
    defaultValues: { isGuaranteed: false, totalSeats: 20 },
  });

  const onSubmit = (data: SingleFormData) => {
    mutate(
      {
        mode: 'single',
        startDate: new Date(data.startDate).toISOString(),
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
          onSuccess();
        },
        onError: () => toast.error('Failed to create departure'),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div className='grid sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
            Start Date <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='datetime-local'
            className='h-9 text-sm'
            min={fmtDateInput(new Date())}
            {...register('startDate')}
          />
          {errors.startDate && (
            <p className='text-xs text-red-500'>{errors.startDate.message}</p>
          )}
          {/* auto end date preview */}
          <p className='text-xs text-muted-foreground'>
            Ends:{' '}
            <span className='font-medium text-foreground'>
              {/* We can't easily watch here without useWatch, show static note */}
              {durationDays} day{durationDays > 1 ? 's' : ''} duration
            </span>
          </p>
        </div>

        <div className='space-y-1.5'>
          <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
            Total Seats <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='number'
            min={1}
            className='h-9 text-sm'
            {...register('totalSeats', { valueAsNumber: true })}
          />
          {errors.totalSeats && (
            <p className='text-xs text-red-500'>{errors.totalSeats.message}</p>
          )}
        </div>
      </div>

      <div className='space-y-1.5'>
        <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
          Label / Note
        </Label>
        <Input
          placeholder='e.g., Eid Special, Monsoon Tour'
          className='h-9 text-sm'
          {...register('note')}
        />
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        <PriceField
          label='Price per Person (BDT)'
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

      <div className='flex items-center justify-between p-3 rounded-xl border-2 border-border bg-primary/5'>
        <div>
          <p className='text-sm font-semibold'>Guaranteed Departure</p>
          <p className='text-xs text-muted-foreground'>
            Confirmed to run regardless of seat count
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
  packageId,
  durationDays,
  onSuccess,
}: {
  packageId: string;
  durationDays: number;
  onSuccess: () => void;
}) {
  const { mutate, isPending } = useCreateDeparture(packageId);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BulkFormData>({
    resolver: zodResolver(bulkSchema),
    defaultValues: { isGuaranteed: false, totalSeats: 20, recurringDays: [] },
  });

  const toggleDay = (day: number) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(next);
    setValue('recurringDays', next, { shouldValidate: true });
  };

  const onSubmit = (data: BulkFormData) => {
    mutate(
      {
        mode: 'bulk',
        recurringDays: data.recurringDays,
        rangeStart: new Date(data.rangeStart).toISOString(),
        rangeEnd: new Date(data.rangeEnd).toISOString(),
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
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ?? 'Failed to generate departures';
          toast.error(msg);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      {/* day picker */}
      <div className='space-y-2'>
        <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
          Repeat on Days <span className='text-red-500'>*</span>
        </Label>
        <div className='flex gap-2 flex-wrap'>
          {WEEKDAYS.map((day) => (
            <button
              type='button'
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={cn(
                'h-9 w-12 rounded-lg text-xs font-bold border-2 transition-all duration-200',
                selectedDays.includes(day.value)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/40 hover:bg-primary/5',
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
        {errors.recurringDays && (
          <p className='text-xs text-red-500'>{errors.recurringDays.message}</p>
        )}
      </div>

      {/* date range */}
      <div className='grid sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
            Range Start <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='datetime-local'
            className='h-9 text-sm'
            min={fmtDateInput(new Date())}
            {...register('rangeStart')}
          />
          {errors.rangeStart && (
            <p className='text-xs text-red-500'>{errors.rangeStart.message}</p>
          )}
        </div>
        <div className='space-y-1.5'>
          <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
            Range End <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='datetime-local'
            className='h-9 text-sm'
            min={fmtDateInput(addDays(new Date(), 1))}
            {...register('rangeEnd')}
          />
          {errors.rangeEnd && (
            <p className='text-xs text-red-500'>{errors.rangeEnd.message}</p>
          )}
        </div>
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
            Seats per Departure <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='number'
            min={1}
            className='h-9 text-sm'
            {...register('totalSeats', { valueAsNumber: true })}
          />
          {errors.totalSeats && (
            <p className='text-xs text-red-500'>{errors.totalSeats.message}</p>
          )}
        </div>
        <div className='space-y-1.5'>
          <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
            Label / Note
          </Label>
          <Input
            placeholder='e.g., Weekend Tour'
            className='h-9 text-sm'
            {...register('note')}
          />
        </div>
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        <PriceField
          label='Price per Person (BDT)'
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

      <div className='flex items-center justify-between p-3 rounded-xl border-2 border-border bg-primary/5'>
        <div>
          <p className='text-sm font-semibold'>Guaranteed Departures</p>
          <p className='text-xs text-muted-foreground'>
            All generated departures confirmed to run
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

      <div className='p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/20 flex gap-2.5'>
        <BadgeInfo className='w-4 h-4 text-amber-600 shrink-0 mt-0.5' />
        <p className='text-xs text-amber-700'>
          This will create one departure row for every matching weekday in the
          selected range. Each departure will be {durationDays} day
          {durationDays > 1 ? 's' : ''} long.
        </p>
      </div>

      <Button type='submit' className='w-full gap-2' disabled={isPending}>
        {isPending ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <Sparkles className='w-4 h-4' />
        )}
        Generate Departures
      </Button>
    </form>
  );
}

// ─── edit dialog ──────────────────────────────────────────────────────────────

function EditDepartureDialog({
  departure,
  packageId,
  open,
  onOpenChange,
}: {
  departure: Departure | null;
  packageId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate, isPending } = useUpdateDeparture(packageId);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  // Reset form when departure changes
  useState(() => {
    if (departure) {
      reset({
        startDate: fmtDateInput(new Date(departure.startDate)),
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
      });
    }
  });

  if (!departure) return null;

  const onSubmit = (data: EditFormData) => {
    mutate(
      {
        departureId: departure.id,
        payload: {
          startDate: new Date(data.startDate).toISOString(),
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
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='font-display text-xl font-bold'>
            Edit{' '}
            <span className='italic font-light text-muted-foreground'>
              departure
            </span>
          </DialogTitle>
          <DialogDescription className='text-xs'>
            {fmtDate(departure.startDate)} · {departure._count?.bookings ?? 0}{' '}
            booking{(departure._count?.bookings ?? 0) !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-2'>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
                Start Date
              </Label>
              <Input
                type='datetime-local'
                className='h-9 text-sm'
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className='text-xs text-red-500'>
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
                Total Seats
              </Label>
              <Input
                type='number'
                min={departure.bookedSeats}
                className='h-9 text-sm'
                {...register('totalSeats', { valueAsNumber: true })}
              />
              {errors.totalSeats && (
                <p className='text-xs text-red-500'>
                  {errors.totalSeats.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
              Status
            </Label>
            <Controller
              control={control}
              name='status'
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='h-9 text-sm'>
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

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
              Label / Note
            </Label>
            <Input
              className='h-9 text-sm'
              placeholder='e.g., Eid Special'
              {...register('note')}
            />
          </div>

          <div className='grid sm:grid-cols-2 gap-4'>
            <PriceField
              label='Price per Person'
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

          <div className='flex items-center justify-between p-3 rounded-xl border-2 border-border bg-primary/5'>
            <div>
              <p className='text-sm font-semibold'>Guaranteed</p>
              <p className='text-xs text-muted-foreground'>
                Confirmed to run regardless of seat count
              </p>
            </div>
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

          <DialogFooter className='gap-2'>
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

// ─── delete confirm dialog ────────────────────────────────────────────────────

function DeleteConfirmDialog({
  departure,
  packageId,
  open,
  onOpenChange,
}: {
  departure: Departure | null;
  packageId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate, isPending } = useDeleteDeparture(packageId);

  if (!departure) return null;

  const bookings = departure._count?.bookings ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-display text-xl font-bold'>
            Delete{' '}
            <span className='italic font-light text-muted-foreground'>
              departure
            </span>
            <span className='text-destructive'>?</span>
          </DialogTitle>
          <DialogDescription>{fmtDate(departure.startDate)}</DialogDescription>
        </DialogHeader>

        <div className='space-y-3 my-2'>
          {bookings > 0 ? (
            <div className='p-3 rounded-xl bg-red-500/10 border-2 border-red-500/20 flex gap-2.5'>
              <Ban className='w-4 h-4 text-red-500 shrink-0 mt-0.5' />
              <p className='text-sm text-red-600'>
                This departure has{' '}
                <strong>
                  {bookings} active booking{bookings !== 1 ? 's' : ''}
                </strong>
                . You cannot delete it — cancel it instead to preserve booking
                records.
              </p>
            </div>
          ) : (
            <div className='p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/20 flex gap-2.5'>
              <BadgeInfo className='w-4 h-4 text-amber-600 shrink-0 mt-0.5' />
              <p className='text-sm text-amber-700'>
                This action is permanent and cannot be undone.
              </p>
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
        'border-2 hover:border-primary/30 hover:shadow-md transition-all duration-300 group animate-in fade-in slide-in-from-bottom',
        isPast && 'opacity-60',
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className='p-4 space-y-3'>
        {/* top row */}
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <p className='font-display font-bold text-base'>
                {fmtDate(departure.startDate)}
              </p>
              {departure.isGuaranteed && (
                <Badge
                  variant='outline'
                  className='text-xs gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                >
                  <ShieldCheck className='w-3 h-3' />
                  Guaranteed
                </Badge>
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Until {fmtDate(departure.endDate)}
            </p>
          </div>
          <StatusBadge status={departure.status} />
        </div>

        {/* note */}
        {departure.note && (
          <div className='flex items-center gap-1.5'>
            <Tag className='w-3 h-3 text-primary shrink-0' />
            <span className='text-xs font-medium text-primary'>
              {departure.note}
            </span>
          </div>
        )}

        {/* seat bar */}
        <SeatBar departure={departure} />

        {/* price override */}
        {departure.pricePerPerson && (
          <div className='flex items-center gap-2 pt-1'>
            <div className='h-px w-4 bg-primary shrink-0' />
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
            className='flex-1 h-7 text-xs gap-1.5 border-2 hover:border-red-500/40 hover:text-red-500 hover:bg-red-500/5'
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
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = use(params);
  const { data, isPending, isError, refetch } = useDepartures(packageId);

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

  // summary stats
  const totalSeats = departures.reduce((s, d) => s + d.totalSeats, 0);
  const totalBooked = departures.reduce((s, d) => s + d.bookedSeats, 0);
  const activeCount = departures.filter((d) => d.status === 'ACTIVE').length;
  const guaranteedCount = departures.filter((d) => d.isGuaranteed).length;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* ── header ──────────────────────────────────────────────────────── */}
      <div className='mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <Button variant='ghost' size='sm' className='mb-4 gap-2' asChild>
          <Link href={`/dashboard/admin/packages`}>
            <ArrowLeft className='w-4 h-4' />
            Back to Packages
          </Link>
        </Button>

        <div className='flex items-end justify-between gap-4 flex-wrap'>
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-12 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Schedule Manager
              </span>
            </div>
            <h1 className='font-display text-4xl font-bold leading-tight tracking-tight'>
              {isPending ? (
                <Skeleton className='h-10 w-64' />
              ) : (
                <>
                  {data?.package.name}{' '}
                  <span className='italic font-light text-muted-foreground'>
                    departures
                  </span>
                  <span className='text-primary'>.</span>
                </>
              )}
            </h1>
            {data && (
              <p className='text-muted-foreground text-sm mt-1'>
                {data.package.durationDays} day
                {data.package.durationDays > 1 ? 's' : ''} per departure ·{' '}
                {departures.length} total scheduled
              </p>
            )}
          </div>

          <Button
            variant='outline'
            size='sm'
            className='gap-2 border-2 hover:border-primary/40'
            onClick={() => refetch()}
          >
            <RefreshCw className='w-3.5 h-3.5' />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── summary stats ────────────────────────────────────────────────── */}
      {!isPending && departures.length > 0 && (
        <div
          className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom duration-700'
          style={{ animationDelay: '80ms' }}
        >
          {[
            {
              label: 'Active Departures',
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
              value: `${totalBooked} / ${totalSeats}`,
              icon: CheckCircle2,
              color: 'text-amber-600',
              bg: 'bg-amber-500/10',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className='border-2'>
              <CardContent className='p-4 flex items-center gap-3'>
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                    bg,
                  )}
                >
                  <Icon className={cn('w-4 h-4', color)} />
                </div>
                <div className='min-w-0'>
                  <p className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground truncate'>
                    {label}
                  </p>
                  <p className='font-display text-xl font-bold'>{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* ── left: add forms ────────────────────────────────────────────── */}
        <div
          className='lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-bottom duration-700'
          style={{ animationDelay: '160ms' }}
        >
          <Card className='border-2 hover:border-primary/30 transition-all duration-300'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-2 mb-1'>
                <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <CalendarDays className='w-4 h-4 text-primary' />
                </div>
                <CardTitle className='font-display text-base font-bold'>
                  Add Departure
                </CardTitle>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-px w-6 bg-primary' />
                <p className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
                  Single or bulk
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='single'>
                <TabsList className='w-full mb-5 h-8'>
                  <TabsTrigger
                    value='single'
                    className='flex-1 text-xs gap-1.5'
                  >
                    <CalendarRange className='w-3.5 h-3.5' />
                    Single
                  </TabsTrigger>
                  <TabsTrigger value='bulk' className='flex-1 text-xs gap-1.5'>
                    <Repeat2 className='w-3.5 h-3.5' />
                    Bulk Generate
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='single'>
                  {data && (
                    <SingleDepartureForm
                      packageId={packageId}
                      durationDays={data.package.durationDays}
                      onSuccess={() => {}}
                    />
                  )}
                  {isPending && (
                    <div className='space-y-3'>
                      {Array.from({ length: 4 }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: This is fine
                        <Skeleton key={i} className='h-9 w-full' />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value='bulk'>
                  {data && (
                    <BulkGenerateForm
                      packageId={packageId}
                      durationDays={data.package.durationDays}
                      onSuccess={() => {}}
                    />
                  )}
                  {isPending && (
                    <div className='space-y-3'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: This is fine
                        <Skeleton key={i} className='h-9 w-full' />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* ── right: departures list ─────────────────────────────────────── */}
        <div
          className='lg:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom duration-700'
          style={{ animationDelay: '240ms' }}
        >
          {/* filter bar */}
          <div className='flex items-center justify-between gap-3 flex-wrap'>
            <div className='flex items-center gap-2'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
                {statusFilter === 'ALL'
                  ? 'All'
                  : statusFilter.charAt(0) +
                    statusFilter.slice(1).toLowerCase()}{' '}
                departures
              </span>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as DepartureStatus | 'ALL')
              }
            >
              <SelectTrigger className='w-36 h-8 text-xs border-2 hover:border-primary/40'>
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

          {/* error state */}
          {isError && (
            <Card className='border-2 border-destructive/20'>
              <CardContent className='py-12 flex flex-col items-center gap-3 text-center'>
                <XCircle className='w-8 h-8 text-destructive' />
                <p className='text-sm font-semibold'>
                  Failed to load departures
                </p>
                <Button size='sm' variant='outline' onClick={() => refetch()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* loading */}
          {isPending && (
            <div className='grid sm:grid-cols-2 gap-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: This is fine
                <Card key={i} className='border-2'>
                  <CardContent className='p-4 space-y-3'>
                    <div className='flex justify-between'>
                      <Skeleton className='h-5 w-32' />
                      <Skeleton className='h-5 w-20' />
                    </div>
                    <Skeleton className='h-3 w-24' />
                    <Skeleton className='h-1.5 w-full rounded-full' />
                    <div className='flex gap-2 pt-1'>
                      <Skeleton className='h-7 flex-1' />
                      <Skeleton className='h-7 flex-1' />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* empty state */}
          {!isPending && !isError && filtered.length === 0 && (
            <Card className='border-2 border-dashed'>
              <CardContent className='py-16 flex flex-col items-center gap-3 text-center'>
                <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <CalendarDays className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className='font-display font-bold text-base'>
                    No{' '}
                    <span className='italic font-light text-muted-foreground'>
                      departures
                    </span>{' '}
                    found
                  </p>
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
            <div className='grid sm:grid-cols-2 gap-4'>
              {filtered.map((d, i) => (
                <DepartureCard
                  key={d.id}
                  departure={d}
                  delay={i * 40}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── dialogs ──────────────────────────────────────────────────────── */}
      <EditDepartureDialog
        departure={editTarget}
        packageId={packageId}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteConfirmDialog
        departure={deleteTarget}
        packageId={packageId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
