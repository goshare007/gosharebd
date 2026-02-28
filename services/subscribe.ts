import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

type SubscribePayload = {
  email: string;
  name?: string;
  source?: string;
};

type SubscribeResponse = {
  message: string;
};

export function useSubscribe() {
  return useMutation<SubscribeResponse, Error, SubscribePayload>({
    mutationFn: async (payload) => {
      const p = axios.post<SubscribeResponse>('/api/subscribe', payload);
      toast.promise(p, {
        loading: 'Subscribing…',
        success: (res) => res.data.message,
        error: (err) =>
          err?.response?.data?.error ??
          'Something went wrong. Please try again.',
      });
      return (await p).data;
    },
  });
}
