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
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
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

// ─── helpers ──────────────────────────────────────────────────────────────────

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

// ─── sub-components ───────────────────────────────────────────────────────────

function UserAvatar({ user }: { user: AdminUser }) {
  return (
    <div className='w-8 h-8 rounded-full border-2 border-border overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center'>
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

// ─── ban dialog ───────────────────────────────────────────────────────────────

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
          <DialogTitle className='font-display text-xl font-bold'>
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

// ─── delete dialog ────────────────────────────────────────────────────────────

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
          <DialogTitle className='font-display text-xl font-bold'>
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

        <div className='p-3 rounded-xl bg-red-500/10 border-2 border-red-500/20 my-1'>
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

// ─── row actions menu ─────────────────────────────────────────────────────────

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
        {/* Role toggle */}
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

        {/* Ban / unban */}
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

        {/* Delete */}
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

// ─── main page ────────────────────────────────────────────────────────────────

export default function UsersManagementPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user.id ?? '';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [role, setRole] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [banOpen, setBanOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isPending, isError } = useAdminUsers({
    page,
    search,
    role,
    status,
  });

  const handleSearch = useCallback(() => {
    setSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

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

  // summary counts from current page data (approximation)
  const totalUsers = pagination?.total ?? 0;
  const bannedCount = users.filter((u) => isBanned(u)).length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* ── page header ───────────────────────────────────────────────── */}
      <div className='mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='h-px w-12 bg-primary' />
          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
            Admin
          </span>
        </div>
        <h1 className='font-display text-4xl font-bold leading-tight tracking-tight'>
          User{' '}
          <span className='italic font-light text-muted-foreground'>
            management
          </span>
          <span className='text-primary'>.</span>
        </h1>
        <p className='text-muted-foreground text-sm mt-1'>
          View, ban, promote or remove user accounts.
        </p>
      </div>

      {/* ── stat cards ────────────────────────────────────────────────── */}
      <div
        className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom duration-700'
        style={{ animationDelay: '80ms' }}
      >
        {[
          {
            label: 'Total Users',
            value: totalUsers,
            icon: Users,
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            label: 'Active',
            value: isPending
              ? '—'
              : users.filter((u) => !isBanned(u)).length +
                (pagination && pagination.total > users.length ? '+' : ''),
            icon: UserCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Banned',
            value: isPending ? '—' : bannedCount,
            icon: Ban,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
          },
          {
            label: 'Admins',
            value: isPending ? '—' : adminCount,
            icon: Crown,
            color: 'text-amber-600',
            bg: 'bg-amber-500/10',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className='border-2'>
            <CardContent className='p-4 flex items-center gap-3'>
              <div
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                  bg,
                )}
              >
                <Icon className={cn('w-4 h-4', color)} />
              </div>
              <div className='min-w-0'>
                <p className='text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground truncate'>
                  {label}
                </p>
                <div className='font-display text-xl font-bold'>
                  {isPending ? <Skeleton className='h-6 w-10 mt-0.5' /> : value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── filters ───────────────────────────────────────────────────── */}
      <Card
        className='border-2 mb-6 animate-in fade-in slide-in-from-bottom duration-700'
        style={{ animationDelay: '160ms' }}
      >
        <CardContent className='p-4 flex flex-col sm:flex-row gap-3'>
          {/* search */}
          <div className='flex flex-1 gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search name or email…'
                className='pl-9 h-9 text-sm border-2 focus-visible:ring-0 focus-visible:border-primary'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button size='sm' className='h-9 px-4' onClick={handleSearch}>
              Search
            </Button>
          </div>

          {/* role filter */}
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

          {/* status filter */}
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
        </CardContent>
      </Card>

      {/* ── table ─────────────────────────────────────────────────────── */}
      <Card
        className='border-2 animate-in fade-in slide-in-from-bottom duration-700'
        style={{ animationDelay: '240ms' }}
      >
        <CardHeader className='pb-3 px-6 pt-5'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
              <Users className='w-4 h-4 text-primary' />
            </div>
            <CardTitle className='font-display text-lg font-bold'>
              All Users
            </CardTitle>
            {pagination && (
              <Badge variant='outline' className='ml-auto text-xs'>
                {pagination.total} total
              </Badge>
            )}
          </div>
        </CardHeader>

        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='text-xs font-semibold tracking-widest uppercase pl-6'>
                  User
                </TableHead>
                <TableHead className='text-xs font-semibold tracking-widest uppercase'>
                  Role
                </TableHead>
                <TableHead className='text-xs font-semibold tracking-widest uppercase'>
                  Status
                </TableHead>
                <TableHead className='text-xs font-semibold tracking-widest uppercase'>
                  Activity
                </TableHead>
                <TableHead className='text-xs font-semibold tracking-widest uppercase'>
                  Joined
                </TableHead>
                <TableHead className='text-xs font-semibold tracking-widest uppercase text-right pr-6'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* loading skeletons */}
              {isPending &&
                Array.from({ length: 8 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  <TableRow key={i} className='hover:bg-muted/30'>
                    <TableCell className='pl-6'>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='w-8 h-8 rounded-full' />
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

              {/* error */}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className='py-16 text-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <XCircle className='w-8 h-8 text-destructive' />
                      <p className='text-sm font-semibold'>
                        Failed to load users
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* empty */}
              {!isPending && !isError && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className='py-16 text-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <Users className='w-8 h-8 text-muted-foreground' />
                      <p className='text-sm font-semibold'>No users found</p>
                      <p className='text-xs text-muted-foreground'>
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* rows */}
              {!isPending &&
                !isError &&
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className={cn(
                      'hover:bg-muted/30 transition-colors',
                      isBanned(user) && 'opacity-60',
                      user.id === currentUserId && 'bg-primary/5',
                    )}
                  >
                    {/* user */}
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

                    {/* role */}
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    {/* status */}
                    <TableCell>
                      <StatusBadge user={user} />
                    </TableCell>

                    {/* activity */}
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

                    {/* joined */}
                    <TableCell className='text-xs text-muted-foreground'>
                      {format(new Date(user.createdAt), 'dd MMM yyyy')}
                    </TableCell>

                    {/* actions */}
                    <TableCell className='pr-6 text-right'>
                      <UserRowActions
                        user={user}
                        currentUserId={currentUserId}
                        onBan={openBan}
                        onDelete={openDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* pagination */}
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
                className='h-8 w-8 p-0 border-2'
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
                      className='h-8 w-8 p-0 border-2 text-xs'
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
                className='h-8 w-8 p-0 border-2'
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* dialogs */}
      <BanDialog user={banTarget} open={banOpen} onOpenChange={setBanOpen} />
      <DeleteDialog
        user={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
