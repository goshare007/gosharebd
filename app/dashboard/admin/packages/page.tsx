'use client';
import {
  AlertCircle,
  Award,
  Clock,
  Edit2,
  MapPin,
  Package,
  Plus,
  RefreshCcw,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllPackages, useDeletePackage } from '@/services/packages';

interface PackageToDelete {
  id: string;
  name: string;
}

export default function PackagesPage({
  params,
}: {
  params: Promise<{ destinationId: string }>;
}) {
  const { destinationId } = use(params);
  const { isPending, data, isError, refetch } = useAllPackages();
  const [packageToDelete, setPackageToDelete] =
    useState<PackageToDelete | null>(null);
  const { mutate: deletePackage, isPending: isDeleting } =
    useDeletePackage(destinationId);

  function handleDeleteConfirm() {
    if (!packageToDelete) return;
    deletePackage(packageToDelete.id, {
      onSuccess: () => setPackageToDelete(null),
    });
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-10 w-36' />
        </div>
        <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-5'>
          {[...Array(6)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className='rounded-2xl border bg-card overflow-hidden'>
              <Skeleton className='h-52 w-full rounded-none' />
              <div className='p-5 space-y-3'>
                <Skeleton className='h-5 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <div className='flex gap-3 pt-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-20' />
                </div>
                <div className='flex justify-between pt-3'>
                  <Skeleton className='h-6 w-24' />
                  <Skeleton className='h-8 w-20' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4'>
        <div className='w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center'>
          <AlertCircle className='w-8 h-8 text-destructive' />
        </div>
        <div>
          <h2 className='text-xl font-semibold mb-1'>
            Failed to load packages
          </h2>
          <p className='text-sm text-muted-foreground max-w-sm'>
            Could not connect to the server. Check your connection and try
            again.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant='outline'
          size='sm'
          className='gap-2'
        >
          <RefreshCcw className='w-4 h-4' /> Retry
        </Button>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4'>
        <div className='w-20 h-20 rounded-2xl bg-muted flex items-center justify-center'>
          <Package className='w-10 h-10 text-muted-foreground' />
        </div>
        <div>
          <h2 className='text-xl font-semibold mb-1'>No packages yet</h2>
          <p className='text-sm text-muted-foreground max-w-sm'>
            Add your first package to start accepting bookings for this
            destination.
          </p>
        </div>
        <Button asChild className='gap-2'>
          <Link href={`/dashboard/admin/packages/add-new`}>
            <Plus className='w-4 h-4' /> Add First Package
          </Link>
        </Button>
      </div>
    );
  }

  // ── Content ──────────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen bg-background'>
      {/* Delete Dialog */}
      <Dialog
        open={!!packageToDelete}
        onOpenChange={(open) => !open && setPackageToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className='font-semibold text-foreground'>
                {packageToDelete?.name}
              </span>
              ? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setPackageToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page Header */}
      <div className='border-b border-border bg-background sticky top-0 z-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            <span className='font-semibold text-foreground'>{data.length}</span>{' '}
            {data.length === 1 ? 'package' : 'packages'}
          </p>
          <Button asChild size='sm' className='gap-2'>
            <Link
              href={`/dashboard/admin/packages/add-new?destinationId=${destinationId}`}
            >
              <Plus className='w-4 h-4' /> Add Package
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-5'>
          {data.map((pkg, idx) => (
            <article
              key={pkg.id}
              className='group relative rounded-2xl border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 flex flex-col'
              style={{
                animationDelay: `${idx * 60}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Invisible full-card link */}
              <Link
                href={`/packages/${pkg.slug}`}
                className='absolute inset-0 z-10'
                aria-label={`View ${pkg.name}`}
              />

              {/* Image */}
              <div className='relative h-52 overflow-hidden bg-muted shrink-0'>
                <Image
                  src={pkg.coverImage}
                  alt={pkg.name}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent' />

                {/* Badges — top left */}
                <div className='absolute top-3 left-3 flex gap-1.5 z-10'>
                  {pkg.isBestseller && (
                    <span className='inline-flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-2 py-0.5 rounded-full'>
                      <Award className='w-3 h-3' /> Bestseller
                    </span>
                  )}
                  {!pkg.isActive && (
                    <span className='inline-flex items-center bg-muted/90 text-muted-foreground text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm'>
                      Inactive
                    </span>
                  )}
                </div>

                {/* Action buttons — top right, revealed on hover */}
                <div className='absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  <Link
                    href={`/dashboard/admin/packages/edit?packageId=${pkg.slug}`}
                  >
                    <Button
                      size='icon'
                      variant='secondary'
                      className='h-8 w-8 shadow-md pointer-events-auto'
                      tabIndex={-1}
                    >
                      <Edit2 className='w-3.5 h-3.5' />
                    </Button>
                  </Link>
                  <Button
                    size='icon'
                    variant='destructive'
                    className='h-8 w-8 shadow-md pointer-events-auto'
                    tabIndex={-1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPackageToDelete({ id: pkg.id, name: pkg.name });
                    }}
                  >
                    <Trash2 className='w-3.5 h-3.5' />
                  </Button>
                </div>

                {/* Name + location anchored to bottom of image */}
                <div className='absolute bottom-0 left-0 right-0 p-4 z-10'>
                  <h3 className='font-semibold text-white text-base leading-tight line-clamp-2 mb-1'>
                    {pkg.name}
                  </h3>
                  <div className='flex items-center gap-1 text-white/70 text-xs'>
                    <MapPin className='w-3 h-3 shrink-0' />
                    <span className='truncate'>{pkg.location}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className='p-4 flex flex-col gap-4 flex-1'>
                {/* Stats row */}
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <Clock className='w-3.5 h-3.5 text-primary' />
                    <span>{pkg.durationDays}D</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Users className='w-3.5 h-3.5 text-primary' />
                    <span>
                      {pkg.minGroupSize}–{pkg.maxGroupSize}
                    </span>
                  </div>
                  {/* Rating */}
                  <div className='flex items-center gap-1 ml-auto'>
                    <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
                    <span className='font-medium text-foreground text-sm'>
                      {pkg.averageRating ? pkg.averageRating.toFixed(1) : '—'}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      ({pkg.reviewCount ?? 0})
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {pkg.tags && pkg.tags.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {pkg.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='text-[11px] px-2 py-0 h-5 rounded-full'
                      >
                        {tag}
                      </Badge>
                    ))}
                    {pkg.tags.length > 3 && (
                      <Badge
                        variant='outline'
                        className='text-[11px] px-2 py-0 h-5 rounded-full'
                      >
                        +{pkg.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Pricing — pinned to bottom */}
                <div className='mt-auto pt-3 border-t border-border flex items-end justify-between'>
                  <div>
                    <p className='text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5'>
                      Per person
                    </p>
                    <div className='flex items-baseline gap-1.5'>
                      <span className='text-lg font-bold text-primary'>
                        ৳{Number(pkg.pricePerPerson).toLocaleString()}
                      </span>
                      {pkg.originalPrice && (
                        <span className='text-xs text-muted-foreground line-through'>
                          ৳{Number(pkg.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {pkg.couplePrice && (
                    <div className='text-right'>
                      <p className='text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5'>
                        Couple
                      </p>
                      <span className='text-base font-bold text-pink-500 dark:text-pink-400'>
                        ৳{Number(pkg.couplePrice).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
