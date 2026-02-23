'use client';

import {
  AlertTriangle,
  Heart,
  Phone,
  Shield,
  ShieldCheck,
  Stethoscope,
  ThumbsUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ─── Data ─────────────────────────────────────────────────────────────────────
const COMMITMENTS = [
  {
    icon: ShieldCheck,
    title: 'Vetted guides & operators',
    body: 'Every guide on our platform goes through background verification, first-aid certification, and an in-person assessment before leading a tour. We re-evaluate annually.',
  },
  {
    icon: Stethoscope,
    title: 'First aid on every tour',
    body: 'All our guides carry a stocked first aid kit and hold a valid first aid certificate. For remote or multi-day tours, we carry an expanded wilderness kit.',
  },
  {
    icon: AlertTriangle,
    title: 'Weather & route monitoring',
    body: 'We monitor weather and route conditions 48 hours before every departure. If conditions become unsafe, we notify you immediately and offer a full reschedule or refund.',
  },
  {
    icon: Users,
    title: 'Group size limits',
    body: 'Every package has a maximum group size set not just for experience quality but for safety. Smaller groups are easier to manage, track, and evacuate in an emergency.',
  },
  {
    icon: Zap,
    title: 'Emergency protocols',
    body: 'Each tour has a written emergency action plan. Guides know the nearest hospital, police station, and evacuation route for every destination we operate in.',
  },
  {
    icon: Heart,
    title: 'Traveller wellbeing first',
    body: 'We would rather cancel a tour than compromise your safety. Our guides are empowered to call off or cut short any activity if they judge it to be unsafe — no questions asked.',
  },
];

const TRAVELLER_TIPS = [
  {
    number: '01',
    title: 'Carry your ID at all times',
    body: 'Keep your National ID or passport on you throughout the tour. It is required for hotel check-ins, park entries, and emergency identification.',
  },
  {
    number: '02',
    title: 'Share your itinerary',
    body: "Before you depart, share your full tour itinerary with a trusted contact at home — including departure time, accommodation details, and your guide's phone number.",
  },
  {
    number: '03',
    title: "Follow your guide's instructions",
    body: 'Your guide knows the terrain, local conditions, and community customs. Follow their instructions, especially near water, cliffs, or wildlife areas.',
  },
  {
    number: '04',
    title: 'Disclose medical conditions',
    body: 'Let us know about any medical conditions, allergies, or mobility limitations when booking. We treat this information confidentially and use it only to keep you safe.',
  },
  {
    number: '05',
    title: 'Stay with the group',
    body: 'Do not wander off alone, especially in unfamiliar terrain or after dark. If you need to leave the group for any reason, inform your guide first.',
  },
  {
    number: '06',
    title: 'Keep emergency contacts saved',
    body: "Save your guide's number, our 24-hour helpline, and local emergency numbers before you travel. Network coverage can be patchy in remote areas.",
  },
];

const EMERGENCY_CONTACTS = [
  { label: 'Our 24hr helpline', value: '+880 1XXX-XXXXXX' },
  { label: 'Bangladesh Police', value: '999' },
  { label: 'Fire & Civil Defence', value: '199' },
  { label: 'Ambulance (DGHS)', value: '16000' },
  { label: 'Tourist Police helpline', value: '01769-691604' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SafetyPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-0 top-0 h-full w-1/2 bg-linear-to-l from-primary/4 to-transparent pointer-events-none hidden lg:block' />
        <div className='absolute right-8 top-4 font-display text-[9rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          SAFE
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Your Safety
              </span>
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              Safety is not a{' '}
              <span className='italic font-light text-muted-foreground'>
                feature
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed max-w-xl'>
              It is the foundation of everything we do. Before a single
              itinerary is published, we have assessed the route, vetted the
              operators, and prepared for the unexpected. Here is how we keep
              you safe — and how you can help us do it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Our commitments ────────────────────────────────────────────── */}
      <section className='py-14 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-10'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Our Commitments
              </span>
            </div>
            <h2 className='font-display text-2xl sm:text-3xl font-bold'>
              What we do to keep{' '}
              <span className='italic font-light text-muted-foreground'>
                you safe
              </span>
            </h2>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {COMMITMENTS.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className='group rounded-2xl border border-border p-6 hover:border-primary/30 hover:bg-primary/2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors'>
                  <Icon className='w-5 h-5 text-primary' />
                </div>
                <h3 className='font-semibold text-sm mb-2'>{title}</h3>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Traveller tips ──────────────────────────────────────────────── */}
      <section className='py-14 md:py-20 bg-primary/2'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[1fr_1.8fr] gap-12 lg:gap-20 items-start'>
            {/* Left — sticky intro */}
            <div className='lg:sticky lg:top-8'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='h-px w-10 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Traveller Tips
                </span>
              </div>
              <h2 className='font-display text-2xl sm:text-3xl font-bold mb-4'>
                Your role in{' '}
                <span className='italic font-light text-muted-foreground'>
                  staying safe
                </span>
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed mb-6'>
                Safety is a two-way responsibility. Following these guidelines
                helps us help you — and makes every tour better for the whole
                group.
              </p>
              <div className='flex items-center gap-2 text-xs text-primary font-medium'>
                <ThumbsUp className='w-3.5 h-3.5' />
                <span>Applies to all tours and destinations</span>
              </div>
            </div>

            {/* Right — tips list */}
            <div className='space-y-0 divide-y divide-border'>
              {TRAVELLER_TIPS.map(({ number, title, body }, i) => (
                <div
                  key={number}
                  className='flex gap-5 py-6 first:pt-0 last:pb-0 animate-in fade-in slide-in-from-right-4'
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className='font-display text-3xl font-bold text-primary/15 leading-none shrink-0 w-10 text-right'>
                    {number}
                  </span>
                  <div>
                    <h3 className='font-semibold text-sm mb-1.5'>{title}</h3>
                    <p className='text-xs text-muted-foreground leading-relaxed'>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Emergency contacts ──────────────────────────────────────────── */}
      <section className='py-14 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 items-start'>
            <div>
              <div className='flex items-center gap-3 mb-3'>
                <div className='h-px w-10 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Emergency Contacts
                </span>
              </div>
              <h2 className='font-display text-2xl sm:text-3xl font-bold mb-4'>
                Save these{' '}
                <span className='italic font-light text-muted-foreground'>
                  before you go
                </span>
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Network coverage in remote areas can be unreliable. Save these
                numbers offline before your tour — don't rely on being able to
                look them up when you need them.
              </p>
            </div>

            <div className='rounded-2xl border-2 border-border overflow-hidden'>
              {EMERGENCY_CONTACTS.map(({ label, value }) => (
                <div
                  key={label}
                  className='flex items-center justify-between px-5 py-4 border-b border-border last:border-0 hover:bg-primary/2 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                      <Phone className='w-3 h-3 text-primary' />
                    </div>
                    <span className='text-sm text-muted-foreground'>
                      {label}
                    </span>
                  </div>
                  <a
                    href={`tel:${value.replace(/\s/g, '')}`}
                    className='text-sm font-semibold font-mono tracking-wide text-foreground hover:text-primary transition-colors'
                  >
                    {value}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Report a concern CTA ─────────────────────────────────────────── */}
      <section className='py-14 md:py-20 bg-primary/2'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl mx-auto text-center space-y-5'>
            <div className='flex justify-center'>
              <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center'>
                <Shield className='w-7 h-7 text-primary' />
              </div>
            </div>
            <h2 className='font-display text-2xl sm:text-3xl font-bold'>
              Something doesn't feel right?
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              If you ever feel unsafe — before, during, or after a tour — please
              tell us. Every report is taken seriously, investigated promptly,
              and treated with complete confidentiality. Your feedback directly
              shapes how we operate.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center pt-2'>
              <Button asChild size='lg'>
                <Link href='/contact'>Report a concern</Link>
              </Button>
              <Button asChild variant='outline' size='lg'>
                <Link href='/faq'>View FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
