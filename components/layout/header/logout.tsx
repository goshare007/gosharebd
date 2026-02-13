'use client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth-client';

export function SignOut() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setOpen(false);
            router.push('/');
            router.refresh();
          },
          onError: (_error) => {
            setIsSigningOut(false);
          },
        },
      });
    } catch (_error) {
      setIsSigningOut(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className='flex w-full cursor-pointer items-center gap-3 py-2.5 text-destructive focus:text-destructive'
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <LogOut className='h-4 w-4' />
          <span className='font-medium'>Sign Out</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be redirected to the home page and will need to sign in
            again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSigningOut}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSignOut}
            disabled={isSigningOut}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
