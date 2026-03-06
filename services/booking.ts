// ─── services/booking.ts ──────────────────────────────────────────────────────
// Full updated file — replace your existing services/booking.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import type {
  AdminBookingListType,
  BookingDetailsType,
  BookingsParams,
  BookingsResponse,
} from '@/types/bookings';

export const useBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const apiPromise = axios.post('/api/bookings/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.promise(apiPromise, {
        loading: 'Booking your package, please wait...',
        success: 'Package booked successfully!',
        // biome-ignore lint/suspicious/noExplicitAny: fine
        error: (err: any) =>
          err?.response?.data?.message ||
          'Failed to book the package. Please try again.',
      });
      const response = await apiPromise;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_BOOKINGS] });
    },
  });
};

export const useAdminBookingList = ({
  status = '',
  page = 1,
}: {
  status?: string;
  page?: number;
} = {}) => {
  return useQuery<AdminBookingListType>({
    queryKey: [QUERY_KEYS.ADMIN_BOOKINGS_LIST, status, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      // Only send status param when a filter is active — avoids sending 'ALL'
      if (status && status !== 'ALL') params.set('status', status);
      params.set('page', String(page));
      const res = await axios.get<AdminBookingListType>(
        `/api/bookings/admin/all?${params}`,
      );
      return res.data;
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const p = axios.delete(`/api/bookings/admin/single?id=${id}`);
      toast.promise(p, {
        loading: 'Deleting…',
        success: 'Booking deleted',
        error: 'Failed to delete',
      });
      return (await p).data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_BOOKINGS_LIST],
      }),
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const p = axios.patch(
        `/api/bookings/admin/single?id=${id}&status=${status}`,
      );
      toast.promise(p, {
        loading: 'Updating…',
        success: 'Status updated',
        error: 'Failed to update',
      });
      return (await p).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SINGLE_BOOKING] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_BOOKINGS_LIST],
      });
    },
  });
};

export const useSingleBooking = (id: string) => {
  return useQuery<BookingDetailsType>({
    queryKey: [QUERY_KEYS.SINGLE_BOOKING, id],
    queryFn: async () => {
      const res = await axios.get<BookingDetailsType>(
        `/api/bookings/admin/single?id=${id}`,
      );
      return res.data;
    },
  });
};

async function fetchBookings(
  params: BookingsParams,
): Promise<BookingsResponse> {
  const { data } = await axios.get<BookingsResponse>(
    '/api/bookings/my-bookings',
    {
      params: {
        status: params.status ?? 'ALL',
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    },
  );
  return data;
}

export function useMyBookings(params: BookingsParams = {}) {
  return useQuery<BookingsResponse>({
    queryKey: [
      QUERY_KEYS.MY_BOOKINGS,
      params.status ?? 'ALL',
      params.page ?? 1,
    ],
    queryFn: () => fetchBookings(params),
    placeholderData: (prev) => prev,
  });
}
