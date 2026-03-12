// services/departures.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { SinglePackageWithDepartureType } from '@/types/package';

// ─── types ────────────────────────────────────────────────────────────────────

export type DepartureStatus = 'ACTIVE' | 'FULL' | 'CANCELLED' | 'COMPLETED';

export type Departure = {
  id: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: DepartureStatus;
  totalSeats: number;
  bookedSeats: number;
  isGuaranteed: boolean;
  note: string | null;
  pricePerPerson: string | null;
  originalPrice: string | null;
  couplePrice: string | null;
  originalCouplePrice: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { bookings: number };
};

type DeparturePackage = {
  id: string;
  name: string;
  durationDays: number;
};

type DeparturesResponse = {
  package: DeparturePackage;
  departures: Departure[];
};

type CreateSinglePayload = {
  mode: 'single';
  startDate: string; // ISO datetime
  totalSeats: number;
  isGuaranteed?: boolean;
  note?: string;
  pricePerPerson?: number | null;
  originalPrice?: number | null;
  couplePrice?: number | null;
  originalCouplePrice?: number | null;
};

type CreateBulkPayload = {
  mode: 'bulk';
  recurringDays: number[]; // 0=Sun … 6=Sat
  rangeStart: string;
  rangeEnd: string;
  totalSeats: number;
  isGuaranteed?: boolean;
  note?: string;
  pricePerPerson?: number | null;
  originalPrice?: number | null;
  couplePrice?: number | null;
  originalCouplePrice?: number | null;
};

type UpdateDeparturePayload = {
  startDate?: string;
  totalSeats?: number;
  status?: DepartureStatus;
  isGuaranteed?: boolean;
  note?: string | null;
  pricePerPerson?: number | null;
  originalPrice?: number | null;
  couplePrice?: number | null;
  originalCouplePrice?: number | null;
};

// ─── query key factory ────────────────────────────────────────────────────────

const keys = {
  all: (slug: string) => ['departures', slug] as const,
};

// ─── hooks ────────────────────────────────────────────────────────────────────

export function useDepartures(slug: string) {
  return useQuery<DeparturesResponse>({
    queryKey: keys.all(slug),
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/packages/admin/package/${slug}/departures`,
      );
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateDeparture(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSinglePayload | CreateBulkPayload) => {
      const { data } = await axios.post(
        `/api/packages/admin/package/${slug}/departures`,
        payload,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(slug) }),
  });
}

export function useUpdateDeparture(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      departureId,
      payload,
    }: {
      departureId: string;
      payload: UpdateDeparturePayload;
    }) => {
      const { data } = await axios.patch(
        `/api/packages/admin/package/${slug}/departures/${departureId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(slug) }),
  });
}

export function useDeleteDeparture(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (departureId: string) => {
      const { data } = await axios.delete(
        `/api/packages/admin/package/${slug}/departures/${departureId}`,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(slug) }),
  });
}

export const useSinglePackagesWithDepartures = (slug: string) => {
  return useQuery<SinglePackageWithDepartureType>({
    queryKey: [QUERY_KEYS.SINGLE_PACKAGE_WITH_DEPARTURES, slug],
    queryFn: async () => {
      const response = await axios.get<SinglePackageWithDepartureType>(
        '/api/packages/single-package/departures',
        {
          params: { slug },
        },
      );
      return response.data;
    },
  });
};
