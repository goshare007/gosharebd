export default function Footer() {
  return (
    <footer className='bg-foreground text-white py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>GS</span>
              </div>
              <span className='font-bold text-lg'>GoShareBD</span>
            </div>
            <p className='text-sm opacity-80'>
              Discover authentic travel experiences with GoShareBD.
            </p>
          </div>
          <div>
            <h3 className='font-semibold mb-4'>Company</h3>
            <ul className='space-y-2 text-sm opacity-80'>
              <li>
                <a href='/about' className='hover:opacity-100 transition'>
                  About Us
                </a>
              </li>
              <li>
                <a href='/careers' className='hover:opacity-100 transition'>
                  Careers
                </a>
              </li>
              <li>
                <a href='/blog' className='hover:opacity-100 transition'>
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-4'>Support</h3>
            <ul className='space-y-2 text-sm opacity-80'>
              <li>
                <a href='/help' className='hover:opacity-100 transition'>
                  Help Center
                </a>
              </li>
              <li>
                <a href='/contact' className='hover:opacity-100 transition'>
                  Contact
                </a>
              </li>
              <li>
                <a href='/safety' className='hover:opacity-100 transition'>
                  Safety
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-4'>Legal</h3>
            <ul className='space-y-2 text-sm opacity-80'>
              <li>
                <a href='/privacy' className='hover:opacity-100 transition'>
                  Privacy
                </a>
              </li>
              <li>
                <a href='/terms' className='hover:opacity-100 transition'>
                  Terms
                </a>
              </li>
              <li>
                <a href='/cookies' className='hover:opacity-100 transition'>
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t border-white/10 pt-8'>
          <p className='text-sm opacity-80 text-center'>
            © 2026 GoShareBD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
