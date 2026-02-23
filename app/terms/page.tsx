'use client';

import {
  AlertTriangle,
  BookOpen,
  FileText,
  Gavel,
  Lock,
  Scale,
  ShieldAlert,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const LAST_UPDATED = 'February 2026';

const SECTIONS = [
  {
    id: 'acceptance',
    icon: BookOpen,
    title: 'Acceptance of terms',
    content: [
      {
        subtitle: 'Agreement to terms',
        body: 'By accessing or using our platform — including browsing, creating an account, or making a booking — you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.',
      },
      {
        subtitle: 'Eligibility',
        body: 'You must be at least 18 years old to create an account or make a booking. By using the platform you confirm that you meet this requirement. A booking made by a person under 18 must be completed by a parent or legal guardian.',
      },
      {
        subtitle: 'Changes to terms',
        body: 'We may update these terms at any time. Significant changes will be communicated by email. Continued use of the platform after changes are published constitutes your acceptance of the revised terms.',
      },
    ],
  },
  {
    id: 'bookings',
    icon: FileText,
    title: 'Bookings & reservations',
    content: [
      {
        subtitle: 'Booking confirmation',
        body: 'A booking is confirmed only after you receive a written confirmation from us. Submitting a booking request does not guarantee availability. We reserve the right to decline any booking request.',
      },
      {
        subtitle: 'Accuracy of information',
        body: 'You are responsible for ensuring all traveller information provided during booking — including names, ID numbers, ages, and contact details — is accurate. Errors that result in issues during the tour (e.g. hotel check-in rejection, park entry denial) are your responsibility.',
      },
      {
        subtitle: 'Lead booker responsibility',
        body: 'The person making the booking (the lead booker) accepts these terms on behalf of all travellers in the group and is responsible for ensuring all group members are aware of and comply with tour rules and safety guidelines.',
      },
      {
        subtitle: 'Package contents',
        body: 'Each package listing specifies what is included and excluded. We reserve the right to substitute activities, accommodation, or transport with equivalent alternatives where necessary due to weather, safety, availability, or other circumstances beyond our control.',
      },
    ],
  },
  {
    id: 'payments',
    icon: Scale,
    title: 'Payments & pricing',
    content: [
      {
        subtitle: 'Pricing',
        body: 'All prices displayed are in Bangladeshi Taka (৳) and inclusive of 15% VAT where applicable. Prices are subject to change at any time before a booking is confirmed. Once confirmed, the price is locked.',
      },
      {
        subtitle: 'Payment obligation',
        body: 'Full payment is required within the timeframe specified in your booking confirmation. Failure to complete payment by the deadline may result in automatic cancellation of the booking.',
      },
      {
        subtitle: 'Pricing errors',
        body: 'In the event of a pricing error on our platform, we are not obligated to honour the incorrect price. We will contact you promptly to either offer the correct price or cancel the booking with a full refund.',
      },
    ],
  },
  {
    id: 'cancellations',
    icon: AlertTriangle,
    title: 'Cancellations & changes',
    content: [
      {
        subtitle: 'Cancellation by you',
        body: 'Cancellations are subject to our Refund Policy, which is incorporated into these terms by reference. Please review it before booking.',
      },
      {
        subtitle: 'Cancellation by us',
        body: 'We reserve the right to cancel any tour at any time due to safety concerns, insufficient group size, natural disasters, government restrictions, or other circumstances beyond our control. In such cases you will receive a full refund or the option to reschedule at no extra cost.',
      },
      {
        subtitle: 'Itinerary changes',
        body: 'We reserve the right to modify itineraries for safety, weather, or operational reasons. Changes to the fundamental nature of a package (e.g. the primary destination) entitle you to a full refund if you do not wish to proceed.',
      },
    ],
  },
  {
    id: 'conduct',
    icon: UserX,
    title: 'Traveller conduct',
    content: [
      {
        subtitle: 'Expected behaviour',
        body: 'All travellers are expected to behave respectfully toward guides, other travellers, local communities, and the natural environment. Harassment, discrimination, or disruptive behaviour will not be tolerated.',
      },
      {
        subtitle: 'Guide authority',
        body: 'Our guides have the authority to make decisions on safety, timing, and group management. Any traveller who refuses to follow reasonable safety instructions may be removed from the tour without refund.',
      },
      {
        subtitle: 'Prohibited activities',
        body: 'You must not engage in any illegal activity during a tour, damage natural or cultural sites, or act in a way that endangers yourself or others. You are responsible for any costs, fines, or legal consequences arising from your own conduct.',
      },
    ],
  },
  {
    id: 'liability',
    icon: ShieldAlert,
    title: 'Liability',
    content: [
      {
        subtitle: 'Limitation of liability',
        body: 'To the fullest extent permitted by applicable law, our total liability to you for any claim arising from use of the platform or participation in a tour is limited to the amount you paid for the booking in question.',
      },
      {
        subtitle: 'Force majeure',
        body: 'We are not liable for failure to perform our obligations due to circumstances beyond our reasonable control, including natural disasters, government actions, civil unrest, pandemics, or extreme weather events.',
      },
      {
        subtitle: 'Personal risk',
        body: 'Outdoor and adventure activities carry inherent risk. By booking a tour you acknowledge this and accept that some level of risk is unavoidable. We strongly recommend obtaining adequate travel insurance before your tour.',
      },
      {
        subtitle: 'Travel insurance',
        body: 'We strongly recommend that all travellers obtain comprehensive travel insurance covering medical expenses, trip cancellation, and personal liability before booking. We do not provide insurance.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: Lock,
    title: 'Intellectual property',
    content: [
      {
        subtitle: 'Our content',
        body: 'All content on the platform — including text, photographs, itineraries, brand elements, and code — is owned by or licensed to us. You may not reproduce, distribute, or use our content for commercial purposes without written permission.',
      },
      {
        subtitle: 'Your content',
        body: 'If you submit reviews, photographs, or other content to the platform, you grant us a non-exclusive, royalty-free licence to use, display, and share that content in connection with our services. You retain ownership of your content.',
      },
    ],
  },
  {
    id: 'governing-law',
    icon: Gavel,
    title: 'Governing law & disputes',
    content: [
      {
        subtitle: 'Applicable law',
        body: "These terms are governed by the laws of the People's Republic of Bangladesh. Any disputes arising from these terms or your use of the platform will be subject to the exclusive jurisdiction of the courts of Bangladesh.",
      },
      {
        subtitle: 'Informal resolution',
        body: 'Before initiating any formal legal proceedings, we ask that you contact us to attempt an informal resolution. Most issues can be resolved quickly through direct communication.',
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

export default function TermsOfServicePage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[7.5rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          TERMS
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
              Terms of{' '}
              <span className='italic font-light text-muted-foreground'>
                service
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed mb-5'>
              These terms govern your use of our platform and the bookings you
              make through it. Please read them — they are written to be
              understood, not to hide behind.
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
                  { label: 'Refund Policy', href: '/refund-policy' },
                  { label: 'Cookie Policy', href: '/cookie-policy' },
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
              <div className='rounded-2xl bg-primary/5 border border-primary/15 p-5'>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  These Terms of Service ("Terms") constitute a legally binding
                  agreement between you and us. They apply to all users of the
                  platform. If you have questions, contact us at{' '}
                  <a
                    href='mailto:legal@yourtours.com'
                    className='text-primary underline underline-offset-2 hover:no-underline'
                  >
                    legal@yourtours.com
                  </a>
                  .
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
                  Questions about these terms?
                </p>
                <p className='text-sm text-muted-foreground'>
                  Email{' '}
                  <a
                    href='mailto:legal@yourtours.com'
                    className='text-primary underline underline-offset-2 hover:no-underline'
                  >
                    legal@yourtours.com
                  </a>{' '}
                  and we'll respond within 2 business days.
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
