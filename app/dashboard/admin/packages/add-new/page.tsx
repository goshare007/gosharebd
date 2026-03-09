'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  GripVertical,
  Info,
  Layers,
  Link2,
  Loader2,
  MapPin,
  Package,
  Plus,
  Save,
  Settings,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toSlug } from '@/lib/slugify';
import { cn } from '@/lib/utils';
import { useAddPackage } from '@/services/packages';
import { useCheckSlugUniqueness } from '@/services/slug';

// ---------------------------------------------------------------------------
// Division options
// ---------------------------------------------------------------------------
const DIVISIONS = [
  { value: 'DHAKA', label: 'Dhaka' },
  { value: 'CHITTAGONG', label: 'Chittagong' },
  { value: 'SYLHET', label: 'Sylhet' },
  { value: 'RAJSHAHI', label: 'Rajshahi' },
  { value: 'KHULNA', label: 'Khulna' },
  { value: 'BARISAL', label: 'Barisal' },
  { value: 'RANGPUR', label: 'Rangpur' },
  { value: 'MYMENSINGH', label: 'Mymensingh' },
] as const;

type DivisionValue = (typeof DIVISIONS)[number]['value'];

const DIVISION_VALUES = DIVISIONS.map((d) => d.value) as [
  DivisionValue,
  ...DivisionValue[],
];

// ---------------------------------------------------------------------------
// Package type options
// ---------------------------------------------------------------------------
const PACKAGE_TYPES = [
  {
    value: 'REGULAR' as const,
    label: 'Regular',
    description: 'Standard tour package',
    icon: Package,
  },
  {
    value: 'FESTIVAL' as const,
    label: 'Festival',
    description: 'Seasonal or festival-themed tour',
    icon: Sparkles,
  },
];

type PackageTypeValue = 'REGULAR' | 'FESTIVAL';

// ---------------------------------------------------------------------------
// Zod Schema
// ---------------------------------------------------------------------------
const itineraryItemSchema = z.object({
  time: z.string().min(1, 'Time is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order: z.number(),
});

const optionalPositiveNumber = z.number().positive().optional();

const packageSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(120, 'Slug must not exceed 120 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug may only contain lowercase letters, numbers, and hyphens',
    ),
  // ── new field ──
  packageType: z.enum(['REGULAR', 'FESTIVAL']),
  summary: z
    .string()
    .min(20, 'Summary must be at least 20 characters')
    .max(1000, 'Summary must not exceed 1000 characters'),
  division: z.enum(DIVISION_VALUES, { message: 'Division is required' }),
  location: z.string().min(1, 'Location is required'),
  durationDays: z.number().int().min(1, 'At least 1 day'),
  minGroupSize: z.number().int().min(1, 'At least 1 person'),
  maxGroupSize: z.number().int().min(1, 'At least 1 person'),
  pricePerPerson: z.number().positive('Price must be positive'),
  originalPrice: optionalPositiveNumber,
  isCouple: z.boolean(),
  couplePrice: optionalPositiveNumber,
  originalCouplePrice: optionalPositiveNumber,
  coverImage: z.string().min(1, 'Cover image is required'),
  cancellationPolicy: z.string().optional(),
  weatherPolicy: z.string().optional(),
  ageRestriction: z.string().optional(),
  isBestseller: z.boolean(),
  isActive: z.boolean(),
  itinerary: z
    .array(itineraryItemSchema)
    .min(1, 'At least one itinerary item is required'),
});

type PackageFormData = z.infer<typeof packageSchema>;

// ---------------------------------------------------------------------------
// Reusable string-array field
// ---------------------------------------------------------------------------
interface StringArrayFieldProps {
  label: string;
  description: string;
  placeholder: string;
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (val: string) => void;
  maxItems?: number;
  badgeVariant?: 'default' | 'secondary' | 'outline';
}

function StringArrayField({
  label,
  description,
  placeholder,
  items,
  onAdd,
  onRemove,
  maxItems = 20,
  badgeVariant = 'secondary',
}: StringArrayFieldProps) {
  const [current, setCurrent] = useState('');

  const add = () => {
    const trimmed = current.trim();
    if (trimmed && !items.includes(trimmed) && items.length < maxItems) {
      onAdd(trimmed);
      setCurrent('');
    }
  };

  return (
    <div className='space-y-3'>
      <div>
        <p className='text-sm font-medium leading-none'>{label}</p>
        <p className='text-sm text-muted-foreground mt-1'>{description}</p>
      </div>
      <div className='flex gap-2'>
        <Input
          placeholder={placeholder}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          className='h-10'
          maxLength={80}
        />
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='h-10 w-10 shrink-0'
          onClick={add}
          disabled={items.length >= maxItems}
        >
          <Plus className='w-4 h-4' />
        </Button>
      </div>
      {items.length > 0 && (
        <div className='flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-lg border border-dashed'>
          {items.map((item) => (
            <Badge
              key={item}
              variant={badgeVariant}
              className='pl-3 pr-1 py-1.5 gap-1 text-sm'
            >
              {item}
              <button
                type='button'
                onClick={() => onRemove(item)}
                className='ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5'
              >
                <X className='w-3 h-3' />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Package Type Selector
// ---------------------------------------------------------------------------
function PackageTypeSelector({
  value,
  onChange,
  error,
}: {
  value: PackageTypeValue;
  onChange: (val: PackageTypeValue) => void;
  error?: string;
}) {
  return (
    <div className='space-y-2'>
      <p className='text-sm font-medium leading-none'>
        Package Type <span className='text-red-500'>*</span>
      </p>
      <div className='grid grid-cols-2 gap-3'>
        {PACKAGE_TYPES.map(({ value: v, label, description, icon: Icon }) => {
          const isSelected = value === v;
          return (
            <button
              key={v}
              type='button'
              onClick={() => onChange(v)}
              className={cn(
                'relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 hover:bg-muted/30',
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                  isSelected
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className='w-4 h-4' />
              </div>
              <div className='min-w-0 flex-1'>
                <p
                  className={cn(
                    'text-sm font-semibold',
                    isSelected && 'text-primary',
                  )}
                >
                  {label}
                </p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {description}
                </p>
              </div>
              {/* Radio dot */}
              <div
                className={cn(
                  'absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                  isSelected ? 'border-primary' : 'border-border',
                )}
              >
                {isSelected && (
                  <div className='w-2 h-2 rounded-full bg-primary' />
                )}
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
function AddNewPackageContent() {
  const searchParams = useSearchParams();
  const destinationId = searchParams.get('destinationId');

  const [tags, setTags] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const { mutate: addPackage, isPending } = useAddPackage();

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const slugManuallyEdited = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: '',
      slug: '',
      packageType: 'REGULAR', // ── default ──
      summary: '',
      division: undefined,
      location: '',
      durationDays: 1,
      minGroupSize: 1,
      maxGroupSize: 10,
      pricePerPerson: 0,
      originalPrice: undefined,
      isCouple: false as boolean,
      couplePrice: undefined,
      originalCouplePrice: undefined,
      coverImage: '',
      cancellationPolicy: '',
      weatherPolicy: '',
      ageRestriction: '',
      isBestseller: false as boolean,
      isActive: true as boolean,
      itinerary: [{ time: '', title: '', description: '', order: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itinerary',
  });
  const isCouple = watch('isCouple');
  const watchedName = watch('name');
  const watchedSlug = watch('slug');
  const watchedPackageType = watch('packageType');

  const {
    data: slugAvailable,
    isFetching: slugChecking,
    isError: slugError,
  } = useCheckSlugUniqueness(watchedSlug);

  const slugStatus = !watchedSlug
    ? 'idle'
    : slugChecking
      ? 'checking'
      : slugError
        ? 'error'
        : slugAvailable
          ? 'available'
          : 'taken';

  useEffect(() => {
    if (!slugManuallyEdited.current) {
      setValue('slug', toSlug(watchedName), { shouldValidate: !!watchedName });
    }
  }, [watchedName, setValue]);

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Cover image must be under 2MB');
      return;
    }
    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string);
      setValue('coverImage', file.name, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverImage = () => {
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setValue('coverImage', '', { shouldValidate: true });
  };

  const resetForm = () => {
    reset();
    slugManuallyEdited.current = false;
    setTags([]);
    setHighlights([]);
    setIncludes([]);
    setExcludes([]);
    setCoverImagePreview(null);
    setCoverImageFile(null);
  };

  const onSubmit = (data: PackageFormData) => {
    if (!coverImageFile) return;
    if (slugStatus === 'taken') {
      toast.error('Please choose a unique slug before submitting');
      return;
    }
    if (slugStatus === 'checking') {
      toast.info('Please wait while we check slug availability');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('packageType', data.packageType); // ── new ──
    formData.append('summary', data.summary);
    formData.append('division', data.division);
    formData.append('location', data.location);
    formData.append('durationDays', String(data.durationDays));
    formData.append('minGroupSize', String(data.minGroupSize));
    formData.append('maxGroupSize', String(data.maxGroupSize));
    formData.append('pricePerPerson', String(data.pricePerPerson));
    if (data.originalPrice)
      formData.append('originalPrice', String(data.originalPrice));
    formData.append('isCouple', String(data.isCouple));
    if (data.couplePrice)
      formData.append('couplePrice', String(data.couplePrice));
    if (data.originalCouplePrice)
      formData.append('originalCouplePrice', String(data.originalCouplePrice));
    formData.append('coverImage', coverImageFile);
    formData.append('tags', JSON.stringify(tags));
    formData.append('highlights', JSON.stringify(highlights));
    formData.append('includes', JSON.stringify(includes));
    formData.append('excludes', JSON.stringify(excludes));
    formData.append('itinerary', JSON.stringify(data.itinerary));
    if (data.cancellationPolicy)
      formData.append('cancellationPolicy', data.cancellationPolicy);
    if (data.weatherPolicy)
      formData.append('weatherPolicy', data.weatherPolicy);
    if (data.ageRestriction)
      formData.append('ageRestriction', data.ageRestriction);
    formData.append('isBestseller', String(data.isBestseller));
    formData.append('isActive', String(data.isActive));

    addPackage(formData, { onSuccess: resetForm });
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Button variant='ghost' size='sm' className='mb-4' asChild>
            <Link
              href={`/dashboard/admin/destinations/${destinationId}`}
              className='gap-2'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Destinations
            </Link>
          </Button>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
              <Package className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>Add New Package</h1>
              <p className='text-muted-foreground'>
                {destinationId
                  ? `Creating package for destination: ${destinationId}`
                  : 'Create a new tour package'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-6'>
            {/* ── 1. Basic Information ── */}
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Info className='w-4 h-4 text-muted-foreground' />
                  <CardTitle>Basic Information</CardTitle>
                </div>
                <CardDescription>
                  Core identity and details of the package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup className='gap-6'>
                    {/* ── Package Type ── */}
                    <Controller
                      control={control}
                      name='packageType'
                      render={({ field }) => (
                        <PackageTypeSelector
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.packageType?.message}
                        />
                      )}
                    />

                    {/* Festival hint */}
                    {watchedPackageType === 'FESTIVAL' && (
                      <div className='flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-700 dark:text-amber-400 animate-in fade-in slide-in-from-top-1 duration-200'>
                        <Sparkles className='w-4 h-4 shrink-0 mt-0.5' />
                        <p className='text-xs leading-relaxed'>
                          This package will appear on the{' '}
                          <span className='font-semibold'>Festivals</span> page
                          in addition to the main packages listing.
                        </p>
                      </div>
                    )}

                    {/* Name */}
                    <Field data-invalid={!!errors.name}>
                      <FieldLabel htmlFor='name'>
                        Package Name <span className='text-red-500'>*</span>
                      </FieldLabel>
                      <Input
                        id='name'
                        placeholder="e.g., Cox's Bazar Sunrise Trek"
                        className='h-11'
                        aria-invalid={!!errors.name}
                        {...register('name')}
                      />
                      {errors.name ? (
                        <FieldError>{errors.name.message}</FieldError>
                      ) : (
                        <FieldDescription>2–100 characters</FieldDescription>
                      )}
                    </Field>

                    {/* Slug */}
                    <Field
                      data-invalid={!!errors.slug || slugStatus === 'taken'}
                    >
                      <FieldLabel htmlFor='slug'>
                        Slug <span className='text-red-500'>*</span>
                      </FieldLabel>
                      <div className='relative'>
                        <Link2 className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                        <Input
                          id='slug'
                          placeholder='e.g., coxs-bazar-sunrise-trek'
                          className='h-11 pl-9 pr-9'
                          aria-invalid={!!errors.slug || slugStatus === 'taken'}
                          {...register('slug', {
                            onChange: () => {
                              slugManuallyEdited.current = true;
                            },
                          })}
                        />
                        <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                          {slugStatus === 'checking' && (
                            <Loader2 className='w-4 h-4 text-muted-foreground animate-spin' />
                          )}
                          {slugStatus === 'available' && (
                            <CheckCircle2 className='w-4 h-4 text-green-500' />
                          )}
                          {slugStatus === 'taken' && (
                            <XCircle className='w-4 h-4 text-destructive' />
                          )}
                        </div>
                      </div>
                      {errors.slug ? (
                        <FieldError>{errors.slug.message}</FieldError>
                      ) : slugStatus === 'taken' ? (
                        <FieldError>This slug is already taken</FieldError>
                      ) : slugStatus === 'available' ? (
                        <FieldDescription className='text-green-600'>
                          Slug is available
                        </FieldDescription>
                      ) : (
                        <FieldDescription>
                          Auto-generated from name — you can edit it manually.
                        </FieldDescription>
                      )}
                    </Field>

                    {/* Division + Location */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <Field data-invalid={!!errors.division}>
                        <FieldLabel htmlFor='division'>
                          Division <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <Controller
                          control={control}
                          name='division'
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                id='division'
                                className='h-11'
                                aria-invalid={!!errors.division}
                              >
                                <SelectValue placeholder='Select a division' />
                              </SelectTrigger>
                              <SelectContent>
                                {DIVISIONS.map(({ value, label }) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.division ? (
                          <FieldError>{errors.division.message}</FieldError>
                        ) : (
                          <FieldDescription>
                            Administrative division
                          </FieldDescription>
                        )}
                      </Field>

                      <Field data-invalid={!!errors.location}>
                        <FieldLabel htmlFor='location'>
                          Location <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <div className='relative'>
                          <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                          <Input
                            id='location'
                            placeholder="e.g., Cox's Bazar"
                            className='h-11 pl-9'
                            aria-invalid={!!errors.location}
                            {...register('location')}
                          />
                        </div>
                        {errors.location ? (
                          <FieldError>{errors.location.message}</FieldError>
                        ) : (
                          <FieldDescription>
                            Specific location within the division
                          </FieldDescription>
                        )}
                      </Field>
                    </div>

                    {/* Summary */}
                    <Field data-invalid={!!errors.summary}>
                      <FieldLabel htmlFor='summary'>
                        Summary <span className='text-red-500'>*</span>
                      </FieldLabel>
                      <Textarea
                        id='summary'
                        placeholder='Write an engaging overview of what makes this package special...'
                        rows={5}
                        className='resize-none'
                        aria-invalid={!!errors.summary}
                        {...register('summary')}
                      />
                      {errors.summary ? (
                        <FieldError>{errors.summary.message}</FieldError>
                      ) : (
                        <FieldDescription>20–1000 characters</FieldDescription>
                      )}
                    </Field>

                    {/* Duration / Group sizes */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                      <Field data-invalid={!!errors.durationDays}>
                        <FieldLabel htmlFor='durationDays'>
                          <CalendarDays className='inline w-3.5 h-3.5 mr-1 opacity-60' />
                          Duration (Days){' '}
                          <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <Input
                          id='durationDays'
                          type='number'
                          min={1}
                          className='h-11'
                          {...register('durationDays', { valueAsNumber: true })}
                        />
                        {errors.durationDays && (
                          <FieldError>{errors.durationDays.message}</FieldError>
                        )}
                      </Field>

                      <Field data-invalid={!!errors.minGroupSize}>
                        <FieldLabel htmlFor='minGroupSize'>
                          <Users className='inline w-3.5 h-3.5 mr-1 opacity-60' />
                          Min Group <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <Input
                          id='minGroupSize'
                          type='number'
                          min={1}
                          className='h-11'
                          {...register('minGroupSize', { valueAsNumber: true })}
                        />
                        {errors.minGroupSize && (
                          <FieldError>{errors.minGroupSize.message}</FieldError>
                        )}
                      </Field>

                      <Field data-invalid={!!errors.maxGroupSize}>
                        <FieldLabel htmlFor='maxGroupSize'>
                          <Users className='inline w-3.5 h-3.5 mr-1 opacity-60' />
                          Max Group <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <Input
                          id='maxGroupSize'
                          type='number'
                          min={1}
                          className='h-11'
                          {...register('maxGroupSize', { valueAsNumber: true })}
                        />
                        {errors.maxGroupSize && (
                          <FieldError>{errors.maxGroupSize.message}</FieldError>
                        )}
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* ── 2. Tags & Highlights ── */}
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Tag className='w-4 h-4 text-muted-foreground' />
                  <CardTitle>Tags & Highlights</CardTitle>
                </div>
                <CardDescription>
                  Help travelers discover and understand this package
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <StringArrayField
                  label='Tags'
                  description='Keywords for filtering and search (max 10)'
                  placeholder='e.g., Beach, Adventure, Family-friendly'
                  items={tags}
                  onAdd={(v) => setTags((p) => [...p, v])}
                  onRemove={(v) => setTags((p) => p.filter((t) => t !== v))}
                  maxItems={10}
                />
                <StringArrayField
                  label='Highlights'
                  description='Top experiences included in this package (max 10)'
                  placeholder='e.g., Sunset boat cruise on Buriganga River'
                  items={highlights}
                  onAdd={(v) => setHighlights((p) => [...p, v])}
                  onRemove={(v) =>
                    setHighlights((p) => p.filter((h) => h !== v))
                  }
                  maxItems={10}
                  badgeVariant='outline'
                />
              </CardContent>
            </Card>

            {/* ── 3. Pricing ── */}
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Layers className='w-4 h-4 text-muted-foreground' />
                  <CardTitle>Pricing</CardTitle>
                </div>
                <CardDescription>
                  Set pricing for individuals and optionally for couples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup className='gap-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <Field data-invalid={!!errors.pricePerPerson}>
                        <FieldLabel htmlFor='pricePerPerson'>
                          Price Per Person (BDT){' '}
                          <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <Input
                          id='pricePerPerson'
                          type='number'
                          min={0}
                          step='0.01'
                          placeholder='4500'
                          className='h-11'
                          aria-invalid={!!errors.pricePerPerson}
                          {...register('pricePerPerson', {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.pricePerPerson ? (
                          <FieldError>
                            {errors.pricePerPerson.message}
                          </FieldError>
                        ) : (
                          <FieldDescription>
                            Current sale price
                          </FieldDescription>
                        )}
                      </Field>

                      <Field data-invalid={!!errors.originalPrice}>
                        <FieldLabel htmlFor='originalPrice'>
                          Original Price Per Person (BDT)
                        </FieldLabel>
                        <Input
                          id='originalPrice'
                          type='number'
                          min={0}
                          step='0.01'
                          placeholder='5500'
                          className='h-11'
                          {...register('originalPrice', {
                            setValueAs: (v) =>
                              v === '' || v === undefined
                                ? undefined
                                : Number(v) || undefined,
                          })}
                        />
                        {errors.originalPrice ? (
                          <FieldError>
                            {errors.originalPrice.message}
                          </FieldError>
                        ) : (
                          <FieldDescription>
                            Leave empty if no discount
                          </FieldDescription>
                        )}
                      </Field>
                    </div>

                    <div className='flex items-center justify-between rounded-lg border p-4'>
                      <div>
                        <p className='text-sm font-medium'>Couple Pricing</p>
                        <p className='text-sm text-muted-foreground'>
                          Enable if this package has special couple pricing
                        </p>
                      </div>
                      <Switch
                        checked={isCouple}
                        onCheckedChange={(val) =>
                          setValue('isCouple', val, { shouldValidate: true })
                        }
                      />
                    </div>

                    {isCouple && (
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20'>
                        <Field data-invalid={!!errors.couplePrice}>
                          <FieldLabel htmlFor='couplePrice'>
                            Couple Price (BDT)
                          </FieldLabel>
                          <Input
                            id='couplePrice'
                            type='number'
                            min={0}
                            step='0.01'
                            placeholder='6500'
                            className='h-11'
                            {...register('couplePrice', {
                              setValueAs: (v) =>
                                v === '' || v === undefined
                                  ? undefined
                                  : Number(v) || undefined,
                            })}
                          />
                          {errors.couplePrice && (
                            <FieldError>
                              {errors.couplePrice.message}
                            </FieldError>
                          )}
                        </Field>

                        <Field data-invalid={!!errors.originalCouplePrice}>
                          <FieldLabel htmlFor='originalCouplePrice'>
                            Original Couple Price (BDT)
                          </FieldLabel>
                          <Input
                            id='originalCouplePrice'
                            type='number'
                            min={0}
                            step='0.01'
                            placeholder='8500'
                            className='h-11'
                            {...register('originalCouplePrice', {
                              setValueAs: (v) =>
                                v === '' || v === undefined
                                  ? undefined
                                  : Number(v) || undefined,
                            })}
                          />
                          {errors.originalCouplePrice && (
                            <FieldError>
                              {errors.originalCouplePrice.message}
                            </FieldError>
                          )}
                        </Field>
                      </div>
                    )}
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* ── 4. Inclusions & Exclusions ── */}
            <Card>
              <CardHeader>
                <CardTitle>Inclusions & Exclusions</CardTitle>
                <CardDescription>
                  Clearly set traveler expectations
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <StringArrayField
                  label="What's Included"
                  description='Services and items covered in the package price'
                  placeholder='e.g., AC transportation, Lunch, Guide fee'
                  items={includes}
                  onAdd={(v) => setIncludes((p) => [...p, v])}
                  onRemove={(v) => setIncludes((p) => p.filter((i) => i !== v))}
                />
                <StringArrayField
                  label="What's Not Included"
                  description='Costs the traveler must cover themselves'
                  placeholder='e.g., Travel insurance, Personal shopping'
                  items={excludes}
                  onAdd={(v) => setExcludes((p) => [...p, v])}
                  onRemove={(v) => setExcludes((p) => p.filter((e) => e !== v))}
                  badgeVariant='outline'
                />
              </CardContent>
            </Card>

            {/* ── 5. Itinerary ── */}
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <CalendarDays className='w-4 h-4 text-muted-foreground' />
                  <CardTitle>Itinerary</CardTitle>
                </div>
                <CardDescription>
                  Day-by-day schedule of activities
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='relative flex gap-3 p-4 rounded-lg border bg-secondary/20'
                  >
                    <div className='flex flex-col items-center justify-start pt-2 text-muted-foreground/40'>
                      <GripVertical className='w-4 h-4' />
                      <span className='text-xs font-mono mt-1'>
                        {index + 1}
                      </span>
                    </div>

                    <div className='flex-1 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3'>
                      <Field data-invalid={!!errors.itinerary?.[index]?.time}>
                        <FieldLabel htmlFor={`itinerary.${index}.time`}>
                          Time <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <Input
                          id={`itinerary.${index}.time`}
                          placeholder='8:30 AM'
                          className='h-10'
                          {...register(`itinerary.${index}.time`)}
                        />
                        {errors.itinerary?.[index]?.time && (
                          <FieldError>
                            {errors.itinerary[index]?.time?.message}
                          </FieldError>
                        )}
                      </Field>

                      <Field data-invalid={!!errors.itinerary?.[index]?.title}>
                        <FieldLabel htmlFor={`itinerary.${index}.title`}>
                          Title <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <Input
                          id={`itinerary.${index}.title`}
                          placeholder='e.g., Lalbagh Fort'
                          className='h-10'
                          {...register(`itinerary.${index}.title`)}
                        />
                        {errors.itinerary?.[index]?.title && (
                          <FieldError>
                            {errors.itinerary[index]?.title?.message}
                          </FieldError>
                        )}
                      </Field>

                      <Field
                        className='sm:col-span-2'
                        data-invalid={!!errors.itinerary?.[index]?.description}
                      >
                        <FieldLabel htmlFor={`itinerary.${index}.description`}>
                          Description <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <Textarea
                          id={`itinerary.${index}.description`}
                          placeholder='Brief description of what happens at this stop...'
                          rows={2}
                          className='resize-none'
                          {...register(`itinerary.${index}.description`)}
                        />
                        {errors.itinerary?.[index]?.description && (
                          <FieldError>
                            {errors.itinerary[index]?.description?.message}
                          </FieldError>
                        )}
                      </Field>
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute top-3 right-3 h-7 w-7 text-muted-foreground hover:text-destructive'
                        onClick={() => remove(index)}
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </Button>
                    )}
                  </div>
                ))}

                {errors.itinerary?.root && (
                  <p className='text-sm text-red-500'>
                    {errors.itinerary.root.message}
                  </p>
                )}

                <Button
                  type='button'
                  variant='outline'
                  className='w-full gap-2 border-dashed'
                  onClick={() =>
                    append({
                      time: '',
                      title: '',
                      description: '',
                      order: fields.length,
                    })
                  }
                >
                  <Plus className='w-4 h-4' />
                  Add Itinerary Stop
                </Button>
              </CardContent>
            </Card>

            {/* ── 6. Cover Image ── */}
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Upload className='w-4 h-4 text-muted-foreground' />
                  <CardTitle>
                    Cover Image <span className='text-red-500'>*</span>
                  </CardTitle>
                </div>
                <CardDescription>
                  Primary image shown on package cards
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {!coverImagePreview ? (
                  <label
                    htmlFor='cover-image'
                    className={cn(
                      'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
                      errors.coverImage
                        ? 'border-red-500 bg-red-50/50 hover:bg-red-50'
                        : 'hover:bg-secondary/50',
                    )}
                  >
                    <Upload className='w-10 h-10 text-muted-foreground mb-3' />
                    <p className='text-sm font-medium'>
                      Click to upload cover image
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      PNG, JPG or WEBP — max 2MB
                    </p>
                    <input
                      id='cover-image'
                      type='file'
                      className='hidden'
                      accept='image/png,image/jpeg,image/webp'
                      onChange={handleCoverImageUpload}
                    />
                  </label>
                ) : (
                  <div className='relative w-full h-72 rounded-xl overflow-hidden border-2 group'>
                    <Image
                      src={coverImagePreview}
                      alt='Cover preview'
                      fill
                      className='object-cover'
                    />
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={handleRemoveCoverImage}
                        className='gap-2'
                      >
                        <X className='w-4 h-4' />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
                {errors.coverImage && (
                  <p className='text-sm text-red-500 font-medium'>
                    {errors.coverImage.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ── 7. Policies ── */}
            <Card>
              <CardHeader>
                <CardTitle>Policies</CardTitle>
                <CardDescription>
                  Optional policy information for travelers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup className='gap-6'>
                    <Field>
                      <FieldLabel htmlFor='cancellationPolicy'>
                        Cancellation Policy
                      </FieldLabel>
                      <Textarea
                        id='cancellationPolicy'
                        placeholder='e.g., Free cancellation up to 48 hours before the tour.'
                        rows={2}
                        className='resize-none'
                        {...register('cancellationPolicy')}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='weatherPolicy'>
                        Weather Policy
                      </FieldLabel>
                      <Textarea
                        id='weatherPolicy'
                        placeholder='e.g., Operates in most conditions; rain gear provided.'
                        rows={2}
                        className='resize-none'
                        {...register('weatherPolicy')}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='ageRestriction'>
                        Age Restriction
                      </FieldLabel>
                      <Input
                        id='ageRestriction'
                        placeholder='e.g., Suitable for all ages.'
                        className='h-11'
                        {...register('ageRestriction')}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* ── 8. Settings ── */}
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Settings className='w-4 h-4 text-muted-foreground' />
                  <CardTitle>Settings</CardTitle>
                </div>
                <CardDescription>
                  Visibility and promotional flags
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between rounded-lg border p-4'>
                  <div>
                    <p className='text-sm font-medium'>Active</p>
                    <p className='text-sm text-muted-foreground'>
                      Visible to travelers on the site
                    </p>
                  </div>
                  <Switch
                    checked={watch('isActive')}
                    onCheckedChange={(val) =>
                      setValue('isActive', val, { shouldValidate: true })
                    }
                  />
                </div>
                <div className='flex items-center justify-between rounded-lg border p-4'>
                  <div>
                    <p className='text-sm font-medium'>Bestseller</p>
                    <p className='text-sm text-muted-foreground'>
                      Show "Bestseller" badge on this package
                    </p>
                  </div>
                  <Switch
                    checked={watch('isBestseller')}
                    onCheckedChange={(val) =>
                      setValue('isBestseller', val, { shouldValidate: true })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* ── Actions ── */}
            <div className='flex flex-col sm:flex-row gap-4 justify-end pb-8'>
              <Button
                type='button'
                variant='outline'
                size='lg'
                className='sm:w-auto'
                asChild
              >
                <Link href='/admin/packages'>Cancel</Link>
              </Button>
              <Button
                type='submit'
                size='lg'
                className='gap-2 sm:w-auto'
                disabled={
                  isPending ||
                  slugStatus === 'taken' ||
                  slugStatus === 'checking'
                }
              >
                {isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )}
                {isPending ? 'Creating...' : 'Create Package'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddNewPackage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddNewPackageContent />
    </Suspense>
  );
}
