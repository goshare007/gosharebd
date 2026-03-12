// services/admin-users.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';

// ─── types ────────────────────────────────────────────────────────────────────

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  _count: { bookings: number; reviews: number };
};

type UsersResponse = {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type UsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
};

// ─── hooks ────────────────────────────────────────────────────────────────────

export function useAdminUsers(params: UsersParams = {}) {
  const {
    page = 1,
    limit = 20,
    search = '',
    role = 'ALL',
    status = 'ALL',
  } = params;

  return useQuery<UsersResponse>({
    queryKey: [QUERY_KEYS.ADMIN_USER_LIST, page, limit, search, role, status],
    queryFn: async () => {
      const q = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
        role,
        status,
      });
      const { data } = await axios.get(`/api/admin/users?${q}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      banReason,
      banExpires,
    }: {
      id: string;
      banReason: string;
      banExpires?: string | null;
    }) => {
      const p = axios.patch(`/api/admin/users/${id}`, {
        action: 'ban',
        banReason,
        banExpires,
      });
      toast.promise(p, {
        loading: 'Banning user…',
        success: 'User banned',
        error: (e) => e?.response?.data?.error ?? 'Failed to ban user',
      });
      return (await p).data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USER_LIST] }),
  });
}

export function useUnbanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const p = axios.patch(`/api/admin/users/${id}`, { action: 'unban' });
      toast.promise(p, {
        loading: 'Unbanning user…',
        success: 'User unbanned',
        error: (e) => e?.response?.data?.error ?? 'Failed to unban user',
      });
      return (await p).data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USER_LIST] }),
  });
}

export function useSetUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: string;
      role: 'USER' | 'ADMIN';
    }) => {
      const p = axios.patch(`/api/admin/users/${id}`, {
        action: 'setRole',
        role,
      });
      toast.promise(p, {
        loading: 'Updating role…',
        success: 'Role updated',
        error: (e) => e?.response?.data?.error ?? 'Failed to update role',
      });
      return (await p).data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USER_LIST] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const p = axios.delete(`/api/admin/users/${id}`);
      toast.promise(p, {
        loading: 'Deleting user…',
        success: 'User deleted',
        error: (e) => e?.response?.data?.error ?? 'Failed to delete user',
      });
      return (await p).data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USER_LIST] }),
  });
}
