import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';

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
        // biome-ignore lint/suspicious/noExplicitAny: this is fine
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
