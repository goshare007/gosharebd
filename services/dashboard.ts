import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '@/constants/query-keys';
import type {
  AdminDashboardStats,
  UserDashboardStats,
} from '@/types/dashboard';

export const useAdminDashboardStats = () => {
  return useQuery<AdminDashboardStats>({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS],
    queryFn: async () => {
      const response = await axios.get<AdminDashboardStats>(
        '/api/dashboard/admin/stats',
      );
      return response.data;
    },
  });
};

export const useUserDashboardStats = () => {
  return useQuery<UserDashboardStats>({
    queryKey: [QUERY_KEYS.USER_DASHBOARD_STATS],
    queryFn: async () => {
      const response = await axios.get<UserDashboardStats>(
        '/api/dashboard/user/stats',
      );
      return response.data;
    },
  });
};
