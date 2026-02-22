'use client';

import { Menu, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ModeToggle } from './theme-toggle';
import UserDropDown from './user';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Packages', href: '/packages' },
  { name: 'Festivals', href: '/festivals' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Reviews', href: '/reviews' },
];

export default function Header() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={cn(
        // CHANGED: sticky instead of fixed, removed w-full
        'sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      <div className='flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* LEFT SIDE: Sidebar Trigger (Desktop) + Mobile Menu */}
        <div className='flex items-center gap-2'>
          <div className='md:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='shrink-0'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-70'>
                <SheetHeader>
                  <SheetTitle className='text-left text-primary font-bold'>
                    GoShareBD
                  </SheetTitle>
                </SheetHeader>
                <div className='grid gap-6 p-6'>
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'font-semibold transition-colors hover:text-primary',
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-foreground/70',
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href='/'
            className='flex items-center transition-opacity hover:opacity-90'
          >
            <span className='text-2xl font-bold tracking-tighter text-foreground'>
              GoShare<span className='text-primary'>BD</span>
            </span>
          </Link>
        </div>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className='hidden lg:flex items-center gap-6'>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground',
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className='flex items-center gap-2'>
          <div className='hidden sm:flex items-center gap-2'>
            <Button variant='outline' size='sm' asChild>
              <Link href='/book' className='gap-2'>
                <Plus className='w-4 h-4' />
                Book Now
              </Link>
            </Button>
          </div>
          <ModeToggle />
          <UserDropDown />
        </div>
      </div>
    </nav>
  );
}
