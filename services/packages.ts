import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';

export const useDestinationWisePackages = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.Single_DESTINATION_PACKAGES, id],
    queryFn: async () => {
      const response = await axios.get('/api/packages/destination', {
        params: { id },
      });
      return response.data;
    },
  });
};

export const useAddPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const apiPromise = axios.post('/api/packages/admin/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.promise(apiPromise, {
        loading: 'Adding Destination, please wait...',
        success: 'Destination added successfully!',
        // biome-ignore lint/suspicious/noExplicitAny: this is fine
        error: (err: any) =>
          err?.response?.data?.message || 'Failed to add destination',
      });

      const response = await apiPromise;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.All_DESTINATION] });
    },
  });
};
