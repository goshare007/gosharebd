'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  Bell,
  BellOff,
  CalendarCheck,
  CalendarX,
  Check,
  CheckCheck,
  CreditCard,
  MessageCircle,
  RefreshCcw,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

const notificationIcons: Record<string, React.ElementType> = {
  BOOKING_CONFIRMED: CalendarCheck,
  BOOKING_CANCELLED: CalendarX,
  BOOKING_PENDING: CalendarX,
  REVIEW_APPROVED: Star,
  REVIEW_REJECTED: Star,
  NEW_COMMENT: MessageCircle,
  PAYMENT_RECEIVED: CreditCard,
};

const notificationColors: Record<string, string> = {
  BOOKING_CONFIRMED: 'text-green-500 bg-green-500/10',
  BOOKING_CANCELLED: 'text-red-500 bg-red-500/10',
  BOOKING_PENDING: 'text-yellow-500 bg-yellow-500/10',
  REVIEW_APPROVED: 'text-green-500 bg-green-500/10',
  REVIEW_REJECTED: 'text-red-500 bg-red-500/10',
  NEW_COMMENT: 'text-blue-500 bg-blue-500/10',
  PAYMENT_RECEIVED: 'text-green-500 bg-green-500/10',
};

function useNotifications(unreadOnly: boolean = false) {
  return useQuery<{ notifications: Notification[]; unreadCount: number }>({
    queryKey: ['notifications', unreadOnly],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/user/notifications?unread=${unreadOnly}`,
      );
      return data;
    },
  });
}

function useMarkAsRead() {
  return useMutation({
    mutationFn: async (params: { id?: string; markAllRead?: boolean }) => {
      const { data } = await axios.patch('/api/user/notifications', params);
      return data;
    },
    onSuccess: () => {
      toast.success('Notification marked as read');
    },
    onError: () => {
      toast.error('Failed to update notification');
    },
  });
}

function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const Icon = notificationIcons[notification.type] || Bell;
  const colorClass =
    notificationColors[notification.type] || 'text-primary bg-primary/10';

  return (
    <Card
      className={`transition-all duration-200 ${
        notification.read
          ? 'border-border bg-background'
          : 'border-primary/30 bg-primary/5'
      }`}
    >
      <CardContent className='p-4'>
        <div className='flex items-start gap-4'>
          {/* Icon */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
          >
            <Icon className='w-5 h-5' />
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-2'>
              <div>
                <h4
                  className={`font-medium ${
                    notification.read
                      ? 'text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {notification.title}
                </h4>
                <p className='text-sm text-muted-foreground mt-0.5'>
                  {notification.message}
                </p>
              </div>
              {!notification.read && (
                <Badge variant='secondary' className='shrink-0'>
                  New
                </Badge>
              )}
            </div>

            <div className='flex items-center justify-between mt-3'>
              <span className='text-xs text-muted-foreground'>
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <div className='flex items-center gap-2'>
                {notification.link && (
                  <Button
                    variant='link'
                    size='sm'
                    asChild
                    className='h-auto p-0'
                  >
                    <a href={notification.link}>View</a>
                  </Button>
                )}
                {!notification.read && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onMarkRead(notification.id)}
                    className='h-auto p-1 text-xs'
                  >
                    <Check className='w-3 h-3 mr-1' />
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsSkeleton() {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
        <Card key={i} className='border-2'>
          <CardContent className='p-4'>
            <div className='flex items-start gap-4'>
              <Skeleton className='w-10 h-10 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-1/3' />
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-2/3' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-24 text-center'>
      <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5'>
        <BellOff className='w-8 h-8 text-primary' />
      </div>
      <h2 className='text-xl font-bold mb-2'>No notifications</h2>
      <p className='text-sm text-muted-foreground max-w-xs mb-6'>
        You&apos;re all caught up! We&apos;ll notify you about your bookings,
        reviews, and more.
      </p>
    </div>
  );
}

export default function NotificationsPage() {
  const { data, isPending, isError, refetch } = useNotifications();
  const markAsRead = useMarkAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate({ id });
  };

  const handleMarkAllRead = () => {
    markAsRead.mutate({ markAllRead: true });
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <section className='border-b border-border bg-primary/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-12 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              My Account
            </span>
          </div>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h1 className='font-display text-3xl md:text-4xl font-bold leading-tight'>
                <span className='italic font-light text-muted-foreground'>
                  notifications
                </span>
              </h1>
              {!isPending && !isError && data?.unreadCount !== undefined && (
                <p className='text-muted-foreground mt-2 text-sm'>
                  {data.unreadCount > 0
                    ? `${data.unreadCount} unread notification${
                        data.unreadCount === 1 ? '' : 's'
                      }`
                    : 'All caught up!'}
                </p>
              )}
            </div>
            <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1'>
              <Bell className='w-5 h-5 text-primary' />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className='max-w-3xl mx-auto py-10 px-4 sm:px-6'>
        {/* Mark all read button */}
        {data && data.unreadCount > 0 && (
          <div className='flex justify-end mb-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleMarkAllRead}
              disabled={markAsRead.isPending}
              className='gap-2'
            >
              <CheckCheck className='w-4 h-4' />
              Mark all as read
            </Button>
          </div>
        )}

        {isPending ? (
          <NotificationsSkeleton />
        ) : isError ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-5'>
              <AlertTriangle className='w-7 h-7 text-destructive' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>
              Failed to load notifications
            </h2>
            <p className='text-sm text-muted-foreground max-w-xs mb-6'>
              Something went wrong. Please try again.
            </p>
            <Button
              variant='outline'
              onClick={() => refetch()}
              className='gap-2'
            >
              <RefreshCcw className='w-4 h-4' />
              Try again
            </Button>
          </div>
        ) : data?.notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='space-y-3'>
            {data?.notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
