'use client';

import {
  BarChart3,
  Bell,
  Calendar,
  Compass,
  CreditCard,
  FileText,
  Headphones,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  Star,
  User,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

// Define the structure for Nav Item
interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  role?: ('ADMIN' | 'USER')[]; // Role array
  badge?: number; // Optional badge count
}

// Navigation data for travel/tour website
export const data: { navMain: NavItem[]; navSecondary: NavItem[] } = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'My Profile',
      url: '/dashboard/profile',
      icon: User,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'My Bookings',
      url: '/my-bookings',
      icon: Calendar,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'Wishlist',
      url: '/wishlist',
      icon: Heart,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'My Reviews',
      url: '/my-reviews',
      icon: Star,
      role: ['ADMIN', 'USER'],
    },

    // Admin-specific items
    {
      title: 'Manage Tours',
      url: '/admin/tours',
      icon: Package,
      role: ['ADMIN'],
    },
    {
      title: 'All Bookings',
      url: '/dashboard/admin/bookings',
      icon: FileText,
      role: ['ADMIN'],
    },
    {
      title: 'All Users',
      url: '/admin/users',
      icon: Users,
      role: ['ADMIN'],
    },
    {
      title: 'Destinations',
      url: '/dashboard/admin/destinations',
      icon: MapPin,
      role: ['ADMIN'],
    },
    {
      title: 'Analytics',
      url: '/admin/analytics',
      icon: BarChart3,
      role: ['ADMIN'],
    },

    // General items
    {
      title: 'Payment Methods',
      url: '/payments',
      icon: CreditCard,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: Bell,
      role: ['ADMIN', 'USER'],
      badge: 3, // Example badge
    },
    {
      title: 'Settings',
      url: '/account/settings',
      icon: Settings,
      role: ['ADMIN', 'USER'],
    },
  ],

  navSecondary: [
    {
      title: 'Customer Support',
      url: '/support',
      icon: Headphones,
      role: ['ADMIN', 'USER'],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();

  // Get the current user's role
  const userRole = session?.user?.role;

  // Filter navigation items based on user's role
  const filteredNavMain = data.navMain.filter((item) => {
    if (isPending || !userRole) {
      return false;
    }

    if (item.role) {
      return item.role.includes(userRole as 'ADMIN' | 'USER');
    }

    return false;
  });

  // Loading state
  if (isPending) {
    return (
      <Sidebar collapsible='offcanvas' {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Skeleton className='h-12 w-full' />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className='space-y-2 p-4'>
            {[...Array(8)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter>
          <Skeleton className='h-16 w-full' />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Compass />
              </div>
              <div className='flex flex-col'>
                <h1 className='text-xl font-bold tracking-tight'>
                  <span className='text-primary'>GoShare</span>
                  <span className='font-semibold'>BD</span>
                </h1>
                <span className='text-xs text-muted-foreground'>
                  Tour & Travel
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
