'use client';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signIn } from '@/lib/auth-client';

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSocialLogin(provider: 'google' | 'facebook') {
    setIsLoading(true);

    try {
      await signIn.social({
        provider: provider,
        callbackURL: '/dashboard',
        errorCallbackURL: '/auth/error',
      });

      // 2. Add a success toast for initiating the redirect/sign-in process
      toast.success(
        `Redirecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        {
          description:
            'Please complete the sign-in process in the pop-up or new tab.',
          duration: 2000,
        },
      );
    } catch (_err) {
      // 3. Improved Error Toast
      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

      toast.error(`Sign-in Failed via ${providerName}`, {
        description:
          'There was an issue initiating the connection. Please check your network and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='min-h-screen  flex items-center justify-center bg-linear-to-br from-background via-secondary/20 to-background p-4'>
      <div className='w-full max-w-md relative z-10'>
        {/* Logo/Brand */}
        <div className='text-center mb-8 animate-in fade-in slide-in-from-top duration-700'>
          <Link href='/' className='inline-block'>
            <h1 className='text-3xl font-bold tracking-tighter'>
              GoShare<span className='text-primary'>BD</span>
            </h1>
            <p className='text-sm text-muted-foreground mt-2'>
              Your Gateway to Bangladesh
            </p>
          </Link>
        </div>

        {/* Sign In Card */}
        <Card
          className='border-2 shadow-xl animate-in fade-in slide-in-from-bottom duration-700'
          style={{ animationDelay: '100ms' }}
        >
          <CardHeader className='text-center space-y-2 pb-4'>
            <CardTitle className='text-2xl md:text-3xl font-bold'>
              Welcome Back
            </CardTitle>
            <CardDescription className='text-base'>
              Sign in to access your account and start exploring
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6 pt-2'>
            {/* Google Sign In Button */}
            <Button
              className='w-full cursor-pointer py-5'
              size='lg'
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <svg
                className='mr-2 h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
              >
                <title>Google</title>
                <path
                  d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                  fill='currentColor'
                />
              </svg>
              Sign in with Google
            </Button>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-border' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-card px-2 text-muted-foreground'>
                  Secure Sign In
                </span>
              </div>
            </div>

            {/* Benefits List */}
            <div className='space-y-3 pt-2'>
              <div className='flex items-start gap-3'>
                <div className='w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                  <div className='w-2 h-2 rounded-full bg-primary' />
                </div>
                <div className='text-sm text-muted-foreground'>
                  Book and manage your tours easily
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                  <div className='w-2 h-2 rounded-full bg-primary' />
                </div>
                <div className='text-sm text-muted-foreground'>
                  Save your favorite destinations
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                  <div className='w-2 h-2 rounded-full bg-primary' />
                </div>
                <div className='text-sm text-muted-foreground'>
                  Get personalized recommendations
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className='text-xs text-center text-muted-foreground pt-2'>
              By continuing, you agree to our{' '}
              <Link
                href='/terms'
                className='underline hover:text-primary transition-colors'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy'
                className='underline hover:text-primary transition-colors'
              >
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div
          className='mt-6 text-center text-sm text-muted-foreground animate-in fade-in duration-700'
          style={{ animationDelay: '200ms' }}
        >
          <Link href='/' className='hover:text-primary transition-colors'>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
