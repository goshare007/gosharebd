'use client';

import { Cookie, Lock, RefreshCw, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const LAST_UPDATED = 'February 2026';

const COOKIE_TYPES = [
  {
    name: 'Essential cookies',
    required: true,
    description: 'Required for the site to function. Cannot be disabled.',
    examples: [
      {
        name: 'session',
        purpose: 'Keeps you logged in between page visits',
        expiry: 'Session',
      },
      {
        name: 'csrf_token',
        purpose: 'Protects against cross-site request forgery attacks',
        expiry: 'Session',
      },
      {
        name: 'theme',
        purpose: 'Remembers your light/dark mode preference',
        expiry: '1 year',
      },
    ],
  },
  {
    name: 'Analytics cookies',
    required: false,
    description:
      'Help us understand how visitors use the site. All data is anonymised.',
    examples: [
      {
        name: '_ga',
        purpose: 'Distinguishes unique users (Google Analytics)',
        expiry: '2 years',
      },
      {
        name: '_ga_*',
        purpose: 'Stores session state (Google Analytics)',
        expiry: '2 years',
      },
    ],
  },
];

const SECTIONS = [
  {
    id: 'what-are-cookies',
    icon: Cookie,
    title: 'What are cookies?',
    content: [
      {
        subtitle: 'A brief explanation',
        body: 'Cookies are small text files that a website stores on your device when you visit. They are widely used to make sites work, remember your preferences, and provide information to the site owners. Cookies cannot run programs or carry viruses.',
      },
      {
        subtitle: 'Similar technologies',
        body: 'We may also use local storage — a browser feature similar to cookies — to store your preferences locally on your device. This is used solely for functional purposes like remembering your theme preference.',
      },
    ],
  },
  {
    id: 'what-we-use',
    icon: Settings,
    title: 'What we use',
    content: [
      {
        subtitle: 'Essential cookies only by default',
        body: 'We only set cookies that are strictly necessary to operate the site by default. We do not use advertising cookies, tracking pixels, or behavioural profiling of any kind.',
      },
      {
        subtitle: 'Optional analytics',
        body: 'With your consent, we use Google Analytics to understand aggregate traffic patterns — which pages are visited, how users navigate the site, and where they encounter problems. This data is anonymised and cannot be used to identify individuals.',
      },
      {
        subtitle: 'No third-party advertising',
        body: 'We do not allow any advertising networks to set cookies on our site. You will never see retargeting ads as a result of visiting us.',
      },
    ],
  },
  {
    id: 'third-party',
    icon: Shield,
    title: 'Third-party cookies',
    content: [
      {
        subtitle: 'Google sign-in',
        body: "If you choose to sign in with Google, Google may set cookies on your device in accordance with their own privacy policy. We do not control these cookies. You can review Google's cookie policy at policies.google.com.",
      },
      {
        subtitle: 'No embedded social media',
        body: 'We do not embed social media widgets (Facebook Like buttons, Twitter feeds, etc.) on our site. Those widgets are known to set tracking cookies regardless of whether you interact with them — we have chosen not to include them.',
      },
    ],
  },
  {
    id: 'your-choices',
    icon: Lock,
    title: 'Your choices',
    content: [
      {
        subtitle: 'Browser settings',
        body: 'You can configure your browser to refuse all cookies, accept only certain cookies, or notify you when a cookie is set. Most browsers provide clear instructions in their Help menu. Note that disabling essential cookies will prevent you from logging in and using the booking system.',
      },
      {
        subtitle: 'Opting out of analytics',
        body: 'You can opt out of Google Analytics across all sites using the Google Analytics Opt-out Browser Add-on, available at tools.google.com/dlpage/gaoptout.',
      },
      {
        subtitle: 'Withdrawing consent',
        body: 'If you have previously consented to analytics cookies and wish to withdraw that consent, you can do so via your account preferences or by clearing your cookies and declining when prompted again.',
      },
    ],
  },
  {
    id: 'updates',
    icon: RefreshCw,
    title: 'Updates to this policy',
    content: [
      {
        subtitle: 'How we notify you',
        body: 'If we start using new types of cookies — particularly any that go beyond essential functionality — we will update this policy and seek your consent before setting them. The "Last updated" date at the top of this page will always reflect the most recent revision.',
      },
    ],
  },
];

function PolicySection({
  section,
  index,
}: {
  section: (typeof SECTIONS)[number];
  index: number;
}) {
  const Icon = section.icon;
  return (
    <div
      id={section.id}
      className='scroll-mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700'
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className='flex items-center gap-3 mb-5'>
        <div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
          <Icon className='w-4 h-4 text-primary' />
        </div>
        <h2 className='font-display text-xl font-bold'>{section.title}</h2>
      </div>
      <div className='space-y-5 pl-12'>
        {section.content.map(({ subtitle, body }) => (
          <div key={subtitle}>
            <h3 className='text-sm font-semibold mb-1.5'>{subtitle}</h3>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[7rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          COOKIES
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Legal
              </span>
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              Cookie{' '}
              <span className='italic font-light text-muted-foreground'>
                policy
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed mb-5'>
              We keep our cookie usage minimal and transparent. This page
              explains exactly what we set, why, and how you can control it.
            </p>
            <p className='text-xs text-muted-foreground'>
              Last updated:{' '}
              <span className='font-medium text-foreground'>
                {LAST_UPDATED}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Cookie table ────────────────────────────────────────────────── */}
      <section className='py-10 border-b border-border bg-muted/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8'>
          <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
            Cookies we set
          </p>
          {COOKIE_TYPES.map((type) => (
            <div key={type.name}>
              <div className='flex items-center gap-3 mb-3'>
                <h3 className='text-sm font-semibold'>{type.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    type.required
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {type.required ? 'Always active' : 'Optional'}
                </span>
              </div>
              <p className='text-xs text-muted-foreground mb-3'>
                {type.description}
              </p>
              <div className='rounded-xl border border-border overflow-hidden'>
                <table className='w-full text-xs'>
                  <thead>
                    <tr className='bg-muted/40 border-b border-border'>
                      <th className='text-left px-4 py-2.5 font-semibold text-muted-foreground'>
                        Name
                      </th>
                      <th className='text-left px-4 py-2.5 font-semibold text-muted-foreground hidden sm:table-cell'>
                        Purpose
                      </th>
                      <th className='text-left px-4 py-2.5 font-semibold text-muted-foreground'>
                        Expiry
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {type.examples.map((cookie, i) => (
                      <tr
                        key={cookie.name}
                        className={
                          i < type.examples.length - 1
                            ? 'border-b border-border'
                            : ''
                        }
                      >
                        <td className='px-4 py-3 font-mono text-foreground'>
                          {cookie.name}
                        </td>
                        <td className='px-4 py-3 text-muted-foreground hidden sm:table-cell'>
                          {cookie.purpose}
                        </td>
                        <td className='px-4 py-3 text-muted-foreground'>
                          {cookie.expiry}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[220px_1fr] gap-12 lg:gap-16 items-start'>
            {/* Sidebar TOC */}
            <div className='lg:sticky lg:top-8 space-y-1'>
              <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3 px-3'>
                Contents
              </p>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className='flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors'
                >
                  <s.icon className='w-3.5 h-3.5 shrink-0 text-primary/60' />
                  {s.title}
                </a>
              ))}

              <div className='mt-8 pt-6 border-t border-border px-3 space-y-3'>
                <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
                  Related
                </p>
                {[
                  { label: 'Privacy Policy', href: '/privacy-policy' },
                  { label: 'Terms of Service', href: '/terms' },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className='block text-xs text-muted-foreground hover:text-primary transition-colors'
                  >
                    → {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className='space-y-12'>
              {SECTIONS.map((section, i) => (
                <div key={section.id}>
                  <PolicySection section={section} index={i} />
                  {i < SECTIONS.length - 1 && <Separator className='mt-12' />}
                </div>
              ))}

              <Separator />

              <div className='rounded-2xl border-2 border-dashed border-border p-8 text-center space-y-3'>
                <p className='font-display text-lg font-semibold'>
                  Questions about cookies?
                </p>
                <p className='text-sm text-muted-foreground'>
                  Email us at{' '}
                  <a
                    href='mailto:privacy@yourtours.com'
                    className='text-primary underline underline-offset-2 hover:no-underline'
                  >
                    privacy@yourtours.com
                  </a>
                </p>
                <div className='flex flex-col sm:flex-row gap-3 justify-center pt-1'>
                  <Button asChild>
                    <Link href='/contact'>Contact us</Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href='/privacy-policy'>Privacy Policy</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
