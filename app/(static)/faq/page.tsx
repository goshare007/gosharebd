'use client';

import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    id: 'booking',
    label: 'Booking',
    questions: [
      {
        q: 'How do I book a tour package?',
        a: 'Browse our packages, choose one that suits you, and click "Book Now". You\'ll need to be logged in, then fill in your group details, travel date, and traveller information. After reviewing the summary, confirm your booking — we\'ll get back to you within 24 hours.',
      },
      {
        q: 'Do I need an account to book?',
        a: 'Yes. An account lets us send you booking confirmations, keep your booking history in one place, and handle any changes or cancellations smoothly. Signing up takes under a minute and you can use Google to log in instantly.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 7 days in advance for domestic tours and 14–21 days for longer packages. Popular tours during Eid, Puja holidays, and long weekends fill up quickly — for those, book 4–6 weeks ahead.',
      },
      {
        q: 'Can I book for a group?',
        a: "Absolutely. Our booking form supports groups up to the package's maximum size. You can add adults, pre-teens (11–14), children (6–10), and under-5s separately. Each adult and pre-teen will need their own details entered.",
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & Payment',
    questions: [
      {
        q: 'How is the tour price calculated?',
        a: 'Pricing is based on a per-person base rate that varies by age tier. Adults pay the full rate, pre-teens (11–14) pay 75%, children (6–10) pay 50%, and under-5s travel free. A 15% VAT is added to the subtotal, as required by Bangladesh tax regulations.',
      },
      {
        q: 'When do I pay?',
        a: "After your booking request is confirmed by our team, we'll send you payment instructions. We currently support bKash, Nagad, bank transfer, and cash payment at our office. Full payment is required to secure your spot.",
      },
      {
        q: 'Are there any hidden fees?',
        a: "No hidden fees. The total shown at checkout — including VAT — is what you pay. The only potential extras are optional activities or personal expenses during the tour that aren't part of the package.",
      },
      {
        q: 'Do you offer group discounts?',
        a: "We offer negotiated rates for groups of 10 or more. Contact us directly for a custom quote — we're happy to work with corporate teams, school trips, and large families.",
      },
    ],
  },
  {
    id: 'cancellation',
    label: 'Cancellation & Changes',
    questions: [
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made 7 or more days before the travel date receive a full refund. Cancellations within 3–6 days receive a 50% refund. Cancellations within 48 hours are non-refundable. In cases of natural disaster or government-declared emergency, we offer full refunds or free rescheduling.',
      },
      {
        q: 'Can I change my travel date after booking?',
        a: "Yes, date changes are free if requested 5 or more days before departure, subject to availability. Changes within 5 days may incur a ৳500 rescheduling fee. Contact us as early as possible and we'll do our best to accommodate you.",
      },
      {
        q: 'What happens if the tour is cancelled by you?',
        a: "If we cancel a tour for any reason — weather, insufficient group size, unforeseen circumstances — you'll receive a full refund within 3–5 business days, or the option to reschedule at no extra charge.",
      },
    ],
  },
  {
    id: 'tours',
    label: 'During the Tour',
    questions: [
      {
        q: 'What is included in the package price?',
        a: "Each package page lists exactly what's included and excluded. Typically included: transportation, accommodation (for overnight tours), guided activities, and entry fees. Typically excluded: meals unless stated, personal shopping, and optional add-ons.",
      },
      {
        q: 'Are your tours suitable for children?',
        a: 'Most of our tours welcome children, with age-appropriate activities. Each package page notes any age restrictions. For very young children, we recommend checking the physical demand level listed on the package before booking.',
      },
      {
        q: 'What should I bring on the tour?',
        a: "A detailed packing list is sent with your confirmation. Generally: national ID or passport (required for all adults), comfortable walking shoes, weather-appropriate clothing, any personal medication, and a small day bag. We'll handle the rest.",
      },
      {
        q: 'Is there a tour guide?',
        a: "Yes. All our packages include an experienced, English and Bengali speaking guide. They're your point of contact throughout the tour and are responsible for keeping the itinerary on track while making room for spontaneous moments.",
      },
    ],
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────
function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className={cn(
        'border-b border-border last:border-0 transition-colors',
        isOpen && 'bg-primary/2',
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <button
        type='button'
        onClick={onToggle}
        className='w-full flex items-start justify-between gap-4 py-5 px-1 text-left group'
      >
        <span
          className={cn(
            'text-sm font-medium leading-snug transition-colors',
            isOpen
              ? 'text-primary'
              : 'text-foreground group-hover:text-primary',
          )}
        >
          {question}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 shrink-0 mt-0.5 text-muted-foreground transition-transform duration-300',
            isOpen && 'rotate-180 text-primary',
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className='overflow-hidden'>
          <p className='text-sm text-muted-foreground leading-relaxed pb-5 px-1 pr-8'>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────
function CategorySection({
  category,
  openId,
  onToggle,
}: {
  category: (typeof FAQ_CATEGORIES)[number];
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      {/* Category header */}
      <div className='flex items-center gap-3 mb-2'>
        <div className='h-px w-6 bg-primary' />
        <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
          {category.label}
        </span>
      </div>

      {/* Questions */}
      <div className='border border-border rounded-2xl px-5 divide-y-0'>
        {category.questions.map((item, i) => {
          const id = `${category.id}-${i}`;
          return (
            <AccordionItem
              key={id}
              question={item.q}
              answer={item.a}
              isOpen={openId === id}
              onToggle={() => onToggle(id)}
              index={i}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>('booking-0');
  const [activeCategory, setActiveCategory] = useState('booking');

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    document.getElementById(`category-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        {/* Decorative number */}
        <div className='absolute right-8 top-4 font-display text-[10rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          FAQ
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Help Centre
              </span>
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              Frequently asked{' '}
              <span className='italic font-light text-muted-foreground'>
                questions
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed'>
              Everything you need to know about booking a tour, pricing,
              cancellations, and what to expect on the day. Can't find an
              answer?{' '}
              <Link
                href='/contact'
                className='text-primary underline underline-offset-2 hover:no-underline'
              >
                Get in touch.
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[220px_1fr] gap-12 lg:gap-16 items-start'>
            {/* ── Sidebar nav ──────────────────────────────────────────── */}
            <div className='lg:sticky lg:top-8 space-y-1'>
              <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3 px-3'>
                Categories
              </p>
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type='button'
                  onClick={() => scrollToCategory(cat.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    activeCategory === cat.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  {cat.label}
                </button>
              ))}

              {/* Contact card */}
              <div className='mt-8 pt-6 border-t border-border'>
                <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3 px-3'>
                  Still need help?
                </p>
                <div className='space-y-2 px-1'>
                  {[
                    {
                      icon: Phone,
                      label: '+880 1XXX-XXXXXX',
                      href: 'tel:+8801000000000',
                    },
                    {
                      icon: Mail,
                      label: 'hello@yourtours.com',
                      href: 'mailto:hello@yourtours.com',
                    },
                    {
                      icon: MessageCircle,
                      label: 'Live chat',
                      href: '/contact',
                    },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className='flex items-center gap-2.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 rounded-md hover:bg-primary/5'
                    >
                      <Icon className='w-3.5 h-3.5 shrink-0' />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── FAQ list ─────────────────────────────────────────────── */}
            <div className='space-y-10'>
              {FAQ_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  id={`category-${cat.id}`}
                  className='scroll-mt-8'
                >
                  <CategorySection
                    category={cat}
                    openId={openId}
                    onToggle={handleToggle}
                  />
                </div>
              ))}

              {/* Still not answered CTA */}
              <div className='rounded-2xl border-2 border-dashed border-border p-8 text-center space-y-3'>
                <p className='font-display text-lg font-semibold'>
                  Didn't find your answer?
                </p>
                <p className='text-sm text-muted-foreground'>
                  Our team typically responds within a few hours during business
                  hours.
                </p>
                <Button asChild className='mt-1'>
                  <Link href='/contact'>Contact us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
