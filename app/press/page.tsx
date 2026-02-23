'use client';

import { ExternalLink, Mail, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ─── Data ─────────────────────────────────────────────────────────────────────
const COVERAGE = [
  {
    outlet: 'The Daily Star',
    category: 'Travel',
    title:
      'How local tour platforms are reshaping weekend travel in Bangladesh',
    excerpt:
      'A new wave of curated domestic tour operators is making it easier than ever for Bangladeshis to explore their own backyard — and one platform is leading the charge.',
    date: 'January 2026',
    href: '#',
    logo: 'TDS',
  },
  {
    outlet: 'Prothom Alo',
    category: 'Lifestyle',
    title: 'দেশের ভেতরে ভ্রমণের নতুন অভিজ্ঞতা',
    excerpt:
      'স্থানীয় পর্যটনকে নতুনভাবে সংজ্ঞায়িত করছে একটি প্ল্যাটফর্ম — যেখানে নিরাপত্তা, স্বচ্ছতা এবং অভিজ্ঞতা একসাথে পাওয়া যায়।',
    date: 'December 2025',
    href: '#',
    logo: 'PA',
  },
  {
    outlet: 'Business Standard BD',
    category: 'Technology',
    title:
      'Bangladeshi travel startups see surge in domestic bookings post-pandemic',
    excerpt:
      'Domestic tourism platforms are reporting record booking numbers as travellers increasingly opt for local experiences over international travel.',
    date: 'November 2025',
    href: '#',
    logo: 'BS',
  },
  {
    outlet: 'Dhaka Tribune',
    category: 'Travel',
    title:
      'The Sundarbans is back — and these tour operators are making it accessible',
    excerpt:
      'With improved access and safety protocols, the Sundarbans is seeing a tourism revival. We spoke to the operators making it happen responsibly.',
    date: 'October 2025',
    href: '#',
    logo: 'DT',
  },
  {
    outlet: 'The Financial Express BD',
    category: 'Business',
    title:
      'Tourism tech: local platforms bridge the gap between travellers and operators',
    excerpt:
      'Technology-enabled tour booking platforms are transforming how Bangladeshis plan and book travel, bringing transparency to a traditionally opaque industry.',
    date: 'September 2025',
    href: '#',
    logo: 'FE',
  },
  {
    outlet: 'New Age Bangladesh',
    category: 'Feature',
    title: "Eco-tourism in Cox's Bazar: beyond the beach",
    excerpt:
      "A growing number of travellers are looking for more than just the shoreline. We explore how responsible tour operators are expanding the Cox's Bazar experience.",
    date: 'August 2025',
    href: '#',
    logo: 'NA',
  },
];

const STATS = [
  { value: '5,000+', label: 'Happy travellers' },
  { value: '50+', label: 'Destinations' },
  { value: '4.8', label: 'Average rating' },
  { value: '2023', label: 'Founded' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PressPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[8rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          PRESS
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Press & Media
              </span>
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              In the{' '}
              <span className='italic font-light text-muted-foreground'>
                news
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed mb-6'>
              We're proud to be covered by some of Bangladesh's leading
              publications. For press enquiries, interviews, or media assets,
              get in touch with our press team directly.
            </p>
            <a
              href='mailto:press@yourtours.com'
              className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4'
            >
              <Mail className='w-4 h-4' />
              press@yourtours.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <section className='border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 sm:grid-cols-4 divide-x divide-border'>
            {STATS.map(({ value, label }) => (
              <div key={label} className='py-8 px-6 text-center'>
                <p className='font-display text-3xl sm:text-4xl font-bold text-primary'>
                  {value}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coverage ────────────────────────────────────────────────────── */}
      <section className='py-14 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-10'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                As Seen In
              </span>
            </div>
            <h2 className='font-display text-2xl sm:text-3xl font-bold'>
              Recent{' '}
              <span className='italic font-light text-muted-foreground'>
                coverage
              </span>
            </h2>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {COVERAGE.map(
              ({ outlet, category, title, excerpt, date, href, logo }, i) => (
                <a
                  key={outlet}
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  className='group rounded-2xl border border-border p-6 hover:border-primary/30 hover:bg-primary/2 transition-all duration-300 flex flex-col animate-in fade-in slide-in-from-bottom-4'
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Outlet header */}
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                        <span className='text-xs font-bold text-primary font-mono'>
                          {logo}
                        </span>
                      </div>
                      <div>
                        <p className='text-sm font-semibold leading-none'>
                          {outlet}
                        </p>
                        <p className='text-xs text-muted-foreground mt-0.5'>
                          {category} · {date}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className='w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0' />
                  </div>

                  <Separator className='mb-4' />

                  {/* Article content */}
                  <h3 className='text-sm font-semibold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2'>
                    {title}
                  </h3>
                  <p className='text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1'>
                    {excerpt}
                  </p>

                  <div className='flex items-center gap-1.5 mt-4 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Newspaper className='w-3 h-3' />
                    Read article
                  </div>
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Press contact CTA ────────────────────────────────────────────── */}
      <section className='py-14 md:py-20 bg-primary/2'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-xl mx-auto text-center space-y-5'>
            <div className='flex justify-center'>
              <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center'>
                <Newspaper className='w-7 h-7 text-primary' />
              </div>
            </div>
            <div className='space-y-2'>
              <h2 className='font-display text-2xl sm:text-3xl font-bold'>
                Working on a story?
              </h2>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                We're happy to assist journalists and content creators with
                interviews, data, photography, and access to our team. We
                typically respond to press enquiries within one business day.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 justify-center pt-2'>
              <Button asChild size='lg'>
                <a href='mailto:press@yourtours.com'>
                  <Mail className='w-4 h-4 mr-2' />
                  Email press team
                </a>
              </Button>
              <Button asChild variant='outline' size='lg'>
                <Link href='/contact'>General contact</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
