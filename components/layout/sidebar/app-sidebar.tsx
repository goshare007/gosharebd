'use client';

import {
  Bell,
  Calendar,
  Compass,
  FileText,
  Headphones,
  Heart,
  LayoutDashboard,
  Package,
  Settings,
  Star,
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
      title: 'My Bookings',
      url: '/dashboard/my-bookings',
      icon: Calendar,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'Wishlist',
      url: '/dashboard/wishlist',
      icon: Heart,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'My Reviews',
      url: '/dashboard/my-reviews',
      icon: Star,
      role: ['ADMIN', 'USER'],
    },

    // Admin-specific items
    {
      title: 'Manage Packages',
      url: '/dashboard/admin/packages',
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
      url: '/dashboard/admin/users',
      icon: Users,
      role: ['ADMIN'],
    },

    // General items

    {
      title: 'Notifications',
      url: '/dashboard/notifications',
      icon: Bell,
      role: ['ADMIN', 'USER'],
      badge: 3, // Example badge
    },
    {
      title: 'Settings',
      url: '/dashboard/account/settings',
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
                  <span>GoShare</span>
                  <span className='font-semibold text-primary'>BD</span>
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
