'use client';

import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
    badge?: number;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;

          // Fix: Logic to prevent double-highlighting
          // isExactActive: Only true if the URL is an exact match
          const isExactActive = pathname === item.url;

          // isParentOfActive: True if the current path is a sub-route of this item
          const isParentOfActive = pathname.startsWith(`${item.url}/`);

          const hasSubItems = item.items && item.items.length > 0;

          // If item has sub-items, render as collapsible
          if (hasSubItems) {
            return (
              <Collapsible
                key={item.title}
                asChild
                // Open the menu if we are on the main page OR a sub-page
                defaultOpen={isExactActive || isParentOfActive}
                className='group/collapsible'
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className='w-full'
                      // Only highlight the parent if we are exactly on its URL
                      isActive={isExactActive}
                    >
                      {Icon && <Icon className='w-4 h-4' />}
                      <span className='flex-1'>{item.title}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge
                          variant='secondary'
                          className='h-5 px-1.5 text-xs'
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRightIcon className='ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        // Sub-items usually only highlight on exact match
                        const isSubActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // Regular menu item without sub-items
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isExactActive}
              >
                <Link
                  href={item.url}
                  className='flex items-center gap-3 w-full'
                >
                  {Icon && <Icon className='w-4 h-4' />}
                  <span className='flex-1'>{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant='secondary' className='h-5 px-1.5 text-xs'>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
