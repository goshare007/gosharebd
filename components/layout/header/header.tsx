'use client';

import { Compass, Menu, Plus } from 'lucide-react';
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
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
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
        'sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      <div className='flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* ── Left: mobile menu + logo ── */}
        <div className='flex items-center gap-2'>
          {/* Mobile hamburger */}
          <div className='lg:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='shrink-0'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-72 p-0'>
                <SheetHeader className='px-6 py-5 border-b border-border'>
                  {/* Logo — matches footer logo treatment */}
                  <SheetTitle asChild>
                    <Link href='/' className='flex items-center gap-2.5'>
                      <div className='w-8 h-8 bg-primary rounded-xl flex items-center justify-center shrink-0'>
                        <Compass className='w-4 h-4 text-primary-foreground' />
                      </div>
                      <span className='font-bold text-base tracking-tight text-foreground'>
                        GoShare<span className='text-primary'>BD</span>
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Nav links */}
                <div className='flex flex-col px-4 py-4 gap-1'>
                  {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:text-primary hover:bg-primary/5',
                        )}
                      >
                        {active && (
                          <span className='w-1 h-4 rounded-full bg-primary shrink-0' />
                        )}
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Book Now */}
                <div className='px-4 pt-2 mt-auto border-t border-border'>
                  <Button asChild className='w-full gap-2 mt-4 mb-4'>
                    <Link href='/book'>
                      <Plus className='w-4 h-4' />
                      Book Now
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            href='/'
            className='flex items-center gap-2 transition-opacity hover:opacity-90'
          >
            <span className='text-xl font-bold tracking-tight text-foreground'>
              GoShare<span className='text-primary'>BD</span>
            </span>
          </Link>
        </div>

        {/* ── Center: desktop nav ── */}
        <div className='hidden lg:flex items-center gap-1'>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary group',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {item.name}
                {/* Active underline — h-px rule from design system */}
                <span
                  className={cn(
                    'absolute bottom-0 left-3 right-3 h-px bg-primary transition-all duration-200',
                    active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40',
                  )}
                />
              </Link>
            );
          })}
        </div>

        {/* ── Right: actions ── */}
        <div className='flex items-center gap-1.5'>
          <ModeToggle />
          {/* Book Now — primary, drives conversion */}
          <Button
            size='sm'
            asChild
            className='hidden sm:flex gap-2'
            variant='outline'
          >
            <Link href='/book'>
              <Plus className='w-4 h-4' />
              Book Now
            </Link>
          </Button>

          {/* Ghost mode toggle — no border box */}
          <UserDropDown />
        </div>
      </div>
    </nav>
  );
}
