'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Ban,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crown,
  Loader2,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  User,
  UserCheck,
  Users,
} from 'lucide-react';
import { motion, useInView, type Variants } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import {
  type AdminUser,
  useAdminUsers,
  useBanUser,
  useDeleteUser,
  useSetUserRole,
  useUnbanUser,
} from '@/services/admin-users';

// ── Animation config ──────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function isBanned(user: AdminUser) {
  return (
    user.banned === true &&
    (!user.banExpires || new Date(user.banExpires) > new Date())
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function UserAvatar({ user }: { user: AdminUser }) {
  return (
    <div className='w-8 h-8 rounded-full border border-border overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center'>
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name}
          width={32}
          height={32}
          className='w-full h-full object-cover'
        />
      ) : (
        <span className='text-xs font-bold text-primary'>
          {initials(user.name)}
        </span>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string | null }) {
  if (role === 'ADMIN') {
    return (
      <Badge
        variant='outline'
        className='text-xs gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20'
      >
        <Crown className='w-3 h-3' />
        Admin
      </Badge>
    );
  }
  return (
    <Badge variant='outline' className='text-xs gap-1'>
      <User className='w-3 h-3' />
      User
    </Badge>
  );
}

function StatusBadge({ user }: { user: AdminUser }) {
  if (isBanned(user)) {
    return (
      <Badge
        variant='outline'
        className='text-xs gap-1 bg-red-500/10 text-red-500 border-red-500/20'
      >
        <Ban className='w-3 h-3' />
        Banned
      </Badge>
    );
  }
  return (
    <Badge
      variant='outline'
      className='text-xs gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    >
      <UserCheck className='w-3 h-3' />
      Active
    </Badge>
  );
}

// ── Ban dialog ────────────────────────────────────────────────────────────────

const banSchema = z.object({
  banReason: z.string().min(1, 'Reason is required'),
  banExpires: z.string().optional(),
});

type BanFormData = z.infer<typeof banSchema>;

function BanDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate, isPending } = useBanUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BanFormData>({ resolver: zodResolver(banSchema) });

  if (!user) return null;

  const onSubmit = (data: BanFormData) => {
    mutate(
      {
        id: user.id,
        banReason: data.banReason,
        banExpires: data.banExpires
          ? new Date(data.banExpires).toISOString()
          : null,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isPending) {
          onOpenChange(v);
          if (!v) reset();
        }
      }}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Ban{' '}
            <span className='italic font-light text-muted-foreground'>
              user
            </span>
            <span className='text-destructive'>?</span>
          </DialogTitle>
          <DialogDescription>
            {user.name} · {user.email}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-1'>
          <Field data-invalid={!!errors.banReason}>
            <Label className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
              Reason <span className='text-red-500'>*</span>
            </Label>
            <Input
              placeholder='e.g., Repeated policy violations'
              className='h-10 text-sm border-2 focus-visible:ring-0 focus-visible:border-primary'
              {...register('banReason')}
            />
            {errors.banReason && (
              <FieldError>{errors.banReason.message}</FieldError>
            )}
          </Field>

          <Field>
            <Label className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground'>
              Expires (optional — leave blank for permanent)
            </Label>
            <Input
              type='datetime-local'
              className='h-10 text-sm border-2 focus-visible:ring-0 focus-visible:border-primary'
              {...register('banExpires')}
            />
          </Field>

          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='destructive'
              disabled={isPending}
              className='gap-2'
            >
              {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
              <Ban className='w-4 h-4' />
              Ban User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete dialog ─────────────────────────────────────────────────────────────

function DeleteDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate, isPending } = useDeleteUser();

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isPending) onOpenChange(v);
      }}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Delete{' '}
            <span className='italic font-light text-muted-foreground'>
              user
            </span>
            <span className='text-destructive'>?</span>
          </DialogTitle>
          <DialogDescription>
            {user.name} · {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className='p-3 rounded-xl bg-red-500/10 border border-red-500/20 my-1'>
          <p className='text-sm text-red-600'>
            This permanently deletes the account, all bookings, and reviews.
            This cannot be undone.
          </p>
        </div>

        <DialogFooter className='gap-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            disabled={isPending}
            className='gap-2'
            onClick={() =>
              mutate(user.id, { onSuccess: () => onOpenChange(false) })
            }
          >
            {isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Trash2 className='w-4 h-4' />
            )}
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Row actions menu ──────────────────────────────────────────────────────────

function UserRowActions({
  user,
  currentUserId,
  onBan,
  onDelete,
}: {
  user: AdminUser;
  currentUserId: string;
  onBan: (u: AdminUser) => void;
  onDelete: (u: AdminUser) => void;
}) {
  const { mutate: unban, isPending: unbanning } = useUnbanUser();
  const { mutate: setRole, isPending: settingRole } = useSetUserRole();
  const isSelf = user.id === currentUserId;
  const banned = isBanned(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7 border border-transparent hover:border-border'
        >
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem
          disabled={isSelf || settingRole}
          onClick={() =>
            setRole({
              id: user.id,
              role: user.role === 'ADMIN' ? 'USER' : 'ADMIN',
            })
          }
          className='gap-2 text-xs'
        >
          {user.role === 'ADMIN' ? (
            <>
              <User className='w-3.5 h-3.5' />
              Remove Admin
            </>
          ) : (
            <>
              <Crown className='w-3.5 h-3.5' />
              Make Admin
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {banned ? (
          <DropdownMenuItem
            disabled={isSelf || unbanning}
            onClick={() => unban(user.id)}
            className='gap-2 text-xs text-emerald-600 focus:text-emerald-600'
          >
            {unbanning ? (
              <Loader2 className='w-3.5 h-3.5 animate-spin' />
            ) : (
              <ShieldCheck className='w-3.5 h-3.5' />
            )}
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            disabled={isSelf}
            onClick={() => onBan(user)}
            className='gap-2 text-xs text-amber-600 focus:text-amber-600'
          >
            <Ban className='w-3.5 h-3.5' />
            Ban User
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isSelf}
          onClick={() => onDelete(user)}
          className='gap-2 text-xs text-destructive focus:text-destructive'
        >
          <Trash2 className='w-3.5 h-3.5' />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function UsersManagementPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user.id ?? '';

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [role, setRole] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const debouncedSearch = useDebounce(searchInput, 300);
  const prevDebouncedSearch = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevDebouncedSearch.current !== debouncedSearch) {
      prevDebouncedSearch.current = debouncedSearch;
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [banOpen, setBanOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isPending, isError } = useAdminUsers({
    page,
    search: debouncedSearch,
    role,
    status,
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' });
  const filtersInView = useInView(filtersRef, { once: true, margin: '-40px' });
  const tableInView = useInView(tableRef, { once: true, margin: '-40px' });

  const handleFilterChange = (key: 'role' | 'status', val: string) => {
    if (key === 'role') setRole(val);
    if (key === 'status') setStatus(val);
    setPage(1);
  };

  const openBan = (u: AdminUser) => {
    setBanTarget(u);
    setBanOpen(true);
  };
  const openDelete = (u: AdminUser) => {
    setDeleteTarget(u);
    setDeleteOpen(true);
  };

  const users = data?.users ?? [];
  const pagination = data?.pagination;
  const totalUsers = pagination?.total ?? 0;
  const bannedCount = users.filter((u) => isBanned(u)).length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className='flex flex-col gap-10 mt-6 mb-16 md:mb-20'>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div ref={headerRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={headerInView ? 'show' : 'hidden'}
          custom={0}
        >
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Admin
            </span>
          </div>
          <h1 className='text-2xl md:text-4xl font-bold leading-tight tracking-tight'>
            User{' '}
            <span className='italic font-light text-muted-foreground'>
              management
            </span>
            <span className='text-primary'>.</span>
          </h1>
          <p className='text-muted-foreground text-sm mt-1'>
            View, ban, promote or remove user accounts.
          </p>
        </motion.div>
      </div>

      {/* ── Stats strip — divided table pattern ──────────────────────────── */}
      <div ref={statsRef}>
        <motion.div
          variants={gridVariants}
          initial='hidden'
          animate={statsInView ? 'show' : 'hidden'}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border'>
            {(
              [
                {
                  label: 'Total Users',
                  icon: Users,
                  value: totalUsers,
                  color: 'text-primary',
                  bg: 'bg-primary/10',
                },
                {
                  label: 'Active',
                  icon: UserCheck,
                  value: isPending
                    ? null
                    : users.filter((u) => !isBanned(u)).length,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-500/10',
                },
                {
                  label: 'Banned',
                  icon: Ban,
                  value: isPending ? null : bannedCount,
                  color: 'text-red-500',
                  bg: 'bg-red-500/10',
                },
                {
                  label: 'Admins',
                  icon: Crown,
                  value: isPending ? null : adminCount,
                  color: 'text-amber-600',
                  bg: 'bg-amber-500/10',
                },
              ] as const
            ).map(({ label, icon: Icon, value, color, bg }) => (
              <motion.div
                key={label}
                variants={cardVariants}
                className='flex items-center gap-3 p-5'
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    bg,
                  )}
                >
                  <Icon className={cn('w-4 h-4', color)} />
                </div>
                <div className='min-w-0'>
                  <p className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    {label}
                  </p>
                  {isPending ? (
                    <Skeleton className='h-6 w-12 mt-1' />
                  ) : (
                    <p className='text-xl font-bold tabular-nums truncate'>
                      {value ?? 0}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div ref={filtersRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={filtersInView ? 'show' : 'hidden'}
          custom={0}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <div className='p-4 flex flex-col sm:flex-row gap-3'>
            <div className='flex flex-1 gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <Input
                  placeholder='Search name or email…'
                  className='pl-9 h-9 text-sm border-2 focus-visible:ring-0 focus-visible:border-primary'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <Select
              value={role}
              onValueChange={(v) => handleFilterChange('role', v)}
            >
              <SelectTrigger className='w-36 h-9 text-xs border-2 hover:border-primary/40'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Roles</SelectItem>
                <SelectItem value='USER'>User</SelectItem>
                <SelectItem value='ADMIN'>Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(v) => handleFilterChange('status', v)}
            >
              <SelectTrigger className='w-36 h-9 text-xs border-2 hover:border-primary/40'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Status</SelectItem>
                <SelectItem value='ACTIVE'>Active</SelectItem>
                <SelectItem value='BANNED'>Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div ref={tableRef}>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={tableInView ? 'show' : 'hidden'}
          custom={0}
          className='mb-6'
        >
          <div className='flex items-center justify-between'>
            <div>
              <div className='flex items-center gap-3 mb-1'>
                <div className='h-px w-8 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Directory
                </span>
              </div>
              <h2 className='text-xl font-bold tracking-tight'>
                All{' '}
                <span className='italic font-light text-muted-foreground'>
                  users
                </span>
              </h2>
            </div>
            {pagination && (
              <Badge variant='outline' className='text-xs'>
                {pagination.total} total
              </Badge>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={tableInView ? 'show' : 'hidden'}
          custom={0.1}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='pl-6 text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    User
                  </TableHead>
                  <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    Role
                  </TableHead>
                  <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    Status
                  </TableHead>
                  <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    Activity
                  </TableHead>
                  <TableHead className='text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    Joined
                  </TableHead>
                  <TableHead className='pr-6 text-right text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Loading skeletons */}
                {isPending &&
                  Array.from({ length: 8 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                    <TableRow key={i} className='hover:bg-primary/3'>
                      <TableCell className='pl-6'>
                        <div className='flex items-center gap-3'>
                          <Skeleton className='w-8 h-8 rounded-full shrink-0' />
                          <div className='space-y-1.5'>
                            <Skeleton className='h-3.5 w-28' />
                            <Skeleton className='h-3 w-40' />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-5 w-14' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-5 w-16' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-3.5 w-20' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-3.5 w-20' />
                      </TableCell>
                      <TableCell className='pr-6 text-right'>
                        <Skeleton className='h-7 w-7 ml-auto' />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Error */}
                {isError && (
                  <TableRow>
                    <TableCell colSpan={6} className='py-16 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='flex items-center gap-3'>
                          <div className='h-px w-8 bg-destructive' />
                          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-destructive'>
                            Error
                          </span>
                          <div className='h-px w-8 bg-destructive' />
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Failed to load users. Please try again.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty */}
                {!isPending && !isError && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className='py-16 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center'>
                          <Users className='w-5 h-5 text-primary' />
                        </div>
                        <div>
                          <p className='text-sm font-semibold'>
                            No users found
                          </p>
                          <p className='text-xs text-muted-foreground mt-1'>
                            Try adjusting your search or filters.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Rows */}
                {!isPending &&
                  !isError &&
                  users.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      variants={cardVariants}
                      initial='hidden'
                      animate='show'
                      custom={i * 0.04}
                      className={cn(
                        'group border-b border-border last:border-0 hover:bg-primary/3 transition-colors duration-200',
                        isBanned(user) && 'opacity-60',
                        user.id === currentUserId && 'bg-primary/5',
                      )}
                    >
                      {/* User */}
                      <TableCell className='pl-6'>
                        <div className='flex items-center gap-3'>
                          <UserAvatar user={user} />
                          <div className='min-w-0'>
                            <div className='flex items-center gap-1.5'>
                              <p className='text-sm font-semibold truncate max-w-40'>
                                {user.name}
                              </p>
                              {user.id === currentUserId && (
                                <span className='text-[10px] font-bold text-primary'>
                                  (you)
                                </span>
                              )}
                            </div>
                            <p className='text-xs text-muted-foreground truncate max-w-50'>
                              {user.email}
                            </p>
                            {isBanned(user) && user.banReason && (
                              <p className='text-[10px] text-red-500 mt-0.5 truncate max-w-50'>
                                Ban: {user.banReason}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge user={user} />
                      </TableCell>

                      {/* Activity */}
                      <TableCell>
                        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <BookOpen className='w-3 h-3' />
                            {user._count.bookings}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Star className='w-3 h-3' />
                            {user._count.reviews}
                          </span>
                        </div>
                      </TableCell>

                      {/* Joined */}
                      <TableCell className='text-xs text-muted-foreground'>
                        {format(new Date(user.createdAt), 'dd MMM yyyy')}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className='pr-6 text-right'>
                        <UserRowActions
                          user={user}
                          currentUserId={currentUserId}
                          onBan={openBan}
                          onDelete={openDelete}
                        />
                      </TableCell>
                    </motion.tr>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-between px-6 py-4 border-t border-border'>
              <p className='text-xs text-muted-foreground'>
                Page {pagination.page} of {pagination.totalPages} ·{' '}
                {pagination.total} users
              </p>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 w-8 p-0'
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className='w-4 h-4' />
                </Button>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }).map(
                  (_, i) => {
                    const p = i + 1;
                    return (
                      <Button
                        key={p}
                        variant={p === page ? 'default' : 'outline'}
                        size='sm'
                        className='h-8 w-8 p-0 text-xs'
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    );
                  },
                )}
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 w-8 p-0'
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Dialogs */}
      <BanDialog user={banTarget} open={banOpen} onOpenChange={setBanOpen} />
      <DeleteDialog
        user={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
