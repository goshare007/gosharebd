'use client';

import { LogIn, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import AdminDashboard from './admin-dashboard';
import UserDashboard from './user-dashboard';

function DashboardSkeleton() {
  return (
    <div className='min-h-screen bg-background p-6 animate-pulse'>
      {/* Header skeleton */}
      <div className='mb-8 flex items-center justify-between'>
        <div className='space-y-2'>
          <div className='h-8 w-48 rounded-lg bg-muted' />
          <div className='h-4 w-72 rounded-md bg-muted' />
        </div>
        <div className='h-10 w-10 rounded-full bg-muted' />
      </div>

      {/* Stats row skeleton */}
      <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            key={i}
            className='rounded-xl border border-border bg-card p-5 space-y-3'
          >
            <div className='h-4 w-24 rounded bg-muted' />
            <div className='h-7 w-16 rounded bg-muted' />
            <div className='h-3 w-32 rounded bg-muted' />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4'>
          <div className='h-5 w-36 rounded bg-muted' />
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            <div key={i} className='flex items-center gap-3'>
              <div className='h-9 w-9 rounded-full bg-muted shrink-0' />
              <div className='flex-1 space-y-2'>
                <div className='h-3 w-full rounded bg-muted' />
                <div className='h-3 w-3/4 rounded bg-muted' />
              </div>
              <div className='h-6 w-16 rounded-full bg-muted' />
            </div>
          ))}
        </div>

        <div className='rounded-xl border border-border bg-card p-5 space-y-4'>
          <div className='h-5 w-28 rounded bg-muted' />
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            <div key={i} className='space-y-2'>
              <div className='h-3 w-full rounded bg-muted' />
              <div className='h-2 w-full rounded-full bg-muted' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotSignedIn() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-muted'>
        <ShieldAlert className='h-8 w-8 text-muted-foreground' />
      </div>
      <div className='space-y-2'>
        <h2 className='text-xl font-semibold tracking-tight'>
          Authentication required
        </h2>
        <p className='max-w-sm text-sm text-muted-foreground'>
          You need to be signed in to access the dashboard. Please sign in to
          continue.
        </p>
      </div>
      <Link
        href='/sign-in'
        className='inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90'
      >
        <LogIn className='h-4 w-4' />
        Sign in
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { isPending, data: session } = useSession();

  if (isPending) return <DashboardSkeleton />;
  if (!session) return <NotSignedIn />;
  if (session.user.role === 'ADMIN') return <AdminDashboard />;
  return <UserDashboard />;
}
