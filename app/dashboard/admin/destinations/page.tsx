'use client';

import {
  AlertCircle,
  Edit2,
  Globe,
  LayoutGrid,
  List,
  MapPin,
  Package,
  Plus,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  useAllDestinations,
  useDeleteDestination,
} from '@/services/destinations';

// ─── Types ────────────────────────────────────────────────────────────────────
type Destination = {
  id: string;
  name: string;
  division: string;
  summary: string;
  image?: string;
  tags?: string[];
  packageCount?: number;
  startingPrice?: number;
};

// ─── Delete confirm dialog ────────────────────────────────────────────────────
function DeleteDialog({
  destination,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: {
  destination: Destination | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <div className='w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2'>
            <Trash2 className='w-5 h-5 text-destructive' />
          </div>
          <DialogTitle>Delete destination?</DialogTitle>
          <DialogDescription>
            <span className='font-semibold text-foreground'>
              {destination?.name}
            </span>{' '}
            and all its associated packages will be permanently removed. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isDeleting}
            className='gap-2'
          >
            <Trash2 className='w-4 h-4' />
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Destination card (grid) ──────────────────────────────────────────────────
function DestinationGridCard({
  dest,
  index,
  onDelete,
}: {
  dest: Destination;
  index: number;
  onDelete: (dest: Destination) => void;
}) {
  return (
    <Card
      className='group relative overflow-hidden border border-border pt-0 hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col animate-in fade-in slide-in-from-bottom-4'
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 1. THE MAIN LINK (Stretched)
          This covers the entire card area. z-10 puts it above the image/text
          but below the buttons. */}
      <Link
        href={`/dashboard/admin/destinations/${dest.id}`}
        className='absolute inset-0 z-10'
        aria-label={`View ${dest.name}`}
      />

      {/* Image Section */}
      <div className='relative h-48 overflow-hidden'>
        <Image
          src={dest.image || '/placeholder-destination.jpg'}
          alt={dest.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent' />

        {/* 2. ACTION BUTTONS
            z-20 sits ABOVE the main link.
            Always visible on touch devices, hover-only on desktop. */}
        <div className='absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 [@media(hover:none)]:translate-y-0 z-20'>
          <Link href={`/dashboard/admin/destinations/edit?id=${dest.id}`}>
            <Button size='icon' className='h-8 w-8 pointer-events-auto'>
              <Edit2 className='w-4 h-4' />
            </Button>
          </Link>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(dest);
            }}
            size='icon'
            variant='destructive'
            className='h-8 w-8 pointer-events-auto'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>

        {/* Name overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
          <h3 className='text-base font-bold leading-tight mb-1'>
            {dest.name}
          </h3>
          <div className='flex items-center gap-1.5 text-xs text-white/80'>
            <MapPin className='w-3 h-3' />
            {dest.division}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className='p-4 space-y-4 flex-1 flex flex-col'>
        <p className='text-xs text-muted-foreground line-clamp-2 flex-1 leading-relaxed'>
          {dest.summary}
        </p>

        {/* Tags */}
        {dest.tags && dest.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {dest.tags.slice(0, 3).map((tag, i) => (
              <Badge
                // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                key={i}
                variant='secondary'
                className='text-[10px] uppercase tracking-wider font-semibold'
              >
                {tag}
              </Badge>
            ))}
            {dest.tags.length > 3 && (
              <Badge variant='outline' className='text-[10px]'>
                +{dest.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer stats */}
        <div className='flex items-center justify-between pt-3 border-t border-border'>
          <div className='flex items-center gap-1.5 text-muted-foreground'>
            <Package className='w-3.5 h-3.5' />
            <span className='text-xs'>
              <span className='font-bold text-foreground'>
                {dest.packageCount ?? 0}
              </span>{' '}
              packages
            </span>
          </div>
          <div className='text-right'>
            <p className='text-[10px] text-muted-foreground'>From</p>
            <p className='text-sm font-bold text-primary'>
              {dest.startingPrice
                ? `৳${dest.startingPrice.toLocaleString()}`
                : '—'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Destination row (list) ───────────────────────────────────────────────────
function DestinationListRow({
  dest,
  index,
  onDelete,
}: {
  dest: Destination;
  index: number;
  onDelete: (dest: Destination) => void;
}) {
  return (
    <div
      className='group relative flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/2 transition-all duration-200 animate-in fade-in slide-in-from-left-4'
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* 1. THE MAIN LINK (Stretched) */}
      <Link
        href={`/dashboard/admin/destinations/${dest.id}`}
        className='absolute inset-0 z-10'
        aria-label={`View ${dest.name}`}
      />

      {/* Thumbnail */}
      <div className='relative w-16 h-16 rounded-xl overflow-hidden shrink-0'>
        <Image
          src={dest.image || '/placeholder-destination.jpg'}
          alt={dest.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-500'
        />
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-0.5'>
          <h3 className='text-sm font-semibold truncate'>{dest.name}</h3>
          {dest.tags?.slice(0, 2).map((tag, i) => (
            <Badge
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              key={i}
              variant='secondary'
              className='text-[10px] uppercase tracking-wider font-semibold hidden sm:flex'
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className='flex items-center gap-1 text-xs text-muted-foreground mb-1'>
          <MapPin className='w-3 h-3' />
          {dest.division}
        </div>
        <p className='text-xs text-muted-foreground line-clamp-1 hidden md:block'>
          {dest.summary}
        </p>
      </div>

      {/* Stats */}
      <div className='hidden sm:flex items-center gap-6 shrink-0'>
        <div className='text-center'>
          <p className='text-xs text-muted-foreground'>Packages</p>
          <p className='text-sm font-bold text-primary'>
            {dest.packageCount ?? 0}
          </p>
        </div>
        <div className='text-center'>
          <p className='text-xs text-muted-foreground'>From</p>
          <p className='text-sm font-bold'>
            {dest.startingPrice
              ? `৳${dest.startingPrice.toLocaleString()}`
              : '—'}
          </p>
        </div>
      </div>

      {/* 2. ACTIONS — z-20 sits above the main link */}
      <div className='flex items-center gap-2 shrink-0 relative z-20'>
        <Link href={`/dashboard/admin/destinations/edit?id=${dest.id}`}>
          <Button variant='outline' size='sm' className='pointer-events-auto'>
            <Edit2 className='w-3 h-3' />
            Edit
          </Button>
        </Link>
        <Button
          variant='destructive'
          size='sm'
          className='pointer-events-auto'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(dest);
          }}
        >
          <Trash2 className='w-3 h-3' />
          Delete
        </Button>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingGrid() {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fine
        <Card key={i} className='overflow-hidden border pt-0'>
          <Skeleton className='h-48 w-full' />
          <div className='p-4 space-y-3'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-5/6' />
            <div className='flex gap-2 pt-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-5 w-16' />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  const { isPending, data, isError, refetch } = useAllDestinations();
  const { mutate: deleteDestination, isPending: isDeleting } =
    useDeleteDestination();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteDestination(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  // ── Loading ──
  if (isPending) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-10 w-40' />
        </div>
        <LoadingGrid />
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-4'>
        <div className='w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center'>
          <AlertCircle className='w-8 h-8 text-destructive' />
        </div>
        <div className='text-center space-y-1'>
          <h2 className='text-lg font-bold'>Failed to load destinations</h2>
          <p className='text-sm text-muted-foreground max-w-sm'>
            There was a problem connecting to the server. Check your connection
            and try again.
          </p>
        </div>
        <Button onClick={() => refetch()} variant='outline' className='gap-2'>
          <RefreshCcw className='w-4 h-4' />
          Try again
        </Button>
      </div>
    );
  }

  // ── Empty ──
  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-5'>
        <div className='w-16 h-16 rounded-2xl bg-muted flex items-center justify-center'>
          <Globe className='w-8 h-8 text-muted-foreground' />
        </div>
        <div className='text-center space-y-1.5'>
          <h2 className='text-lg font-bold'>No destinations yet</h2>
          <p className='text-sm text-muted-foreground'>
            Add your first destination to start building packages.
          </p>
        </div>
        <Link href='/dashboard/admin/destinations/new'>
          <Button className='gap-2'>
            <Plus className='w-4 h-4' />
            Add destination
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Delete dialog */}
      <DeleteDialog
        destination={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <div className='space-y-6'>
        {/* ── Header ── */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Destinations</h1>
            <p className='text-sm text-muted-foreground'>
              {data.length} destination{data.length !== 1 ? 's' : ''} · manage
              your travel locations
            </p>
          </div>

          <div className='flex items-center gap-2'>
            {/* View toggle */}
            <div className='flex items-center rounded-lg border border-border p-1 gap-0.5'>
              <button
                type='button'
                onClick={() => setView('grid')}
                className={cn(
                  'w-8 h-7 rounded-md flex items-center justify-center transition-colors',
                  view === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <LayoutGrid className='w-3.5 h-3.5' />
              </button>
              <button
                type='button'
                onClick={() => setView('list')}
                className={cn(
                  'w-8 h-7 rounded-md flex items-center justify-center transition-colors',
                  view === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <List className='w-3.5 h-3.5' />
              </button>
            </div>

            <Link href='/dashboard/admin/destinations/new'>
              <Button className='gap-2'>
                <Plus className='w-4 h-4' />
                Add destination
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Grid view ── */}
        {view === 'grid' && (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {data.map((dest, i) => (
              <DestinationGridCard
                key={dest.id}
                dest={dest}
                index={i}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}

        {/* ── List view ── */}
        {view === 'list' && (
          <div className='space-y-2'>
            {data.map((dest, i) => (
              <DestinationListRow
                key={dest.id}
                dest={dest}
                index={i}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
