'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  Compass,
  Heart,
  MapPin,
  Send,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

// ─── Schema ───────────────────────────────────────────────────────────────────
const interestSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum([
    'guide',
    'engineering',
    'marketing',
    'operations',
    'design',
    'other',
  ]),
  about: z.string().min(30, 'Tell us a bit more — at least 30 characters'),
  link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type InterestFormValues = z.infer<typeof interestSchema>;

// ─── Data ─────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Compass,
    title: 'We explore first',
    body: "Every destination we sell, we've visited ourselves. We only offer what we genuinely believe in.",
  },
  {
    icon: Heart,
    title: 'People over metrics',
    body: "Traveller experience comes first. If a decision is good for the spreadsheet but bad for the customer, we don't make it.",
  },
  {
    icon: Zap,
    title: 'Move with purpose',
    body: "We're a small team that moves fast — but thoughtfully. Speed without care is just recklessness.",
  },
  {
    icon: Users,
    title: 'Everyone has a voice',
    body: 'Good ideas can come from anywhere. We create space for every team member to shape what we build.',
  },
];

const PERKS = [
  'Free tour on your first month',
  'Flexible working hours',
  'Remote-friendly culture',
  'Annual travel allowance',
  'Learning & development budget',
  'Regular team retreats',
  'Health coverage',
  'A team that genuinely likes each other',
];

const AREAS = [
  { value: 'guide', label: 'Tour guiding' },
  { value: 'engineering', label: 'Engineering / Technology' },
  { value: 'marketing', label: 'Marketing & Content' },
  { value: 'operations', label: 'Operations' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Something else' },
];

// ─── Interest form ────────────────────────────────────────────────────────────
function InterestForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<InterestFormValues>({
    resolver: zodResolver(interestSchema),
    defaultValues: { name: '', email: '', about: '', link: '' },
  });

  const errors = form.formState.errors;

  const onSubmit = async (values: InterestFormValues) => {
    // TODO: replace with real API call

    // biome-ignore lint/suspicious/noConsole: this is fine
    console.log('Interest form:', values);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className='flex flex-col items-center justify-center text-center py-14 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center'>
          <CheckCircle2 className='w-8 h-8 text-primary' />
        </div>
        <div className='space-y-2 max-w-sm'>
          <h3 className='font-display text-xl font-bold'>
            You're on our radar!
          </h3>
          <p className='text-sm text-muted-foreground'>
            Thanks for reaching out. We keep every expression of interest on
            file and will be in touch when something relevant opens up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
      <FieldSet>
        <FieldLegend className='sr-only'>Your details</FieldLegend>
        <FieldGroup className='flex flex-col gap-5'>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor='name'>Full Name</FieldLabel>
              <Input
                id='name'
                placeholder='Sejar Parvez'
                aria-invalid={!!errors.name}
                {...form.register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor='email'>Email Address</FieldLabel>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                aria-invalid={!!errors.email}
                {...form.register('email')}
              />
              <FieldError errors={errors.email ? [errors.email] : undefined} />
            </Field>
          </div>

          <Field data-invalid={!!errors.role}>
            <FieldLabel htmlFor='role'>Area of interest</FieldLabel>
            <Select
              value={form.watch('role')}
              onValueChange={(v) =>
                form.setValue('role', v as InterestFormValues['role'], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id='role' aria-invalid={!!errors.role}>
                <SelectValue placeholder='Where do you see yourself fitting in?' />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={errors.role ? [errors.role] : undefined} />
          </Field>

          <Field data-invalid={!!errors.about}>
            <FieldLabel htmlFor='about'>Tell us about yourself</FieldLabel>
            <Textarea
              id='about'
              placeholder='Who are you, what do you do, and why do you want to work with us?'
              className='min-h-32 resize-none'
              aria-invalid={!!errors.about}
              {...form.register('about')}
            />
            <FieldError errors={errors.about ? [errors.about] : undefined} />
          </Field>

          <Field data-invalid={!!errors.link}>
            <FieldLabel htmlFor='link'>
              Portfolio / LinkedIn / CV link{' '}
              <span className='text-muted-foreground font-normal'>
                (optional)
              </span>
            </FieldLabel>
            <Input
              id='link'
              type='url'
              placeholder='https://'
              aria-invalid={!!errors.link}
              {...form.register('link')}
            />
            <FieldError errors={errors.link ? [errors.link] : undefined} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button
        type='submit'
        size='lg'
        className='w-full gap-2'
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          'Sending…'
        ) : (
          <>
            <Send className='w-4 h-4' />
            Express Interest
          </>
        )}
      </Button>

      <p className='text-xs text-center text-muted-foreground'>
        We read every submission and will reach out when a relevant role opens
        up.
      </p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CareersPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-14 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[6.5rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          CAREERS
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Careers
              </span>
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              Come work with{' '}
              <span className='italic font-light text-muted-foreground'>
                us
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed'>
              We're a small team building something we genuinely believe in —
              making it easier for people to explore the remarkable country they
              live in. If that sounds like your kind of work, we'd love to hear
              from you.
            </p>
          </div>
        </div>
      </section>

      {/* ── No openings — warm state ─────────────────────────────────────── */}
      <section className='py-12 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='h-px w-8 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Open Roles
            </span>
          </div>
          <div className='rounded-2xl border-2 border-dashed border-border p-10 sm:p-14 text-center space-y-4 max-w-2xl'>
            <div className='flex justify-center'>
              <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center'>
                <Sparkles className='w-7 h-7 text-primary' />
              </div>
            </div>
            <div className='space-y-2'>
              <h2 className='font-display text-xl font-bold'>
                No open roles right now
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed max-w-md mx-auto'>
                We're not actively hiring at the moment — but we're growing, and
                that changes. If you're excited about what we're building, fill
                in the form below and we'll reach out when something comes up
                that fits.
              </p>
            </div>
            <div className='flex items-center justify-center gap-2 text-xs text-primary font-medium'>
              <MapPin className='w-3.5 h-3.5' />
              Based in Dhaka, Bangladesh · Remote-friendly
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────────────────── */}
      <section className='py-14 md:py-20 bg-primary/2'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-10'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                How We Work
              </span>
            </div>
            <h2 className='font-display text-2xl sm:text-3xl font-bold'>
              What you'd be{' '}
              <span className='italic font-light text-muted-foreground'>
                joining
              </span>
            </h2>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className='rounded-2xl border border-border p-6 bg-background hover:border-primary/30 hover:bg-primary/2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4'>
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

      {/* ── Perks ───────────────────────────────────────────────────────── */}
      <section className='py-14 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <div className='flex items-center gap-3 mb-3'>
                <div className='h-px w-10 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Perks & Benefits
                </span>
              </div>
              <h2 className='font-display text-2xl sm:text-3xl font-bold mb-4'>
                What we{' '}
                <span className='italic font-light text-muted-foreground'>
                  offer
                </span>
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                We're not a big corporation with a long perks list. But what we
                do offer, we mean — including the free tour, which is mandatory.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {PERKS.map((perk, i) => (
                <div
                  key={perk}
                  className='flex items-center gap-2.5 text-sm animate-in fade-in slide-in-from-right-4'
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <CheckCircle2 className='w-4 h-4 text-primary shrink-0' />
                  <span className='text-muted-foreground'>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Expression of interest form ──────────────────────────────────── */}
      <section className='py-14 md:py-20 bg-primary/2'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start'>
            {/* Left */}
            <div className='lg:sticky lg:top-8'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='h-px w-10 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Stay in Touch
                </span>
              </div>
              <h2 className='font-display text-2xl sm:text-3xl font-bold mb-4'>
                Express your{' '}
                <span className='italic font-light text-muted-foreground'>
                  interest
                </span>
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed mb-6'>
                No open roles right now — but if you think you'd be a great fit
                for what we're building, tell us about yourself. We keep every
                submission on file and will reach out when something relevant
                comes up.
              </p>
              <p className='text-xs text-muted-foreground'>
                We read every message personally. Not a bot, not an ATS — a real
                person.
              </p>
            </div>

            {/* Right */}
            <div className='rounded-2xl border border-border p-6 sm:p-8 bg-background'>
              <InterestForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
