// services/departures.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// ─── types ────────────────────────────────────────────────────────────────────

export type DepartureStatus = 'ACTIVE' | 'FULL' | 'CANCELLED' | 'COMPLETED';

export type Departure = {
  id: string;
  packageId: string;
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

export type DeparturePackage = {
  id: string;
  name: string;
  durationDays: number;
};

export type DeparturesResponse = {
  package: DeparturePackage;
  departures: Departure[];
};

export type CreateSinglePayload = {
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

export type CreateBulkPayload = {
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

export type UpdateDeparturePayload = {
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
  all: (packageId: string) => ['departures', packageId] as const,
};

// ─── hooks ────────────────────────────────────────────────────────────────────

export function useDepartures(packageId: string) {
  return useQuery<DeparturesResponse>({
    queryKey: keys.all(packageId),
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/admin/packages/${packageId}/departures`,
      );
      return data;
    },
    enabled: !!packageId,
  });
}

export function useCreateDeparture(packageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSinglePayload | CreateBulkPayload) => {
      const { data } = await axios.post(
        `/api/packages/admin/packages/${packageId}/departures`,
        payload,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(packageId) }),
  });
}

export function useUpdateDeparture(packageId: string) {
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
        `/api/packages/admin/packages/${packageId}/departures/${departureId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(packageId) }),
  });
}

export function useDeleteDeparture(packageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (departureId: string) => {
      const { data } = await axios.delete(
        `/api/packages/admin/packages/${packageId}/departures/${departureId}`,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(packageId) }),
  });
}
