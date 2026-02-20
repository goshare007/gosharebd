'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MapPin, Plus, Save, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useAddDestination } from '@/services/destinations';

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

// Zod schema for form validation
const destinationSchema = z.object({
  name: z
    .string()
    .min(1, 'Destination name is required')
    .min(2, 'Destination name must be at least 2 characters')
    .max(100, 'Destination name must not exceed 100 characters'),
  division: z.string().min(1, 'Division is required'),
  summary: z
    .string()
    .min(1, 'Summary is required')
    .min(20, 'Summary must be at least 20 characters')
    .max(500, 'Summary must not exceed 500 characters'),
  coverImage: z.string().min(1, 'Cover image is required'),
});

type DestinationFormData = z.infer<typeof destinationSchema>;

export default function AddDestinationPage() {
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
    defaultValues: {
      name: '',
      division: '',
      summary: '',
      coverImage: '',
    },
  });

  // Watch form values for display
  const formValues = watch();

  // Form reset function
  const resetForm = () => {
    reset();
    setCoverImage(null);
    setCoverImageFile(null);
    setTags([]);
    setCurrentTag('');
  };

  // Use add destination mutation
  const { mutate: addDestination, isPending } = useAddDestination();

  // Add tag
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      if (tags.length < 10) {
        setTags([...tags, currentTag.trim()]);
        setCurrentTag('');
      }
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must not exceed 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverImage(result);
        // Update form value to mark as valid
        setValue('coverImage', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImageFile(null);
    // Clear form value
    setValue('coverImage', '');
  };

  // Handle form submission with Zod validation
  const onSubmit = (data: DestinationFormData) => {
    if (!coverImageFile) {
      return;
    }

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('division', data.division);
    formData.append('summary', data.summary);
    formData.append('coverImage', coverImageFile);

    // Append tags as JSON
    formData.append('tags', JSON.stringify(tags));

    // Submit via mutation
    addDestination(formData, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Button variant='ghost' size='sm' className='mb-4' asChild>
            <Link href='/admin/destinations' className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Back to Destinations
            </Link>
          </Button>

          <div className='flex items-center gap-3 mb-2'>
            <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
              <MapPin className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>Add New Destination</h1>
              <p className='text-muted-foreground'>
                Create a new destination for travelers to explore
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-6'>
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the essential details about the destination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup className='gap-6'>
                    {/* Destination Name */}
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
                          Enter the official name of the destination (2-100
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
                        value={formValues.division}
                        onValueChange={(value) => setValue('division', value)}
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
                          makes this destination special (20-500 characters)
                        </FieldDescription>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* Tags Card */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add relevant tags to help travelers discover this destination
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

                {/* Tags Display */}
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
                  Press Enter or click the + button to add a tag (maximum 10
                  tags). Examples: Beach, Mountains, Culture, Wildlife
                </p>
              </CardContent>
            </Card>

            {/* Cover Image Card */}
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
                  <div>
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
                  </div>
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
                    Choose a stunning landscape or landmark photo that captures
                    the essence of this destination
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-end'>
              <Button
                type='button'
                variant='outline'
                size='lg'
                className='sm:w-auto'
                asChild
              >
                <Link href='/admin/destinations'>Cancel</Link>
              </Button>
              <Button
                type='submit'
                size='lg'
                className='gap-2 sm:w-auto'
                disabled={isPending}
              >
                <Save className='w-4 h-4' />
                {isPending ? 'Creating...' : 'Create Destination'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
