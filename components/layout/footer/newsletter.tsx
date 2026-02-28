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
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          <div className='space-y-2'>
            <h3 className='text-2xl md:text-3xl font-bold'>Stay Updated</h3>
            <p className='text-muted-foreground'>
              Subscribe to get special offers, free giveaways, and travel
              inspiration.
            </p>
          </div>

          {subscribed ? (
            <div className='flex items-center gap-3 p-4 rounded-xl border-2 border-emerald-500/20 bg-emerald-500/10 animate-in fade-in slide-in-from-bottom duration-300'>
              <CheckCircle2 className='w-5 h-5 text-emerald-600 shrink-0' />
              <p className='text-sm font-medium text-emerald-700'>
                You&apos;re subscribed! We&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Field className='flex-1' data-invalid={!!errors.email}>
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    className='h-12'
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
                  className='h-12 px-6 gap-2 whitespace-nowrap self-start'
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Send className='w-4 h-4' />
                  )}
                  {isPending ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
