'use client';

import {
  AlertCircle,
  BadgeCheck,
  CalendarX,
  CreditCard,
  HelpCircle,
  RefreshCw,
  Umbrella,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const LAST_UPDATED = 'February 2026';

// ─── Cancellation tiers ───────────────────────────────────────────────────────
const CANCELLATION_TIERS = [
  {
    window: '7+ days before',
    refund: '100%',
    label: 'Full refund',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900',
    bar: 'bg-green-500',
    barWidth: 'w-full',
  },
  {
    window: '3–6 days before',
    refund: '50%',
    label: 'Partial refund',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900',
    bar: 'bg-amber-500',
    barWidth: 'w-1/2',
  },
  {
    window: 'Within 48 hours',
    refund: '0%',
    label: 'No refund',
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
    bar: 'bg-red-400',
    barWidth: 'w-0',
  },
];

const SECTIONS = [
  {
    id: 'cancellation-by-you',
    icon: CalendarX,
    title: 'Cancellation by you',
    content: [
      {
        subtitle: '7 or more days before departure',
        body: 'You are entitled to a full refund of all amounts paid. No cancellation fee applies. Refunds are processed within 5–7 business days to your original payment method.',
      },
      {
        subtitle: '3 to 6 days before departure',
        body: 'A 50% refund of the total booking amount is issued. The remaining 50% covers costs already committed to guides, accommodation, and transport that cannot be recovered at short notice.',
      },
      {
        subtitle: 'Within 48 hours of departure',
        body: 'No refund is available. At this point, all operational costs for the tour have been committed. We strongly recommend purchasing travel insurance to cover last-minute cancellations.',
      },
      {
        subtitle: 'No-shows',
        body: 'If you fail to show up at the departure point without prior notice, no refund will be issued. This is treated the same as a cancellation within 48 hours.',
      },
    ],
  },
  {
    id: 'cancellation-by-us',
    icon: Umbrella,
    title: 'Cancellation by us',
    content: [
      {
        subtitle: 'Full refund or free reschedule',
        body: 'If we cancel a tour for any reason — including unsafe weather, insufficient group size, guide unavailability, or unforeseen operational issues — you will receive a full refund of all amounts paid, or the option to reschedule to any available date at no extra charge.',
      },
      {
        subtitle: 'Force majeure',
        body: 'In cases of natural disaster, government travel restrictions, civil emergency, or other events entirely beyond our control, we will offer a full credit valid for 12 months or a refund minus any non-recoverable third-party costs (e.g. pre-paid park fees). We will always be transparent about what costs have been incurred.',
      },
      {
        subtitle: 'Notification',
        body: 'We will notify you of any cancellation as early as possible — typically at least 48 hours before departure, except in sudden emergencies. Notification will be via the email and phone number on your booking.',
      },
    ],
  },
  {
    id: 'date-changes',
    icon: RefreshCw,
    title: 'Date changes & rescheduling',
    content: [
      {
        subtitle: 'Free rescheduling (5+ days notice)',
        body: 'You can change your travel date once for free if you notify us at least 5 days before the original departure date, subject to availability on your preferred new date.',
      },
      {
        subtitle: 'Late rescheduling fee',
        body: 'Date changes requested within 5 days of departure are subject to a ৳500 rescheduling fee, again subject to availability. This fee covers the administrative cost of reassigning your spot.',
      },
      {
        subtitle: 'Price difference',
        body: 'If your new travel date falls in a different pricing period, you will be charged or refunded the difference. We will inform you of any price change before confirming the reschedule.',
      },
    ],
  },
  {
    id: 'refund-process',
    icon: CreditCard,
    title: 'How refunds are processed',
    content: [
      {
        subtitle: 'Timeline',
        body: 'Refunds are initiated within 2 business days of confirmation. The time for funds to appear in your account depends on the payment method: bKash and Nagad typically within 24 hours; bank transfers within 3–5 business days.',
      },
      {
        subtitle: 'Payment method',
        body: 'Refunds are issued to the original payment method used for the booking. We cannot redirect a refund to a different account or method.',
      },
      {
        subtitle: 'Partial bookings',
        body: 'If only some travellers in a group cancel, the refund is calculated proportionally based on their share of the total booking price, subject to the same cancellation window rules.',
      },
    ],
  },
  {
    id: 'non-refundable',
    icon: AlertCircle,
    title: 'Non-refundable items',
    content: [
      {
        subtitle: 'Add-ons and extras',
        body: 'Optional add-ons purchased separately — such as equipment rental, photography packages, or special activity upgrades — are non-refundable unless we cancel the tour.',
      },
      {
        subtitle: 'Third-party bookings',
        body: "If your tour package includes components booked through third parties (e.g. ferry tickets, domestic flights, national park permits), those components are subject to the third party's own refund policy, which may be more restrictive.",
      },
    ],
  },
  {
    id: 'special-circumstances',
    icon: BadgeCheck,
    title: 'Special circumstances',
    content: [
      {
        subtitle: 'Medical emergencies',
        body: 'If you or an immediate family member experiences a serious medical emergency that prevents travel, we will consider a full refund or credit on a case-by-case basis upon receipt of a medical certificate. Contact us as soon as possible.',
      },
      {
        subtitle: 'Compassionate grounds',
        body: 'We review cancellations due to bereavement, serious illness, or other exceptional circumstances with discretion and compassion. We will always try to find a fair resolution. Please reach out directly rather than assuming the standard policy applies.',
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

export default function RefundPolicyPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[7rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          REFUNDS
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
              Refund{' '}
              <span className='italic font-light text-muted-foreground'>
                policy
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed mb-5'>
              Plans change — we understand. Here is exactly what happens to your
              money if you need to cancel or reschedule, with no small print.
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

      {/* ── Visual cancellation summary ─────────────────────────────────── */}
      <section className='py-10 border-b border-border bg-muted/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-5'>
            Cancellation at a glance
          </p>
          <div className='grid sm:grid-cols-3 gap-4'>
            {CANCELLATION_TIERS.map(
              ({ window, refund, label, color, bg, bar, barWidth }) => (
                <div
                  key={window}
                  className={cn('rounded-2xl border p-5 space-y-3', bg)}
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-medium text-muted-foreground'>
                      {window}
                    </span>
                    <span
                      className={cn('text-xl font-display font-bold', color)}
                    >
                      {refund}
                    </span>
                  </div>
                  {/* Refund bar */}
                  <div className='h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10'>
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        bar,
                        barWidth,
                      )}
                    />
                  </div>
                  <p className={cn('text-xs font-semibold', color)}>{label}</p>
                </div>
              ),
            )}
          </div>
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
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Privacy Policy', href: '/privacy-policy' },
                  { label: 'FAQ', href: '/faq' },
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

              {/* Travel insurance nudge */}
              <div className='mt-6 mx-1 rounded-xl bg-primary/5 border border-primary/15 p-4 space-y-2'>
                <div className='flex items-center gap-2'>
                  <HelpCircle className='w-3.5 h-3.5 text-primary shrink-0' />
                  <p className='text-xs font-semibold text-primary'>Tip</p>
                </div>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Travel insurance can cover cancellations outside our refund
                  window. We recommend getting a policy before you book.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className='space-y-12'>
              <div className='rounded-2xl bg-primary/5 border border-primary/15 p-5'>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  This policy applies to all bookings made through our platform.
                  By confirming a booking you agree to these terms. For
                  cancellations or refund requests, contact us at{' '}
                  <a
                    href='mailto:bookings@yourtours.com'
                    className='text-primary underline underline-offset-2 hover:no-underline'
                  >
                    bookings@yourtours.com
                  </a>{' '}
                  or via your account dashboard.
                </p>
              </div>

              {SECTIONS.map((section, i) => (
                <div key={section.id}>
                  <PolicySection section={section} index={i} />
                  {i < SECTIONS.length - 1 && <Separator className='mt-12' />}
                </div>
              ))}

              <Separator />

              <div className='rounded-2xl border-2 border-dashed border-border p-8 text-center space-y-3'>
                <p className='font-display text-lg font-semibold'>
                  Need to cancel or reschedule?
                </p>
                <p className='text-sm text-muted-foreground'>
                  Get in touch as early as possible — the sooner you contact us,
                  the more options we have.
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
