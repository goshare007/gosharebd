'use client';

import {
  FileText,
  Lock,
  Mail,
  RefreshCw,
  Server,
  Share2,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ─── Data ─────────────────────────────────────────────────────────────────────
const LAST_UPDATED = 'February 2026';

const SECTIONS = [
  {
    id: 'what-we-collect',
    icon: FileText,
    title: 'What we collect',
    content: [
      {
        subtitle: 'Account information',
        body: 'When you create an account, we collect your name, email address, and — if you sign in with Google — your profile picture. We do not collect your Google password.',
      },
      {
        subtitle: 'Booking information',
        body: 'When you make a booking, we collect traveller details including full names, genders, National ID or passport numbers, email addresses, and phone numbers for each adult and pre-teen in your group. This is required by tour operators and accommodation providers.',
      },
      {
        subtitle: 'Payment information',
        body: 'We do not store card or banking details on our servers. Payments are processed via bKash, Nagad, or bank transfer. We record only the transaction reference number and payment status.',
      },
      {
        subtitle: 'Usage information',
        body: 'We collect standard server logs — pages visited, time spent, device type, browser, and approximate location derived from IP address. This is used solely to improve our service and diagnose technical issues.',
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: UserCheck,
    title: 'How we use your information',
    content: [
      {
        subtitle: 'To fulfil your booking',
        body: 'Traveller details are shared with our tour guides and, where necessary, accommodation providers and park authorities. This is the primary purpose for collecting personal information and is required to operate the service.',
      },
      {
        subtitle: 'To communicate with you',
        body: 'We use your email address and phone number to send booking confirmations, itinerary updates, and important notices about your tour. We do not send marketing emails unless you have explicitly opted in.',
      },
      {
        subtitle: 'To improve the service',
        body: 'Aggregated, anonymised usage data helps us understand which destinations are popular, where users encounter problems, and how to improve the booking experience. No individual is identifiable from this data.',
      },
      {
        subtitle: 'To comply with the law',
        body: 'Bangladesh tourism regulations may require us to submit traveller registers to relevant authorities for certain national parks, border-adjacent areas, or overnight tours. We will always inform you when this applies to your booking.',
      },
    ],
  },
  {
    id: 'sharing',
    icon: Share2,
    title: 'Who we share it with',
    content: [
      {
        subtitle: 'Tour guides and operators',
        body: 'Guides receive the names, emergency contacts, and any disclosed medical conditions for their group. They do not receive National ID numbers or financial information.',
      },
      {
        subtitle: 'Accommodation providers',
        body: 'For overnight tours, accommodation providers receive the full name and National ID or passport number of each traveller as required by Bangladesh hotel regulations.',
      },
      {
        subtitle: 'Service providers',
        body: 'We use a small number of trusted third-party services to operate our platform — including our cloud infrastructure provider and email delivery service. They process data on our behalf and are contractually bound to protect it.',
      },
      {
        subtitle: 'We never sell your data',
        body: 'We do not sell, rent, or trade personal information to third parties for marketing purposes. Ever.',
      },
    ],
  },
  {
    id: 'storage',
    icon: Server,
    title: 'Storage & security',
    content: [
      {
        subtitle: 'Where your data is stored',
        body: 'Our servers are hosted in data centres that comply with international security standards. All data is encrypted in transit using TLS and at rest using AES-256 encryption.',
      },
      {
        subtitle: 'How long we keep it',
        body: 'Account data is retained for as long as your account is active. Booking records are retained for 5 years after the travel date, as required for tax and regulatory compliance. If you delete your account, personal data is removed within 30 days, except where retention is legally required.',
      },
      {
        subtitle: 'Passwords',
        body: 'Passwords are hashed using industry-standard algorithms and are never stored in plain text. Our team cannot see your password — if you forget it, you must reset it.',
      },
    ],
  },
  {
    id: 'rights',
    icon: ShieldCheck,
    title: 'Your rights',
    content: [
      {
        subtitle: 'Access',
        body: 'You can request a copy of all personal data we hold about you at any time. We will respond within 10 business days.',
      },
      {
        subtitle: 'Correction',
        body: 'If any information we hold is inaccurate, you can update it via your account settings or by contacting us directly.',
      },
      {
        subtitle: 'Deletion',
        body: 'You can delete your account at any time from your account settings. This will remove your personal profile and any data not required for legal or regulatory retention.',
      },
      {
        subtitle: 'Objection',
        body: 'You can object to certain uses of your data — for example, opting out of marketing communications — at any time via your account preferences or by emailing us.',
      },
    ],
  },
  {
    id: 'cookies',
    icon: Lock,
    title: 'Cookies',
    content: [
      {
        subtitle: 'What we use',
        body: 'We use only essential cookies required to operate the site — for example, to keep you logged in between sessions. We do not use advertising or tracking cookies.',
      },
      {
        subtitle: 'Third-party cookies',
        body: 'If you sign in with Google, Google may set cookies in accordance with their own privacy policy. We do not control these cookies.',
      },
    ],
  },
];

const RIGHTS_SUMMARY = [
  { icon: UserCheck, label: 'Access your data' },
  { icon: RefreshCw, label: 'Correct inaccuracies' },
  { icon: Trash2, label: 'Delete your account' },
  { icon: Mail, label: 'Opt out of marketing' },
];

// ─── Section Block ────────────────────────────────────────────────────────────
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
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Section header */}
      <div className='flex items-center gap-3 mb-5'>
        <div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
          <Icon className='w-4 h-4 text-primary' />
        </div>
        <h2 className='font-display text-xl font-bold'>{section.title}</h2>
      </div>

      {/* Sub-sections */}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[8rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          PRIVACY
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
              Privacy{' '}
              <span className='italic font-light text-muted-foreground'>
                policy
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed mb-5'>
              We believe privacy policies should be readable. This one explains
              in plain language what data we collect, why we collect it, and
              what rights you have over it.
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

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[220px_1fr] gap-12 lg:gap-16 items-start'>
            {/* ── Sidebar TOC ──────────────────────────────────────────── */}
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

              {/* Your rights summary card */}
              <div className='mt-8 pt-6 border-t border-border'>
                <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3 px-3'>
                  Your rights at a glance
                </p>
                <div className='space-y-2 px-3'>
                  {RIGHTS_SUMMARY.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className='flex items-center gap-2 text-xs text-muted-foreground'
                    >
                      <Icon className='w-3 h-3 text-primary shrink-0' />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Policy content ───────────────────────────────────────── */}
            <div className='space-y-12'>
              {/* Intro note */}
              <div className='rounded-2xl bg-primary/5 border border-primary/15 p-5'>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  This policy applies to all services operated by our platform,
                  including the website, mobile app, and booking system. By
                  using our services, you agree to the collection and use of
                  information as described here. If you have questions, email us
                  at{' '}
                  <a
                    href='mailto:privacy@yourtours.com'
                    className='text-primary underline underline-offset-2 hover:no-underline'
                  >
                    privacy@yourtours.com
                  </a>
                  .
                </p>
              </div>

              {/* Policy sections */}
              {SECTIONS.map((section, i) => (
                <div key={section.id}>
                  <PolicySection section={section} index={i} />
                  {i < SECTIONS.length - 1 && <Separator className='mt-12' />}
                </div>
              ))}

              {/* Changes to this policy */}
              <Separator />
              <div id='changes' className='scroll-mt-8'>
                <div className='flex items-center gap-3 mb-5'>
                  <div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                    <RefreshCw className='w-4 h-4 text-primary' />
                  </div>
                  <h2 className='font-display text-xl font-bold'>
                    Changes to this policy
                  </h2>
                </div>
                <div className='pl-12 space-y-3'>
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    We may update this policy from time to time. When we make
                    significant changes, we will notify you by email and update
                    the "Last updated" date at the top of this page. Continued
                    use of our services after changes are published constitutes
                    acceptance of the updated policy.
                  </p>
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    Minor changes — such as clarifications or corrections — will
                    be updated without individual notification.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <Separator />
              <div className='rounded-2xl border-2 border-dashed border-border p-8 text-center space-y-3'>
                <p className='font-display text-lg font-semibold'>
                  Questions about your privacy?
                </p>
                <p className='text-sm text-muted-foreground'>
                  Email us at{' '}
                  <a
                    href='mailto:privacy@yourtours.com'
                    className='text-primary underline underline-offset-2 hover:no-underline'
                  >
                    privacy@yourtours.com
                  </a>{' '}
                  and we'll respond within 2 business days.
                </p>
                <div className='flex flex-col sm:flex-row gap-3 justify-center pt-1'>
                  <Button asChild>
                    <Link href='/contact'>Contact us</Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href='/faq'>View FAQs</Link>
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
