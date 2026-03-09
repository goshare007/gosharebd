'use client';

import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Eye, FileText, FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground',
  },
  PUBLISHED: {
    label: 'Published',
    className: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
};

// ─── Row skeleton ─────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <TableRow>
      {[...Array(8)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
        <TableCell key={i}>
          <div className='h-4 rounded bg-muted animate-pulse' />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Stats strip ─────────────────────────────────────────────────────────────
function StatsStrip({
  posts,
}: {
  posts: { status: string; viewCount: number }[] | undefined;
}) {
  if (!posts) return null;

  const total = posts.length;
  const published = posts.filter((p) => p.status === 'PUBLISHED').length;
  const drafts = posts.filter((p) => p.status === 'DRAFT').length;
  const totalViews = posts.reduce((s, p) => s + (p.viewCount ?? 0), 0);

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
      {[
        { label: 'Total Posts', value: total },
        { label: 'Published', value: published },
        { label: 'Drafts', value: drafts },
        { label: 'Total Views', value: totalViews.toLocaleString() },
      ].map(({ label, value }) => (
        <div
          key={label}
          className='rounded-2xl border border-border bg-card px-5 py-4'
        >
          <p className='text-xs text-muted-foreground mb-1'>{label}</p>
          <p className='font-display text-2xl font-bold text-foreground'>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogManagementPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const { data: posts, isPending } = useAdminBlogPosts(
    statusFilter && statusFilter !== 'All' ? statusFilter : undefined,
  );
  const { data: categories } = useBlogCategories();
  const deletePost = useDeleteBlogPost();

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

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[6.5rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          BLOG
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='max-w-xl'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='h-px w-10 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Content Management
                </span>
              </div>
              <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-3'>
                Blog{' '}
                <span className='italic font-light text-muted-foreground'>
                  posts
                </span>
                <span className='text-primary'>.</span>
              </h1>
              <p className='text-muted-foreground text-base leading-relaxed'>
                Create, edit, and manage all blog content from one place.
              </p>
            </div>

            <div className='flex gap-3 shrink-0'>
              <Button variant='outline' asChild>
                <Link href='/dashboard/admin/blog/categories'>
                  <FolderOpen className='w-4 h-4 mr-2' />
                  Categories
                </Link>
              </Button>
              <Button asChild>
                <Link href='/dashboard/admin/blog/new'>
                  <Plus className='w-4 h-4 mr-2' />
                  New Post
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <section className='py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Stats */}
          <StatsStrip posts={posts} />

          {/* ── Filters ────────────────────────────────────────────────── */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                All Posts
              </span>
            </div>

            <div className='flex gap-3'>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-40'>
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
                <SelectTrigger className='w-48'>
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

          {/* ── Table ──────────────────────────────────────────────────── */}
          <div className='rounded-2xl border border-border overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/30'>
                  <TableHead className='font-semibold'>Title</TableHead>
                  <TableHead className='font-semibold'>Category</TableHead>
                  <TableHead className='font-semibold'>Status</TableHead>
                  <TableHead className='font-semibold'>Featured</TableHead>
                  <TableHead className='font-semibold'>Views</TableHead>
                  <TableHead className='font-semibold'>Author</TableHead>
                  <TableHead className='font-semibold'>Created</TableHead>
                  <TableHead className='text-right font-semibold'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isPending ? (
                  <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                  </>
                ) : filteredPosts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className='flex flex-col items-center justify-center py-16 gap-3 text-center'>
                        <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
                          <FileText className='w-5 h-5 text-muted-foreground' />
                        </div>
                        <p className='font-semibold text-sm'>No posts found</p>
                        <p className='text-xs text-muted-foreground'>
                          {statusFilter || categoryFilter
                            ? 'Try adjusting your filters.'
                            : 'Create your first post to get started.'}
                        </p>
                        {!statusFilter && !categoryFilter && (
                          <Button size='sm' asChild className='mt-1'>
                            <Link href='/dashboard/admin/blog/new'>
                              <Plus className='w-3 h-3 mr-1.5' />
                              New Post
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts?.map((post) => {
                    const status =
                      STATUS_CONFIG[post.status] ?? STATUS_CONFIG.DRAFT;
                    return (
                      <TableRow
                        key={post.id}
                        className='hover:bg-muted/20 transition-colors'
                      >
                        <TableCell className='font-medium max-w-xs'>
                          <span className='line-clamp-1'>{post.title}</span>
                        </TableCell>

                        <TableCell className='text-muted-foreground text-sm'>
                          {post.category?.name ?? (
                            <span className='text-muted-foreground/40'>—</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge className={status.className}>
                            {status.label}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {post.featured ? (
                            <Badge className='bg-primary/10 text-primary'>
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

                        <TableCell className='text-right'>
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
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Post count footer */}
          {filteredPosts && filteredPosts.length > 0 && (
            <p className='text-xs text-muted-foreground mt-4 text-right'>
              Showing {filteredPosts.length} post
              {filteredPosts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
