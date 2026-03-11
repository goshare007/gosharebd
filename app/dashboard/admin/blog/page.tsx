'use client';

import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Eye,
  FileText,
  FolderOpen,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import { motion, useInView, type Variants } from 'motion/react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useAdminBlogPosts,
  useBlogCategories,
  useDeleteBlogPost,
} from '@/services/blog';

// ── Animation config ──────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground border-border',
  },
  PUBLISHED: {
    label: 'Published',
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  },
};

// ── Main ──────────────────────────────────────────────────────────────────────

export default function BlogManagementPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const { data: posts, isPending } = useAdminBlogPosts(
    statusFilter && statusFilter !== 'All' ? statusFilter : undefined,
  );
  const { data: categories } = useBlogCategories();
  const deletePost = useDeleteBlogPost();

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' });
  const filtersInView = useInView(filtersRef, { once: true, margin: '-40px' });
  const tableInView = useInView(tableRef, { once: true, margin: '-40px' });

  const filteredPosts = posts?.filter((post) => {
    if (
      categoryFilter &&
      categoryFilter !== 'All' &&
      post.categoryId !== categoryFilter
    )
      return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this post? This cannot be undone.',
      )
    )
      return;
    await deletePost.mutateAsync(id);
    queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
  };

  const total = posts?.length ?? 0;
  const published = posts?.filter((p) => p.status === 'PUBLISHED').length ?? 0;
  const drafts = posts?.filter((p) => p.status === 'DRAFT').length ?? 0;
  const totalViews = posts?.reduce((s, p) => s + (p.viewCount ?? 0), 0) ?? 0;

  return (
    <div className='flex flex-col gap-10 mt-6 mb-16 md:mb-20'>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div ref={headerRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={headerInView ? 'show' : 'hidden'}
          custom={0}
          className='flex items-start justify-between gap-4 flex-wrap'
        >
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Content Management
              </span>
            </div>
            <h1 className='text-2xl md:text-4xl font-bold leading-tight tracking-tight'>
              Blog{' '}
              <span className='italic font-light text-muted-foreground'>
                posts
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-sm mt-1'>
              Create, edit, and manage all blog content from one place.
            </p>
          </div>

          <div className='flex gap-3 self-end pb-1'>
            <Button variant='outline' size='sm' asChild>
              <Link href='/dashboard/admin/blog/categories'>
                <FolderOpen className='w-4 h-4 mr-2' />
                Categories
              </Link>
            </Button>
            <Button size='sm' asChild>
              <Link href='/dashboard/admin/blog/new'>
                <Plus className='w-4 h-4 mr-2' />
                New Post
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ── Stats strip — divided table pattern ──────────────────────────── */}
      <div ref={statsRef}>
        <motion.div
          variants={gridVariants}
          initial='hidden'
          animate={statsInView ? 'show' : 'hidden'}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border'>
            {(
              [
                { label: 'Total Posts', icon: FileText, value: total },
                { label: 'Published', icon: Eye, value: published },
                { label: 'Drafts', icon: Pencil, value: drafts },
                {
                  label: 'Total Views',
                  icon: Star,
                  value: totalViews.toLocaleString(),
                },
              ] as const
            ).map(({ label, icon: Icon, value }) => (
              <motion.div
                key={label}
                variants={cardVariants}
                className='flex items-center gap-3 p-5'
              >
                <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                  <Icon className='w-4 h-4 text-primary' />
                </div>
                <div className='min-w-0'>
                  <p className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    {label}
                  </p>
                  {isPending ? (
                    <Skeleton className='h-6 w-12 mt-1' />
                  ) : (
                    <p className='text-xl font-bold tabular-nums truncate'>
                      {value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div ref={filtersRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={filtersInView ? 'show' : 'hidden'}
          custom={0}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <div className='p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Filter Posts
              </span>
            </div>
            <div className='flex gap-3'>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-40 h-9 text-xs border-2 hover:border-primary/40'>
                  <SelectValue placeholder='All statuses' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>All statuses</SelectItem>
                  <SelectItem value='DRAFT'>Draft</SelectItem>
                  <SelectItem value='PUBLISHED'>Published</SelectItem>
                  <SelectItem value='ARCHIVED'>Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className='w-48 h-9 text-xs border-2 hover:border-primary/40'>
                  <SelectValue placeholder='All categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>All categories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div ref={tableRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={tableInView ? 'show' : 'hidden'}
          custom={0}
          className='mb-6'
        >
          <div className='flex items-center justify-between'>
            <div>
              <div className='flex items-center gap-3 mb-1'>
                <div className='h-px w-8 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Directory
                </span>
              </div>
              <h2 className='text-xl font-bold tracking-tight'>
                All{' '}
                <span className='italic font-light text-muted-foreground'>
                  posts
                </span>
              </h2>
            </div>
            {filteredPosts && filteredPosts.length > 0 && (
              <span className='text-xs text-muted-foreground'>
                {filteredPosts.length} post
                {filteredPosts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={tableInView ? 'show' : 'hidden'}
          custom={0.1}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='pl-6 text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                  Title
                </TableHead>
                <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                  Category
                </TableHead>
                <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                  Status
                </TableHead>
                <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                  Featured
                </TableHead>
                <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                  Views
                </TableHead>
                <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                  Author
                </TableHead>
                <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                  Created
                </TableHead>
                <TableHead className='pr-6 text-right text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading skeletons */}
              {isPending &&
                Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <TableRow key={i} className='hover:bg-primary/3'>
                    {Array.from({ length: 8 }).map((_, j) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                      <TableCell key={j}>
                        <Skeleton className='h-4 w-full max-w-24' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {/* Empty */}
              {!isPending && filteredPosts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className='py-16 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center'>
                        <FileText className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-semibold'>No posts found</p>
                        <p className='text-xs text-muted-foreground mt-1'>
                          {statusFilter || categoryFilter
                            ? 'Try adjusting your filters.'
                            : 'Create your first post to get started.'}
                        </p>
                      </div>
                      {!statusFilter && !categoryFilter && (
                        <Button size='sm' asChild>
                          <Link href='/dashboard/admin/blog/new'>
                            <Plus className='w-3 h-3 mr-1.5' />
                            New Post
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Rows */}
              {!isPending &&
                filteredPosts?.map((post, i) => {
                  const status =
                    STATUS_CONFIG[post.status] ?? STATUS_CONFIG.DRAFT;
                  return (
                    <motion.tr
                      key={post.id}
                      variants={cardVariants}
                      initial='hidden'
                      animate='show'
                      custom={i * 0.04}
                      className='group border-b border-border last:border-0 hover:bg-primary/3 transition-colors duration-200'
                    >
                      <TableCell className='pl-6 font-medium max-w-xs'>
                        <span className='line-clamp-1'>{post.title}</span>
                      </TableCell>

                      <TableCell className='text-sm text-muted-foreground'>
                        {post.category?.name ?? (
                          <span className='text-muted-foreground/40'>—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant='outline'
                          className={`text-xs font-semibold tracking-wide ${status.className}`}
                        >
                          {status.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {post.featured ? (
                          <Badge
                            variant='outline'
                            className='text-xs bg-primary/10 text-primary border-primary/20'
                          >
                            <Star className='w-3 h-3 mr-1' />
                            Featured
                          </Badge>
                        ) : (
                          <span className='text-muted-foreground/40 text-sm'>
                            —
                          </span>
                        )}
                      </TableCell>

                      <TableCell className='text-sm tabular-nums'>
                        {(post.viewCount ?? 0).toLocaleString()}
                      </TableCell>

                      <TableCell className='text-sm text-muted-foreground'>
                        {post.author?.name ?? (
                          <span className='text-muted-foreground/40'>—</span>
                        )}
                      </TableCell>

                      <TableCell className='text-sm text-muted-foreground whitespace-nowrap'>
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </TableCell>

                      <TableCell className='pr-6 text-right'>
                        <div className='flex justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            asChild
                            className='h-8 w-8'
                          >
                            <Link href={`/blog/${post.slug}`} target='_blank'>
                              <Eye className='w-3.5 h-3.5' />
                            </Link>
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            asChild
                            className='h-8 w-8'
                          >
                            <Link
                              href={`/dashboard/admin/blog/${post.id}/edit`}
                            >
                              <Pencil className='w-3.5 h-3.5' />
                            </Link>
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
                            onClick={() => handleDelete(post.id)}
                            disabled={deletePost.isPending}
                          >
                            <Trash2 className='w-3.5 h-3.5' />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </div>
  );
}
