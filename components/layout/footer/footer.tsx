'use client';

import {
  Compass,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';
import Newsletter from './newsletter';

// ── Data ──────────────────────────────────────────────────────────────────────

const nav = [
  {
    label: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    label: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Safety', href: '/safety' },
      { label: 'FAQs', href: '/faq' },
    ],
  },
  {
    label: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
];

const social = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Twitter, label: 'Twitter / X', href: 'https://twitter.com' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
];

const contact = [
  {
    icon: Mail,
    label: 'info@gosharebd.com',
    href: 'mailto:info@gosharebd.com',
  },
  { icon: Phone, label: '+880 123 456 7890', href: 'tel:+8801234567890' },
  { icon: MapPin, label: 'Dhaka, Bangladesh', href: null },
];

// ── Footer ────────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className='bg-background border-t border-border'>
      {/* Newsletter */}
      <Newsletter />

      {/* Main content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12'>
          {/* ── Brand column ── */}
          <div className='col-span-2 space-y-6'>
            {/* Logo */}
            <div className='flex items-center gap-2.5'>
              <div className='w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0'>
                <Compass className='w-5 h-5 text-primary-foreground' />
              </div>
              <span className='font-bold text-lg tracking-tight'>
                GoShareBD
              </span>
            </div>

            {/* Tagline */}
            <p className='text-sm text-muted-foreground leading-relaxed max-w-xs'>
              Discover authentic travel experiences across Bangladesh — from
              mangrove forests to mountain peaks, guided by locals who love
              their home.
            </p>

            {/* Contact info — matches contact page channel cards */}
            <div className='space-y-2.5'>
              {contact.map(({ icon: Icon, label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    className='flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group'
                  >
                    <Icon className='w-3.5 h-3.5 text-primary shrink-0' />
                    {label}
                  </a>
                ) : (
                  <div
                    key={label}
                    className='flex items-center gap-2.5 text-sm text-muted-foreground'
                  >
                    <Icon className='w-3.5 h-3.5 text-primary shrink-0' />
                    {label}
                  </div>
                ),
              )}
            </div>

            {/* Social icons — border style matching contact page */}
            <div className='flex items-center gap-2'>
              {social.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200'
                >
                  <Icon className='w-4 h-4' />
                </a>
              ))}
            </div>
          </div>

          {/* ── Nav columns ── */}
          {nav.map((col) => (
            <div key={col.label}>
              {/* Column header — editorial rule pattern */}
              <div className='flex items-center gap-2.5 mb-5'>
                <div className='h-px w-5 bg-primary' />
                <span className='text-[10px] font-semibold tracking-[0.2em] uppercase text-primary'>
                  {col.label}
                </span>
              </div>
              <ul className='space-y-3'>
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className='text-sm text-muted-foreground hover:text-primary transition-colors duration-200'
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar — same divided pattern ── */}
        <div className='border-t border-border pt-8'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-xs text-muted-foreground'>
              © {new Date().getFullYear()} GoShareBD. All rights reserved.
            </p>

            <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
              <span className='w-1 h-1 rounded-full bg-primary/50' />
              <span>Secure Payment</span>
              <span className='w-1 h-1 rounded-full bg-primary/50 ml-1' />
              <span>100% Verified Tours</span>
              <span className='w-1 h-1 rounded-full bg-primary/50 ml-1' />
              <span>Local Guides</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
