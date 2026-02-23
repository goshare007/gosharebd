'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Youtube,
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
import { cn } from '@/lib/utils';

// ─── Schema ───────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.enum([
    'booking',
    'cancellation',
    'payment',
    'safety',
    'feedback',
    'other',
  ]),
  message: z.string().min(20, 'Please write at least 20 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// ─── Data ─────────────────────────────────────────────────────────────────────
const CONTACT_CHANNELS = [
  {
    icon: Phone,
    label: 'Call us',
    value: '+880 1XXX-XXXXXX',
    sublabel: 'Sat–Thu, 9am–7pm',
    href: 'tel:+8801000000000',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'hello@yourtours.com',
    sublabel: 'We reply within 24 hours',
    href: 'mailto:hello@yourtours.com',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+880 1XXX-XXXXXX',
    sublabel: 'Quick questions',
    href: 'https://wa.me/8801000000000',
  },
  {
    icon: MapPin,
    label: 'Visit us',
    value: 'Dhaka, Bangladesh',
    sublabel: 'By appointment only',
    href: 'https://maps.google.com',
  },
];

const SUBJECTS = [
  { value: 'booking', label: 'Booking enquiry' },
  { value: 'cancellation', label: 'Cancellation / refund' },
  { value: 'payment', label: 'Payment issue' },
  { value: 'safety', label: 'Safety concern' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Something else' },
];

const SOCIAL = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

const RESPONSE_TIMES = [
  { channel: 'Phone', time: 'Immediate', available: 'Sat–Thu, 9am–7pm' },
  { channel: 'WhatsApp', time: 'Under 1 hour', available: 'Sat–Thu, 9am–9pm' },
  { channel: 'Email', time: 'Within 24 hrs', available: 'Every day' },
  { channel: 'Contact form', time: 'Within 24 hrs', available: 'Every day' },
];

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessMessage({
  name,
  onReset,
}: {
  name: string;
  onReset: () => void;
}) {
  return (
    <div className='flex flex-col items-center justify-center text-center py-16 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center'>
        <CheckCircle2 className='w-8 h-8 text-primary' />
      </div>
      <div className='space-y-2 max-w-sm'>
        <h3 className='font-display text-xl font-bold'>Message sent!</h3>
        <p className='text-sm text-muted-foreground'>
          Thanks {name} — we've received your message and will get back to you
          within 24 hours.
        </p>
      </div>
      <Button variant='outline' size='sm' onClick={onReset}>
        Send another message
      </Button>
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  const errors = form.formState.errors;

  const onSubmit = async (values: ContactFormValues) => {
    // TODO: replace with real API call
    // biome-ignore lint/suspicious/noConsole: this is fine
    console.log('Contact form:', values);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SuccessMessage
        name={form.getValues('name').split(' ')[0]}
        onReset={() => {
          form.reset();
          setSubmitted(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
      <FieldSet>
        <FieldLegend className='sr-only'>Your details</FieldLegend>
        <FieldGroup className='flex flex-col gap-5'>
          <div className='grid sm:grid-cols-2 gap-4'>
            {/* Name */}
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

            {/* Email */}
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

          <div className='grid sm:grid-cols-2 gap-4'>
            {/* Phone */}
            <Field>
              <FieldLabel htmlFor='phone'>
                Phone{' '}
                <span className='text-muted-foreground font-normal'>
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id='phone'
                placeholder='+880 1XXX-XXXXXX'
                {...form.register('phone')}
              />
            </Field>

            {/* Subject */}
            <Field data-invalid={!!errors.subject}>
              <FieldLabel htmlFor='subject'>Subject</FieldLabel>
              <Select
                value={form.watch('subject')}
                onValueChange={(v) =>
                  form.setValue('subject', v as ContactFormValues['subject'], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id='subject' aria-invalid={!!errors.subject}>
                  <SelectValue placeholder='Select a topic' />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={errors.subject ? [errors.subject] : undefined}
              />
            </Field>
          </div>

          {/* Message */}
          <Field data-invalid={!!errors.message}>
            <FieldLabel htmlFor='message'>Message</FieldLabel>
            <Textarea
              id='message'
              placeholder='Tell us how we can help...'
              className='min-h-32 resize-none'
              aria-invalid={!!errors.message}
              {...form.register('message')}
            />
            <FieldError
              errors={errors.message ? [errors.message] : undefined}
            />
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
            Send Message
          </>
        )}
      </Button>

      <p className='text-xs text-center text-muted-foreground'>
        We typically respond within 24 hours. For urgent matters, please call us
        directly.
      </p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[8rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          HELLO
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Get in touch
              </span>
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              We'd love to{' '}
              <span className='italic font-light text-muted-foreground'>
                hear
              </span>{' '}
              from you
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed'>
              Whether you have a question about a tour, need to make a change,
              or just want to say hello — we're here. Pick the channel that
              works best for you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact channels ────────────────────────────────────────────── */}
      <section className='py-10 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {CONTACT_CHANNELS.map(
              ({ icon: Icon, label, value, sublabel, href }, i) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel='noreferrer'
                  className='group rounded-2xl border border-border p-5 hover:border-primary/30 hover:bg-primary/2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors'>
                    <Icon className='w-5 h-5 text-primary' />
                  </div>
                  <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1'>
                    {label}
                  </p>
                  <p className='text-sm font-semibold text-foreground group-hover:text-primary transition-colors'>
                    {value}
                  </p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {sublabel}
                  </p>
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16 items-start'>
            {/* ── Left sidebar ─────────────────────────────────────────── */}
            <div className='space-y-8'>
              {/* Response times */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='h-px w-8 bg-primary' />
                  <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                    Response Times
                  </span>
                </div>
                <div className='rounded-2xl border border-border overflow-hidden'>
                  {RESPONSE_TIMES.map(({ channel, time, available }, i) => (
                    <div
                      key={channel}
                      className={cn(
                        'flex items-center justify-between px-4 py-3.5',
                        i < RESPONSE_TIMES.length - 1 &&
                          'border-b border-border',
                      )}
                    >
                      <div>
                        <p className='text-sm font-medium'>{channel}</p>
                        <p className='text-xs text-muted-foreground'>
                          {available}
                        </p>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <Clock className='w-3 h-3 text-primary' />
                        <span className='text-xs font-semibold text-primary'>
                          {time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office hours */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='h-px w-8 bg-primary' />
                  <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                    Office Hours
                  </span>
                </div>
                <div className='rounded-2xl border border-border overflow-hidden'>
                  {[
                    { day: 'Saturday – Thursday', hours: '9:00am – 7:00pm' },
                    { day: 'Friday', hours: 'Closed' },
                    { day: 'Public holidays', hours: 'Closed' },
                  ].map(({ day, hours }, i) => (
                    <div
                      key={day}
                      className={cn(
                        'flex justify-between px-4 py-3',
                        i < 2 && 'border-b border-border',
                      )}
                    >
                      <span className='text-sm text-muted-foreground'>
                        {day}
                      </span>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          hours === 'Closed'
                            ? 'text-muted-foreground/60'
                            : 'text-foreground',
                        )}
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='h-px w-8 bg-primary' />
                  <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                    Follow Us
                  </span>
                </div>
                <div className='flex gap-3'>
                  {SOCIAL.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className='w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all'
                    >
                      <Icon className='w-4 h-4' />
                    </a>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Help links */}
              <div className='space-y-2'>
                <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
                  Quick links
                </p>
                {[
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Help Centre', href: '/help' },
                  { label: 'Refund Policy', href: '/refund-policy' },
                  { label: 'Safety Page', href: '/safety' },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className='block text-sm text-muted-foreground hover:text-primary transition-colors py-1'
                  >
                    → {label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Right: form ──────────────────────────────────────────── */}
            <div>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-px w-8 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Send a Message
                </span>
              </div>
              <div className='rounded-2xl border border-border p-6 sm:p-8'>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
