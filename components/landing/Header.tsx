import { Button } from '@/components/ui/button';
import { ModeToggle } from '../layout/header/theme-toggle';

export default function Header() {
  return (
    <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border dark:bg-black/80'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>GS</span>
          </div>
          <span className='font-bold text-lg text-foreground'>GoShareBD</span>
        </div>
        <div className='hidden md:flex items-center gap-8'>
          <a
            href='#destinations'
            className='text-sm text-muted-foreground hover:text-foreground transition'
          >
            About
          </a>
          <a
            href='#destinations'
            className='text-sm text-muted-foreground hover:text-foreground transition'
          >
            Package
          </a>
          <a
            href='#destinations'
            className='text-sm text-muted-foreground hover:text-foreground transition'
          >
            Book a Tour
          </a>
          <a
            href='#features'
            className='text-sm text-muted-foreground hover:text-foreground transition'
          >
            Festivals
          </a>
          <a
            href='#destinations'
            className='text-sm text-muted-foreground hover:text-foreground transition'
          >
            Gallery
          </a>
          <a
            href='#testimonials'
            className='text-sm text-muted-foreground hover:text-foreground transition'
          >
            Reviews
          </a>
          <ModeToggle />
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='ghost'>Log in</Button>
          <Button>Sign up</Button>
        </div>
      </div>
    </nav>
  );
}
