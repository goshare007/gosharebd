import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import SignInForm from './sign-in-form';

export default async function LoginPage() {
  // 1. Get the session information
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Conditional Redirect
  // If a session exists (user is logged in), redirect them to the dashboard.
  if (session) {
    // Redirect to the post-login destination
    redirect('/dashboard');
  }

  // 3. Render the Login Form if no session exists
  return <SignInForm />;
}
