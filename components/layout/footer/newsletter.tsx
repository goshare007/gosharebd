'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useSubscribe } from '@/services/subscribe';

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const { mutate, isPending } = useSubscribe();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: FormData) => {
    mutate(
      { email: data.email, source: 'newsletter_form' },
      {
        onSuccess: () => {
          setSubscribed(true);
          reset();
        },
        onError: (err) => {
          setError('email', {
            message:
              (err as { response?: { data?: { error?: string } } })?.response
                ?.data?.error ?? 'Something went wrong.',
          });
        },
      },
    );
  };

  return (
    <div className='border-b border-border'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          {/* Left — editorial label + headline */}
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Newsletter
              </span>
            </div>
            <h3 className='text-2xl md:text-3xl font-bold tracking-tight leading-tight'>
              Stay{' '}
              <span className='italic font-light text-muted-foreground'>
                inspired
              </span>
              <span className='text-primary'>.</span>
            </h3>
            <p className='text-sm text-muted-foreground leading-relaxed max-w-sm'>
              Special offers, travel guides, and hidden gems — delivered to your
              inbox.
            </p>
          </div>

          {/* Right — form or success */}
          {subscribed ? (
            <div className='flex items-center gap-3 rounded-2xl border border-border px-5 py-4'>
              <div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                <CheckCircle2 className='w-4 h-4 text-primary' />
              </div>
              <div>
                <p className='text-sm font-semibold'>You&apos;re subscribed!</p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  We&apos;ll be in touch soon.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Field className='flex-1' data-invalid={!!errors.email}>
                  <Input
                    type='email'
                    placeholder='your@email.com'
                    className='h-11 rounded-xl'
                    disabled={isPending}
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>
                <Button
                  type='submit'
                  className='h-11 px-6 gap-2 whitespace-nowrap self-start'
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Send className='w-4 h-4' />
                  )}
                  {isPending ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
