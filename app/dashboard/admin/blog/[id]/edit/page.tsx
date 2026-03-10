'use client';

import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';
import { toast } from 'sonner';
import { TipTapEditor } from '@/components/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  uploadBlogImage,
  useAdminBlogPost,
  useBlogCategories,
  useCreateBlogPost,
  useUpdateBlogPost,
} from '@/services/blog';
import { useCheckBlogSlug } from '@/services/slug';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tags: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function FormSection({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('rounded-2xl border border-border bg-card p-6', className)}
    >
      <div className='flex items-center gap-3 mb-5'>
        <div className='h-px w-6 bg-primary' />
        <span className='text-xs font-semibold tracking-[0.18em] uppercase text-primary'>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── Image uploader ───────────────────────────────────────────────────────────
function ImageUploader({
  label,
  hint,
  url,
  isUploading,
  aspectClass,
  onChange,
}: {
  label: string;
  hint?: string;
  url: string;
  isUploading: boolean;
  aspectClass: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className='space-y-2'>
      <Label>{label}</Label>
      <div className='flex items-start flex-col md:flex-row gap-4'>
        <label
          className={cn(
            'relative flex items-center justify-center shrink-0 rounded-xl border-2 border-dashed border-border bg-muted/40 overflow-hidden cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/5',
            aspectClass,
            isUploading && 'pointer-events-none opacity-60',
          )}
        >
          {url ? (
            <Image src={url} alt={label} fill className='object-cover' />
          ) : isUploading ? (
            <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
          ) : (
            <div className='flex flex-col items-center gap-1.5 text-muted-foreground px-4 text-center'>
              <ImageIcon className='w-5 h-5' />
              <span className='text-xs'>Click to upload</span>
            </div>
          )}
          <input
            type='file'
            accept='image/*'
            className='sr-only'
            onChange={onChange}
            disabled={isUploading}
          />
        </label>
        <div className='pt-1 flex flex-col md:flex-row gap-1'>
          {isUploading && (
            <p className='text-xs text-muted-foreground flex items-center gap-1.5'>
              <Loader2 className='w-3 h-3 animate-spin' />
              Uploading to Cloudinary…
            </p>
          )}
          {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Page skeleton ────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-6 w-32 bg-muted rounded animate-pulse mb-4' />
          <div className='h-12 w-72 bg-muted rounded animate-pulse mb-3' />
          <div className='h-4 w-56 bg-muted rounded animate-pulse' />
        </div>
      </section>
      <section className='py-10'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6'>
          {[...Array(4)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            <div key={i} className='h-40 rounded-2xl bg-muted animate-pulse' />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPostFormPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string | undefined;
  const isEditMode = Boolean(postId);

  const { data: categories, isPending: categoriesLoading } =
    useBlogCategories();
  const { data: post } = useAdminBlogPost(postId ?? '');
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();

  const [coverImage, setCoverImage] = useState('');
  const [coverImageId, setCoverImageId] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [tagsArray, setTagsArray] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    defaultValues: { status: 'DRAFT', featured: false },
  });

  const title = watch('title');
  const slugValue = watch('slug');
  const isSaving = createPost.isPending || updatePost.isPending;

  // ── Slug uniqueness check (create mode only) ────────────────────────────────
  const { data: slugAvailable, isFetching: checkingSlug } = useCheckBlogSlug(
    slugValue,
    !isEditMode,
  );

  // ── Populate form in edit mode ──────────────────────────────────────────────
  useEffect(() => {
    if (isEditMode && post) {
      reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.categoryId,
        tags: post.tags.join(', '),
        status: post.status,
        featured: post.featured,
        metaTitle: post.metaTitle ?? '',
        metaDescription: post.metaDescription ?? '',
      });
      setCoverImage(post.coverImage);
      setCoverImageId(post.coverImageId);
      setTagsArray(post.tags);
    }
  }, [isEditMode, post, reset]);

  // ── Auto-slug on create ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEditMode && title) {
      setValue('slug', slugify(title, { lower: true, strict: true }));
    }
  }, [title, isEditMode, setValue]);

  // ── Cover image handler ─────────────────────────────────────────────────────
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const { url, publicId } = await uploadBlogImage(file, postId);
      setCoverImage(url);
      setCoverImageId(publicId);
    } catch {
      toast.error('Failed to upload cover image');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // ── Tag handlers ────────────────────────────────────────────────────────────
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tagsArray.includes(tag)) {
      const next = [...tagsArray, tag];
      setTagsArray(next);
      setValue('tags', next.join(', '));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    const next = tagsArray.filter((t) => t !== tag);
    setTagsArray(next);
    setValue('tags', next.join(', '));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (data: BlogPostFormData) => {
    if (!isEditMode && slugAvailable === false) {
      toast.error('This slug is already taken, please choose a different one');
      return;
    }

    const postData = {
      ...data,
      tags: tagsArray,
      coverImage,
      coverImageId,
    };

    try {
      if (isEditMode && postId) {
        await updatePost.mutateAsync({ id: postId, data: postData });
        toast.success('Post updated');
      } else {
        await createPost.mutateAsync(postData);
        toast.success('Post created');
      }
      router.push('/dashboard/admin/blog');
    } catch {
      toast.error('Failed to save post');
    }
  };

  if (isEditMode && !post) {
    return <PageSkeleton />;
  }

  if (categoriesLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[6.5rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          {isEditMode ? 'EDIT' : 'NEW'}
        </div>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <button
              type='button'
              onClick={() => router.back()}
              className='flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6'
            >
              <ArrowLeft className='w-3.5 h-3.5' />
              Back to posts
            </button>

            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                {isEditMode ? 'Editing Post' : 'New Post'}
              </span>
            </div>

            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-3'>
              {isEditMode ? (
                <>
                  Edit{' '}
                  <span className='italic font-light text-muted-foreground'>
                    post
                  </span>
                  <span className='text-primary'>.</span>
                </>
              ) : (
                <>
                  Create a{' '}
                  <span className='italic font-light text-muted-foreground'>
                    new post
                  </span>
                  <span className='text-primary'>.</span>
                </>
              )}
            </h1>
            <p className='text-muted-foreground text-base'>
              {isEditMode
                ? `Editing "${post?.title ?? '…'}"`
                : 'Fill in the details below to publish a new blog post.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <section className='py-10 md:py-14'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* ── Core content ─────────────────────────────────────────── */}
            <FormSection label='Content'>
              <div className='space-y-5'>
                {/* Title */}
                <div className='space-y-2'>
                  <Label htmlFor='title'>
                    Title <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='title'
                    {...register('title', { required: 'Title is required' })}
                    placeholder='Your post title…'
                    className='text-base'
                  />
                  {errors.title && (
                    <p className='text-xs text-destructive'>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div className='space-y-2'>
                  <Label htmlFor='slug'>
                    Slug <span className='text-destructive'>*</span>
                  </Label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none'>
                      /blog/
                    </span>
                    <Input
                      id='slug'
                      {...register('slug', { required: 'Slug is required' })}
                      placeholder='post-url-slug'
                      disabled={isEditMode}
                      className={cn(
                        'pl-12 pr-28',
                        isEditMode && 'opacity-60 cursor-not-allowed',
                        !isEditMode &&
                          slugAvailable === false &&
                          'border-destructive focus-visible:ring-destructive',
                        !isEditMode &&
                          slugAvailable === true &&
                          'border-green-500 focus-visible:ring-green-500',
                      )}
                    />
                    {/* Status badge */}
                    {!isEditMode && slugValue?.length >= 2 && (
                      <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                        {checkingSlug ? (
                          <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <Loader2 className='w-3 h-3 animate-spin' />
                            Checking…
                          </span>
                        ) : slugAvailable === true ? (
                          <span className='text-xs font-medium text-green-600'>
                            ✓ Available
                          </span>
                        ) : slugAvailable === false ? (
                          <span className='text-xs font-medium text-destructive'>
                            ✗ Taken
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {errors.slug && (
                    <p className='text-xs text-destructive'>
                      {errors.slug.message}
                    </p>
                  )}
                  {!isEditMode && slugAvailable === false && (
                    <p className='text-xs text-destructive'>
                      This slug is already in use. Please choose a different
                      one.
                    </p>
                  )}
                  {isEditMode && (
                    <p className='text-xs text-muted-foreground'>
                      Slug is locked after creation to preserve existing URLs.
                    </p>
                  )}
                </div>

                {/* Excerpt */}
                <div className='space-y-2'>
                  <Label htmlFor='excerpt'>Excerpt</Label>
                  <Textarea
                    id='excerpt'
                    {...register('excerpt')}
                    placeholder='Short description shown on cards and in search results…'
                    className='resize-none min-h-20'
                  />
                </div>

                {/* Editor */}
                <div className='space-y-2'>
                  <Label>Body Content</Label>
                  <div className='rounded-xl border border-border overflow-hidden'>
                    <TipTapEditor
                      key={watch('content') ? 'loaded' : 'empty'}
                      content={watch('content')}
                      onChange={(content) => setValue('content', content)}
                    />
                  </div>
                </div>
              </div>
            </FormSection>

            {/* ── Cover image ──────────────────────────────────────────── */}
            <FormSection label='Cover Image'>
              <ImageUploader
                label='Cover Image'
                hint='Displayed at the top of the post and on listing cards. Recommended: 1200×630px.'
                url={coverImage}
                isUploading={isUploadingCover}
                aspectClass='w-64 h-40'
                onChange={handleCoverUpload}
              />
            </FormSection>

            {/* ── Taxonomy ─────────────────────────────────────────────── */}
            <FormSection label='Taxonomy'>
              <div className='space-y-5'>
                <div className='grid sm:grid-cols-2 gap-4'>
                  {/* Category */}
                  <div className='space-y-2'>
                    <Label htmlFor='categoryId'>
                      Category <span className='text-destructive'>*</span>
                    </Label>
                    <Select
                      key={watch('categoryId')}
                      value={watch('categoryId')}
                      onValueChange={(v) => setValue('categoryId', v)}
                    >
                      <SelectTrigger className='min-w-56'>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className='text-xs text-destructive'>
                        Category is required
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className='space-y-2'>
                    <Label htmlFor='status'>Status</Label>
                    <Select
                      key={watch('status')}
                      value={watch('status')}
                      onValueChange={(v) =>
                        setValue('status', v as BlogPostFormData['status'])
                      }
                    >
                      <SelectTrigger className='min-w-56'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='DRAFT'>Draft</SelectItem>
                        <SelectItem value='PUBLISHED'>Published</SelectItem>
                        <SelectItem value='ARCHIVED'>Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className='space-y-2'>
                  <Label>Tags</Label>
                  <div className='flex gap-2'>
                    <div className='relative flex-1'>
                      <Tag className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder='Type a tag and press Enter'
                        className='pl-9'
                      />
                    </div>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {tagsArray.length > 0 && (
                    <div className='flex flex-wrap gap-2 pt-1'>
                      {tagsArray.map((tag) => (
                        <span
                          key={tag}
                          className='inline-flex items-center gap-1.5 bg-primary/8 text-primary px-2.5 py-1 rounded-full text-xs font-medium'
                        >
                          {tag}
                          <button
                            type='button'
                            onClick={() => removeTag(tag)}
                            className='hover:text-destructive transition-colors'
                          >
                            <X className='w-3 h-3' />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured */}
                <div className='flex items-center justify-between rounded-xl border border-border px-4 py-3'>
                  <div>
                    <p className='text-sm font-medium'>Featured post</p>
                    <p className='text-xs text-muted-foreground'>
                      Show this post in the featured hero slot on the blog page
                    </p>
                  </div>
                  <Switch
                    id='featured'
                    checked={watch('featured')}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                </div>
              </div>
            </FormSection>

            {/* ── SEO ──────────────────────────────────────────────────── */}
            <FormSection label='SEO & Social'>
              <div className='space-y-5'>
                <div className='space-y-2'>
                  <Label htmlFor='metaTitle'>
                    Meta Title{' '}
                    <span className='text-muted-foreground font-normal'>
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id='metaTitle'
                    {...register('metaTitle')}
                    placeholder='Overrides post title in search results'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='metaDescription'>
                    Meta Description{' '}
                    <span className='text-muted-foreground font-normal'>
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id='metaDescription'
                    {...register('metaDescription')}
                    placeholder='Overrides excerpt in search results. Keep under 160 characters.'
                    className='resize-none min-h-16'
                  />
                </div>
              </div>
            </FormSection>

            {/* ── Actions ──────────────────────────────────────────────── */}
            <div className='flex items-center justify-between pt-2 pb-8'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => router.back()}
                disabled={isSaving}
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Cancel
              </Button>

              <div className='flex items-center gap-3'>
                {!isEditMode && (
                  <Button
                    type='button'
                    variant='outline'
                    disabled={isSaving || slugAvailable === false}
                    onClick={() => {
                      setValue('status', 'DRAFT');
                      handleSubmit(onSubmit)();
                    }}
                  >
                    Save as Draft
                  </Button>
                )}
                <Button
                  type='submit'
                  disabled={
                    isSaving || (!isEditMode && slugAvailable === false)
                  }
                  className='min-w-32'
                >
                  {isSaving ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Saving…
                    </span>
                  ) : isEditMode ? (
                    'Save Changes'
                  ) : (
                    <span className='flex items-center gap-2'>
                      <Sparkles className='w-4 h-4' />
                      Publish Post
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
