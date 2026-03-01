'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Info,
  Loader2,
  LogOut,
  Pencil,
  Save,
  ShieldAlert,
  Trash2,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  revokeOtherSessions,
  signOut,
  updateUser,
  useSession,
} from '@/lib/auth-client';

// ─── helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ─── profile section ──────────────────────────────────────────────────────────

function ProfileSection() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '' },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleDiscardImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSaveImage = async () => {
    if (!imageFile) return;
    setSavingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? 'Upload failed');
      }

      await updateUser({});
      toast.success('Profile photo updated');
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to upload photo',
      );
    } finally {
      setSavingImage(false);
    }
  };

  const onSubmitName = async (data: ProfileFormData) => {
    setSavingName(true);
    try {
      await updateUser({ name: data.name });
      toast.success('Display name updated');
      setEditingName(false);
    } catch {
      toast.error('Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  const avatarSrc = imagePreview ?? user?.image ?? '';

  return (
    <Card
      className='border-2 hover:border-primary/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom'
      style={{ animationDelay: '80ms' }}
    >
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
            <User className='w-4 h-4 text-primary' />
          </div>
          <CardTitle className='font-display text-lg font-bold'>
            Profile Information
          </CardTitle>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-px w-6 bg-primary' />
          <p className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
            Public identity
          </p>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Avatar */}
        <div className='flex items-end gap-5'>
          <div className='relative group shrink-0'>
            <div className='w-20 h-20 rounded-full border-2 border-primary/20 overflow-hidden bg-muted'>
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={user?.name ?? 'Avatar'}
                  width={80}
                  height={80}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-primary/10'>
                  <span className='text-xl font-bold text-primary'>
                    {user?.name ? initials(user.name) : '?'}
                  </span>
                </div>
              )}
            </div>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer'
            >
              <Camera className='w-5 h-5 text-white' />
              <span className='text-white text-[10px] font-semibold'>
                Change
              </span>
            </button>
            <div className='absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white border border-border flex items-center justify-center shadow-sm'>
              <Camera className='w-3 h-3 text-[#4285F4]' />
            </div>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/png,image/jpeg,image/webp'
              className='hidden'
              onChange={handleImageSelect}
            />
          </div>

          <div className='min-w-0 flex-1'>
            {sessionLoading ? (
              <div className='space-y-1.5'>
                <div className='h-5 w-36 bg-muted rounded animate-pulse' />
                <div className='h-3.5 w-48 bg-muted rounded animate-pulse' />
              </div>
            ) : (
              <>
                <p className='font-display font-bold text-lg leading-tight truncate'>
                  {user?.name}
                </p>
                <p className='text-xs text-muted-foreground truncate'>
                  {user?.email}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Pending image action bar */}
        {imagePreview && (
          <div className='flex items-center gap-2 p-3 rounded-xl border-2 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom duration-300'>
            <div className='w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-border'>
              <Image
                src={imagePreview}
                alt='Preview'
                width={32}
                height={32}
                className='w-full h-full object-cover'
              />
            </div>
            <p className='text-xs text-muted-foreground flex-1 truncate'>
              New photo selected — save to apply
            </p>
            <Button
              size='sm'
              variant='outline'
              className='h-7 gap-1.5 text-xs border-2'
              onClick={handleDiscardImage}
              disabled={savingImage}
            >
              <X className='w-3 h-3' />
              Discard
            </Button>
            <Button
              size='sm'
              className='h-7 gap-1.5 text-xs'
              onClick={handleSaveImage}
              disabled={savingImage}
            >
              {savingImage ? (
                <Loader2 className='w-3 h-3 animate-spin' />
              ) : (
                <Save className='w-3 h-3' />
              )}
              Save Photo
            </Button>
          </div>
        )}

        {/* Google notice */}
        <div className='flex items-center gap-2.5 p-3 rounded-xl bg-primary/5'>
          <Info className='w-4 h-4 shrink-0' />
          <p className='text-xs leading-relaxed'>
            Your account is linked to Google. You can override the photo above,
            but email is always managed by Google.
          </p>
        </div>

        <Separator />

        {/* Name + email */}
        <form onSubmit={handleSubmit(onSubmitName)} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
              Display Name
            </Label>
            {editingName ? (
              <>
                <Input
                  className='h-10 text-sm border-2 focus-visible:ring-0 focus-visible:border-primary'
                  autoFocus
                  {...register('name')}
                />
                {errors.name && (
                  <p className='text-xs text-red-500'>{errors.name.message}</p>
                )}
                <p className='text-xs text-muted-foreground'>
                  Shown on your reviews and bookings.
                </p>
              </>
            ) : (
              <div className='h-10 px-3 flex items-center text-sm border-2 border-border rounded-md bg-muted/30'>
                {sessionLoading ? (
                  <div className='h-4 w-32 bg-muted rounded animate-pulse' />
                ) : (
                  user?.name
                )}
              </div>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
              Email Address
            </Label>
            <div className='h-10 px-3 flex items-center justify-between gap-2 text-sm border-2 border-border rounded-md bg-muted/30'>
              {sessionLoading ? (
                <div className='h-4 w-48 bg-muted rounded animate-pulse' />
              ) : (
                <>
                  <span className='text-muted-foreground truncate'>
                    {user?.email}
                  </span>
                  <Badge
                    variant='outline'
                    className='shrink-0 text-xs gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  >
                    <CheckCircle2 className='w-3 h-3' />
                    Verified
                  </Badge>
                </>
              )}
            </div>
            <p className='text-xs text-muted-foreground'>
              Managed by Google — cannot be changed here.
            </p>
          </div>

          {!sessionLoading && user?.createdAt && (
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <CalendarDays className='w-3.5 h-3.5 shrink-0' />
              Member since{' '}
              <span className='font-medium text-foreground'>
                {format(new Date(user.createdAt), 'MMMM yyyy')}
              </span>
            </div>
          )}

          <div className='flex gap-2 pt-1'>
            {editingName ? (
              <>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='gap-1.5 border-2'
                  onClick={() => {
                    setEditingName(false);
                    reset();
                  }}
                >
                  <X className='w-3.5 h-3.5' />
                  Cancel
                </Button>
                <Button
                  type='submit'
                  size='sm'
                  className='gap-1.5'
                  disabled={savingName}
                >
                  {savingName ? (
                    <Loader2 className='w-3.5 h-3.5 animate-spin' />
                  ) : (
                    <Save className='w-3.5 h-3.5' />
                  )}
                  Save Name
                </Button>
              </>
            ) : (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='gap-1.5 border-2 hover:border-primary/40'
                onClick={() => setEditingName(true)}
                disabled={sessionLoading}
              >
                <Pencil className='w-3.5 h-3.5' />
                Edit Name
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── danger zone ──────────────────────────────────────────────────────────────

function DangerZoneSection() {
  const router = useRouter();
  const [signOutAllOpen, setSignOutAllOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOutAll = async () => {
    setIsPending(true);
    try {
      await revokeOtherSessions();
      toast.success('Signed out of all other sessions');
      setSignOutAllOpen(false);
    } catch {
      toast.error('Failed to sign out other sessions');
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? 'Failed to delete account');
      }

      // Sign out client-side to clear the session cookie
      await signOut();

      toast.success('Account deleted successfully');

      // Redirect after brief delay so the toast is visible
      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete account',
      );
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        className='border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom'
        style={{ animationDelay: '240ms' }}
      >
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center'>
              <ShieldAlert className='w-4 h-4 text-red-500' />
            </div>
            <CardTitle className='font-display text-lg font-bold'>
              Danger Zone
            </CardTitle>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-px w-6 bg-red-500' />
            <p className='text-xs font-semibold tracking-[0.15em] uppercase text-red-500'>
              Irreversible actions
            </p>
          </div>
        </CardHeader>

        <CardContent className='space-y-3'>
          {/* Sign out all */}
          <div className='flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-border'>
            <div className='min-w-0'>
              <p className='text-sm font-semibold'>Sign out all devices</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Revoke all active sessions except this one
              </p>
            </div>
            <Button
              size='sm'
              variant='outline'
              className='shrink-0 gap-1.5 border-2 hover:border-amber-500/40 hover:text-amber-600 hover:bg-amber-500/5'
              onClick={() => setSignOutAllOpen(true)}
            >
              <LogOut className='w-3.5 h-3.5' />
              Sign Out All
            </Button>
          </div>

          {/* Delete account */}
          <div className='flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-red-500/20 bg-red-500/5'>
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-red-600'>
                Delete account
              </p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Permanently removes your account, bookings, and reviews
              </p>
            </div>
            <Button
              size='sm'
              variant='outline'
              className='shrink-0 gap-1.5 border-2 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500'
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className='w-3.5 h-3.5' />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sign out all dialog */}
      <Dialog open={signOutAllOpen} onOpenChange={setSignOutAllOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-display text-xl font-bold'>
              Sign out all{' '}
              <span className='italic font-light text-muted-foreground'>
                devices
              </span>
              <span className='text-primary'>?</span>
            </DialogTitle>
            <DialogDescription>
              All other active sessions will be immediately revoked. You will
              remain signed in on this device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={() => setSignOutAllOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSignOutAll}
              disabled={isPending}
              className='gap-2'
            >
              {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
              <LogOut className='w-4 h-4' />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete account dialog */}
      <Dialog
        open={deleteOpen}
        onOpenChange={(v) => {
          if (isDeleting) return;
          setDeleteOpen(v);
          if (!v) setDeleteConfirm('');
        }}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-display text-xl font-bold'>
              Delete{' '}
              <span className='italic font-light text-muted-foreground'>
                account
              </span>
              <span className='text-destructive'>?</span>
            </DialogTitle>
            <DialogDescription>
              This permanently deletes your account, all bookings, and reviews.
              Your Google account is not affected.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-3 my-1'>
            <div className='p-3 rounded-xl bg-red-500/10 border-2 border-red-500/20'>
              <p className='text-sm text-red-600'>
                Type <strong>DELETE</strong> to confirm.
              </p>
            </div>
            <Input
              placeholder='DELETE'
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className='border-2 focus-visible:ring-0 focus-visible:border-red-500'
              disabled={isDeleting}
            />
          </div>

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => {
                setDeleteOpen(false);
                setDeleteConfirm('');
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              disabled={deleteConfirm !== 'DELETE' || isDeleting}
              className='gap-2'
              onClick={handleDeleteAccount}
            >
              {isDeleting ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Trash2 className='w-4 h-4' />
              )}
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AccountSettingsPage() {
  return (
    <div className='max-w-2xl mx-auto px-4 py-8 sm:px-6'>
      <div className='mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='h-px w-12 bg-primary' />
          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
            My Account
          </span>
        </div>
        <h1 className='font-display text-4xl font-bold leading-tight tracking-tight'>
          Account{' '}
          <span className='italic font-light text-muted-foreground'>
            settings
          </span>
          <span className='text-primary'>.</span>
        </h1>
        <p className='text-muted-foreground text-sm mt-1'>
          Manage your profile and notification preferences.
        </p>
      </div>

      <div className='space-y-6'>
        <ProfileSection />
        <DangerZoneSection />
      </div>
    </div>
  );
}
