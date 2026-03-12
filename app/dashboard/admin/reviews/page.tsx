'use client';

import { format } from 'date-fns';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Star,
  Trash2,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  useAdminReviews,
  useDeleteReview,
  useUpdateReviewStatus,
} from '@/services/review';

type TabType = 'pending' | 'approved' | 'rejected' | 'all';

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<TabType>('pending');
  const [page, setPage] = useState(1);
  const limit = 10;

  const approved =
    tab === 'approved'
      ? true
      : tab === 'pending'
        ? false
        : tab === 'rejected'
          ? false
          : undefined;

  const { data, isPending, isError } = useAdminReviews({
    page,
    limit,
    approved: approved,
  });

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateReviewStatus();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  const tabs: { value: TabType; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'all', label: 'All' },
  ];

  const handleApprove = (id: string) => {
    updateStatus({ id, approved: true });
  };

  const handleReject = (id: string) => {
    updateStatus({ id, approved: false });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview(id);
    }
  };

  if (isPending) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-96 w-full' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Failed to load reviews</p>
      </div>
    );
  }

  const { reviews, pagination } = data;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Manage Reviews</h1>
        <p className='text-muted-foreground mt-1'>
          Review and moderate user reviews
        </p>
      </div>

      <div className='flex gap-2 border-b pb-2'>
        {tabs.map((t) => (
          <button
            key={t.value}
            type='button'
            onClick={() => {
              setTab(t.value);
              setPage(1);
            }}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              tab === t.value
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            {tab === t.value && (
              <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
            )}
          </button>
        ))}
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center py-8'>
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='relative w-10 h-10 rounded-full overflow-hidden border'>
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full bg-muted flex items-center justify-center'>
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className='font-medium text-sm'>
                          {review.user.name}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {review.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/packages/${review.package.slug}`}
                      className='text-sm hover:text-primary hover:underline'
                    >
                      {review.package.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                      <span className='text-sm font-medium'>
                        {review.rating}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className='text-sm max-w-xs truncate'>
                      {review.comment}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {review.approved ? (
                        <span className='inline-flex items-center gap-1 text-xs text-green-600'>
                          <CheckCircle2 className='w-3 h-3' />
                          Approved
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 text-xs text-yellow-600'>
                          <XCircle className='w-3 h-3' />
                          Pending
                        </span>
                      )}
                      {review.isVerified && (
                        <span className='inline-flex items-center gap-1 text-xs text-blue-600'>
                          <CheckCircle2 className='w-3 h-3' />
                          Verified
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm text-muted-foreground'>
                      {format(new Date(review.date), 'MMM d, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        {!review.approved && (
                          <DropdownMenuItem
                            onClick={() => handleApprove(review.id)}
                            disabled={isUpdating}
                          >
                            <CheckCircle2 className='w-4 h-4 mr-2' />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {review.approved && (
                          <DropdownMenuItem
                            onClick={() => handleReject(review.id)}
                            disabled={isUpdating}
                          >
                            <XCircle className='w-4 h-4 mr-2' />
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(review.id)}
                          disabled={isDeleting}
                          className='text-red-600'
                        >
                          <Trash2 className='w-4 h-4 mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className='w-4 h-4' />
          </Button>
          <span className='text-sm text-muted-foreground'>
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}
          >
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  );
}
