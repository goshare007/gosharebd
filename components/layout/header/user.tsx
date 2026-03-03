'use client';
import {
  Bell,
  Calendar,
  Headphones,
  Heart,
  LayoutDashboard,
  MapPin,
  Plus,
  Star,
  UserCog,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { getInitials } from '@/lib/utils';
import { SignOut } from './logout';

export default function UserDropDown() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className='flex items-center gap-2'>
        <Skeleton className='h-9 w-9 rounded-full' />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <>
        {/* Desktop buttons */}
        <div className='hidden items-center gap-2 md:flex'>
          <Button asChild>
            <Link href='/sign-in'>Sign in</Link>
          </Button>
        </div>

        {/* Mobile buttons */}
        <div className='flex items-center gap-2 md:hidden'>
          <Button asChild>
            <Link href='/sign-in'>Sign in</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='h-9 w-9 cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-all ring-offset-background hover:ring-2 hover:ring-primary/20 hover:ring-offset-2'>
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name || 'User avatar'}
            />
            <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
              {getInitials(session.user.name)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-64'
          align='end'
          forceMount
          sideOffset={8}
        >
          {/* User Info Header */}
          <DropdownMenuLabel className='font-normal pb-3'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-10 w-10 border-2 border-primary/20'>
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name || 'User avatar'}
                />
                <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                  {getInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col space-y-1 flex-1 min-w-0'>
                <p className='text-sm font-semibold leading-none truncate'>
                  {session.user.name}
                </p>
                <p className='text-xs text-muted-foreground leading-none truncate'>
                  {session.user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Main Actions Group */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard'
                className='flex w-full cursor-pointer items-center gap-3 py-2.5'
              >
                <LayoutDashboard className='h-4 w-4 text-primary' />
                <span className='font-medium'>Dashboard</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/my-bookings'
                className='flex w-full cursor-pointer items-center gap-3 py-2.5'
              >
                <Calendar className='h-4 w-4 text-primary' />
                <span className='font-medium'>My Bookings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/wishlist'
                className='flex w-full cursor-pointer items-center gap-3 py-2.5'
              >
                <Heart className='h-4 w-4 text-primary' />
                <span className='font-medium'>Wishlist</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/my-reviews'
                className='flex w-full cursor-pointer items-center gap-3 py-2.5'
              >
                <Star className='h-4 w-4 text-primary' />
                <span className='font-medium'>My Reviews</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Tour Provider Section (if applicable) */}
          {session.user.role === 'PROVIDER' || session.user.role === 'ADMIN' ? (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href='/list-tour'
                    className='flex w-full cursor-pointer items-center gap-3 py-2.5'
                  >
                    <Plus className='h-4 w-4 text-primary' />
                    <span className='font-medium'>List a Tour</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href='/my-tours'
                    className='flex w-full cursor-pointer items-center gap-3 py-2.5'
                  >
                    <MapPin className='h-4 w-4 text-primary' />
                    <span className='font-medium'>My Tours</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
            </>
          ) : null}

          {/* Account Settings Group */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/account/settings'
                className='flex w-full cursor-pointer items-center gap-3 py-2.5'
              >
                <UserCog className='h-4 w-4 text-primary' />
                <span className='font-medium'>Account Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/notifications'
                className='flex w-full cursor-pointer items-center justify-between py-2.5'
              >
                <div className='flex items-center gap-3'>
                  <Bell className='h-4 w-4 text-primary' />
                  <span className='font-medium'>Notifications</span>
                </div>
                <Badge variant='secondary' className='h-5 px-1.5 text-xs'>
                  3
                </Badge>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Support & Help */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href={
                  session.user.role === 'ADMIN' ? '/support/agent' : '/help'
                }
                className='flex w-full cursor-pointer items-center gap-3 py-2.5'
              >
                <Headphones className='h-4 w-4 text-primary' />
                <span className='font-medium'>Help Center</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Sign Out */}
          <SignOut />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
