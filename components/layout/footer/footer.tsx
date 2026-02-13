'use client';
import {
  Compass,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className='bg-linear-to-b from-background to-secondary/20 border-t border-border'>
      {/* Newsletter Section */}
      <div className='border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid md:grid-cols-2 gap-8 items-center'>
            <div className='space-y-2'>
              <h3 className='text-2xl md:text-3xl font-bold'>Stay Updated</h3>
              <p className='text-muted-foreground'>
                Subscribe to get special offers, free giveaways, and travel
                inspiration.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Input
                type='email'
                placeholder='Enter your email'
                className='h-12'
              />
              <Button className='h-12 px-6 gap-2 whitespace-nowrap'>
                Subscribe
                <Send className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12'>
          {/* Brand Column */}
          <div className='space-y-4 col-span-2'>
            <div className='flex items-center gap-2'>
              <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
                <Compass className='w-6 h-6 text-primary-foreground' />
              </div>
              <span className='font-bold text-xl'>GoShareBD</span>
            </div>
            <p className='text-sm text-muted-foreground max-w-xs leading-relaxed'>
              Discover authentic travel experiences across Bangladesh. Join
              thousands of travelers exploring hidden gems with local expert
              guides.
            </p>
            {/* Contact Info */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Mail className='w-4 h-4 text-primary' />
                <a
                  href='mailto:info@gosharebd.com'
                  className='hover:text-foreground transition-colors'
                >
                  info@gosharebd.com
                </a>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Phone className='w-4 h-4 text-primary' />
                <a
                  href='tel:+8801234567890'
                  className='hover:text-foreground transition-colors'
                >
                  +880 123 456 7890
                </a>
              </div>
              <div className='flex items-start gap-2 text-sm text-muted-foreground'>
                <MapPin className='w-4 h-4 text-primary mt-0.5' />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className='font-semibold mb-4 text-foreground'>Company</h3>
            <ul className='space-y-3'>
              <li>
                <a
                  href='/about'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='/careers'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href='/blog'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href='/press'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className='font-semibold mb-4 text-foreground'>Support</h3>
            <ul className='space-y-3'>
              <li>
                <a
                  href='/help'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href='/contact'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href='/safety'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Safety
                </a>
              </li>
              <li>
                <a
                  href='/faq'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className='font-semibold mb-4 text-foreground'>Legal</h3>
            <ul className='space-y-3'>
              <li>
                <a
                  href='/privacy'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='/terms'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href='/cookies'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href='/refund'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-border pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            {/* Copyright */}
            <p className='text-sm text-muted-foreground text-center md:text-left'>
              © 2026 GoShareBD. All rights reserved.
            </p>

            {/* Social Media Links */}
            <div className='flex items-center gap-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center group'
              >
                <Facebook className='w-4 h-4' />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center group'
              >
                <Instagram className='w-4 h-4' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center group'
              >
                <Twitter className='w-4 h-4' />
              </a>
              <a
                href='https://youtube.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center group'
              >
                <Youtube className='w-4 h-4' />
              </a>
            </div>

            {/* Payment/Trust Badges */}
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span>Secure Payment</span>
              <span>•</span>
              <span>100% Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
