'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowLeft,
  MapPin,
  Plus,
  Save,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  useSingleDestinations,
  useUpdateDestination,
} from '@/services/destinations';

// ─── Constants ────────────────────────────────────────────────────────────────
const divisions = [
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

// ─── Schema ───────────────────────────────────────────────────────────────────
const destinationSchema = z.object({
  name: z
    .string()
    .min(2, 'Destination name must be at least 2 characters')
    .max(100, 'Must not exceed 100 characters'),
  division: z.string().min(1, 'Division is required'),
  summary: z
    .string()
    .min(20, 'Summary must be at least 20 characters')
    .max(500, 'Must not exceed 500 characters'),
  coverImage: z.string().min(1, 'Cover image is required'),
});

type DestinationFormData = z.infer<typeof destinationSchema>;

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'>
        <Skeleton className='h-4 w-40' />
        <div className='flex items-center gap-3'>
          <Skeleton className='w-12 h-12 rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-7 w-56' />
            <Skeleton className='h-4 w-40' />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-5 w-36' />
              <Skeleton className='h-4 w-64' />
            </CardHeader>
            <CardContent className='space-y-3'>
              <Skeleton className='h-11 w-full' />
              <Skeleton className='h-11 w-full' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ id }: { id: string }) {
  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center gap-4'>
      <div className='w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center'>
        <AlertCircle className='w-8 h-8 text-destructive' />
      </div>
      <div className='text-center space-y-1'>
        <h2 className='text-lg font-bold'>Destination not found</h2>
        <p className='text-sm text-muted-foreground'>
          No destination with ID{' '}
          <code className='font-mono text-xs bg-muted px-1.5 py-0.5 rounded'>
            {id}
          </code>{' '}
          could be found.
        </p>
      </div>
      <Button asChild variant='outline' className='gap-2'>
        <Link href='/dashboard/admin/destinations'>
          <ArrowLeft className='w-4 h-4' />
          Back to destinations
        </Link>
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function EditDestinationPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';

  const { data: dest, isPending, isError } = useSingleDestinations(id);
  const { mutate: updateDestination, isPending: isSaving } =
    useUpdateDestination();

  // ── Local state (same as AddDestinationPage) ──
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema),
    defaultValues: { name: '', division: '', summary: '', coverImage: '' },
  });

  const formValues = watch();

  // Populate form once data loads
  useEffect(() => {
    if (!dest) return;
    reset({
      name: dest.name ?? '',
      division: dest.division ?? '',
      summary: dest.summary ?? '',
      coverImage: dest.image ?? '',
    });
    setTags(dest.tags ?? []);
    if (dest.image) setCoverImage(dest.image);
  }, [dest, reset]);

  // ── Tag handlers ──
  const handleAddTag = () => {
    if (
      currentTag.trim() &&
      !tags.includes(currentTag.trim()) &&
      tags.length < 10
    ) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // ── Image handlers ──
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must not exceed 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }
    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCoverImage(result);
      setValue('coverImage', file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImageFile(null);
    setValue('coverImage', '');
  };

  // ── Submit ──
  const onSubmit = (data: DestinationFormData) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', data.name);
    formData.append('division', data.division);
    formData.append('summary', data.summary);
    formData.append('tags', JSON.stringify(tags));
    if (coverImageFile) {
      formData.append('coverImage', coverImageFile);
    }
    updateDestination(formData);
  };

  // ── Guards ──
  if (!id) return <ErrorState id='(missing)' />;
  if (isPending) return <LoadingSkeleton />;
  if (isError || !dest) return <ErrorState id={id} />;

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Button variant='ghost' size='sm' className='mb-4' asChild>
            <Link href='/dashboard/admin/destinations' className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Back to Destinations
            </Link>
          </Button>

          <div className='flex items-center gap-3 mb-2'>
            <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
              <MapPin className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>Edit Destination</h1>
              <p className='text-muted-foreground'>
                Update the details for{' '}
                <span className='font-medium text-foreground'>{dest.name}</span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-6'>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the essential details about the destination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup className='gap-6'>
                    {/* Name */}
                    <Field data-invalid={!!errors.name}>
                      <FieldLabel htmlFor='name'>
                        Destination Name <span className='text-red-500'>*</span>
                      </FieldLabel>
                      <Input
                        id='name'
                        placeholder="e.g., Cox's Bazar"
                        aria-invalid={!!errors.name}
                        className='h-11'
                        {...register('name')}
                      />
                      {errors.name ? (
                        <FieldError>{errors.name.message}</FieldError>
                      ) : (
                        <FieldDescription>
                          Enter the official name of the destination (2–100
                          characters)
                        </FieldDescription>
                      )}
                    </Field>

                    {/* Division */}
                    <Field data-invalid={!!errors.division}>
                      <FieldLabel htmlFor='division'>
                        Division <span className='text-red-500'>*</span>
                      </FieldLabel>
                      <Select
                        key={formValues.division}
                        value={formValues.division}
                        onValueChange={(value) =>
                          setValue('division', value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger
                          className='h-11'
                          aria-invalid={!!errors.division}
                        >
                          <SelectValue placeholder='Select division' />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((division) => (
                            <SelectItem key={division} value={division}>
                              {division}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.division ? (
                        <FieldError>{errors.division.message}</FieldError>
                      ) : (
                        <FieldDescription>
                          Choose the administrative division where this
                          destination is located
                        </FieldDescription>
                      )}
                    </Field>

                    {/* Summary */}
                    <Field data-invalid={!!errors.summary}>
                      <FieldLabel htmlFor='summary'>
                        Summary <span className='text-red-500'>*</span>
                      </FieldLabel>
                      <Textarea
                        id='summary'
                        placeholder='Write a compelling description about this destination...'
                        aria-invalid={!!errors.summary}
                        rows={5}
                        className='resize-none'
                        {...register('summary')}
                      />
                      {errors.summary ? (
                        <FieldError>{errors.summary.message}</FieldError>
                      ) : (
                        <FieldDescription>
                          Provide an engaging overview that highlights what
                          makes this destination special (20–500 characters)
                        </FieldDescription>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add relevant tags to help travellers discover this destination
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    placeholder='e.g., Beach, Adventure, Family-friendly'
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className='h-11'
                    maxLength={30}
                  />
                  <Button
                    type='button'
                    onClick={handleAddTag}
                    variant='outline'
                    size='icon'
                    className='h-11 w-11 shrink-0'
                    disabled={tags.length >= 10}
                  >
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 p-4 bg-secondary/30 rounded-lg border-2 border-dashed'>
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='pl-3 pr-1 py-1.5 text-sm gap-1'
                      >
                        <span>{tag}</span>
                        <button
                          type='button'
                          onClick={() => handleRemoveTag(tag)}
                          className='ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5'
                        >
                          <X className='w-3 h-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <p className='text-sm text-muted-foreground'>
                  Press Enter or click + to add a tag (maximum 10 tags).
                  Examples: Beach, Mountains, Culture, Wildlife
                </p>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Cover Image <span className='text-red-500'>*</span>
                </CardTitle>
                <CardDescription>
                  Upload a high-quality image that represents this destination
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {!coverImage ? (
                  <label
                    htmlFor='cover-image'
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      errors.coverImage
                        ? 'border-red-500 bg-red-50/50 hover:bg-red-50'
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <Upload className='w-12 h-12 text-muted-foreground mb-4' />
                      <p className='mb-2 text-sm font-medium'>
                        Click to upload cover image
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        PNG, JPG or WEBP (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      id='cover-image'
                      type='file'
                      className='hidden'
                      accept='image/png,image/jpeg,image/webp'
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : (
                  <div className='relative w-full h-80 rounded-xl overflow-hidden border-2 group'>
                    <Image
                      src={coverImage}
                      alt='Cover preview'
                      fill
                      className='object-cover'
                    />
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={handleRemoveImage}
                        className='gap-2'
                      >
                        <X className='w-4 h-4' />
                        Remove Image
                      </Button>
                    </div>
                  </div>
                )}

                {errors.coverImage ? (
                  <p className='text-sm text-red-500 font-medium'>
                    {errors.coverImage.message}
                  </p>
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    {coverImage
                      ? 'Hover over the image to remove it and upload a new one'
                      : 'Choose a stunning landscape or landmark photo that captures the essence of this destination'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className='flex flex-col sm:flex-row gap-4 justify-end'>
              <Button
                type='button'
                variant='outline'
                size='lg'
                className='sm:w-auto'
                asChild
              >
                <Link href='/dashboard/admin/destinations'>Cancel</Link>
              </Button>
              <Button
                type='submit'
                size='lg'
                className='gap-2 sm:w-auto'
                disabled={isSaving}
              >
                <Save className='w-4 h-4' />
                {isSaving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditDestinationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditDestinationPageContent />
    </Suspense>
  );
}
