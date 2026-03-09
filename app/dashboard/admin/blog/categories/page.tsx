'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FolderOpen, Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { type BlogCategory, useBlogCategories } from '@/services/blog';

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <TableRow>
      {[...Array(4)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
        <TableCell key={i}>
          <div className='h-4 rounded bg-muted animate-pulse' />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogCategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories, isPending } = useBlogCategories();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null,
  );
  const [formData, setFormData] = useState({ name: '', description: '' });

  // ── Mutations ───────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const { data: res } = await axios.post(
        '/api/admin/blog/categories',
        data,
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category created');
      closeDialog();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error ?? 'Failed to create category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; description: string };
    }) => {
      const { data: res } = await axios.put(
        `/api/admin/blog/categories/${id}`,
        data,
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category updated');
      closeDialog();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error ?? 'Failed to update category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/admin/blog/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category deleted');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error ?? 'Failed to delete category');
    },
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const openDialog = (category?: BlogCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description ?? '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (category: BlogCategory) => {
    if (!confirm(`Delete "${category.name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(category.id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[6.5rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          CATEGORIES
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
                  categories
                </span>
                <span className='text-primary'>.</span>
              </h1>
              <p className='text-muted-foreground text-base leading-relaxed'>
                Organise your blog posts into categories for easier navigation
                and discovery.
              </p>
            </div>

            <div className='flex gap-3 shrink-0'>
              <Button variant='outline' asChild>
                <a href='/dashboard/admin/blog'>
                  <FolderOpen className='w-4 h-4 mr-2' />
                  All Posts
                </a>
              </Button>
              <Button onClick={() => openDialog()}>
                <Plus className='w-4 h-4 mr-2' />
                New Category
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <section className='py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Stats tiles */}
          {!isPending && categories && (
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8'>
              {[
                { label: 'Total Categories', value: categories.length },
                {
                  label: 'With Description',
                  value: categories.filter((c) => c.description).length,
                },
                {
                  label: 'Without Description',
                  value: categories.filter((c) => !c.description).length,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className='rounded-2xl border border-border bg-card px-5 py-4'
                >
                  <p className='text-xs text-muted-foreground mb-1'>{label}</p>
                  <p className='font-display text-2xl font-bold'>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Section header */}
          <div className='flex items-center gap-3 mb-6'>
            <div className='h-px w-8 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              All Categories
            </span>
          </div>

          {/* Table */}
          <div className='rounded-2xl border border-border overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/30'>
                  <TableHead className='font-semibold'>Name</TableHead>
                  <TableHead className='font-semibold'>Slug</TableHead>
                  <TableHead className='font-semibold'>Description</TableHead>
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
                ) : categories?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className='flex flex-col items-center justify-center py-16 gap-3 text-center'>
                        <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
                          <Tag className='w-5 h-5 text-muted-foreground' />
                        </div>
                        <p className='font-semibold text-sm'>
                          No categories yet
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Add your first category to start organising posts.
                        </p>
                        <Button
                          size='sm'
                          className='mt-1'
                          onClick={() => openDialog()}
                        >
                          <Plus className='w-3 h-3 mr-1.5' />
                          New Category
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories?.map((category) => (
                    <TableRow
                      key={category.id}
                      className='hover:bg-muted/20 transition-colors'
                    >
                      <TableCell className='font-medium'>
                        {category.name}
                      </TableCell>

                      <TableCell>
                        <code className='text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground'>
                          {category.slug}
                        </code>
                      </TableCell>

                      <TableCell className='text-sm text-muted-foreground max-w-xs'>
                        {category.description ? (
                          <span className='line-clamp-1'>
                            {category.description}
                          </span>
                        ) : (
                          <span className='text-muted-foreground/40'>—</span>
                        )}
                      </TableCell>

                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => openDialog(category)}
                          >
                            <Pencil className='w-3.5 h-3.5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
                            onClick={() => handleDelete(category)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className='w-3.5 h-3.5' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {categories && categories.length > 0 && (
            <p className='text-xs text-muted-foreground mt-4 text-right'>
              {categories.length} categor
              {categories.length !== 1 ? 'ies' : 'y'}
            </p>
          )}
        </div>
      </section>

      {/* ── Dialog ─────────────────────────────────────────────────────────── */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the name or description of this category.'
                : 'Add a new category to organise your blog posts.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>
                  Name <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='e.g. Travel Tips'
                  required
                />
                {formData.name && (
                  <p className='text-xs text-muted-foreground'>
                    Slug:{' '}
                    <code className='bg-muted px-1.5 py-0.5 rounded text-xs'>
                      {formData.name
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')}
                    </code>
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>
                  Description{' '}
                  <span className='text-muted-foreground font-normal'>
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder='Short description of this category…'
                  className='resize-none min-h-20'
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={closeDialog}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isSaving || !formData.name.trim()}
              >
                {isSaving
                  ? 'Saving…'
                  : editingCategory
                    ? 'Save Changes'
                    : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
