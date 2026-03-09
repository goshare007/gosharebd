import { useQuery } from '@tanstack/react-query';

export type FestivalItem = {
  id: string;
  name: string;
  slug: string;
  location: string;
  division: string;
  summary: string;
  highlights: string[];
  pricePerPerson: number;
  originalPrice: number | null;
  coverImage: string;
  durationDays: number;
  isActive: boolean;
  isBestseller: boolean;
  minGroupSize: number;
  maxGroupSize: number;
  tags: string[];
  status: 'upcoming' | 'past' | 'coming_soon';
  nextDeparture: {
    id: string;
    startDate: string;
    endDate: string;
    totalSeats: number;
    bookedSeats: number;
    note: string | null;
  } | null;
  spotsLeft: number | null;
  lastDeparture: { startDate: string; endDate: string } | null;
  reviewCount: number;
  averageRating: number | null;
  upcomingDeparturesCount: number;
  pastDeparturesCount: number;
};

async function fetchFestivals(): Promise<FestivalItem[]> {
  const res = await fetch('/api/festivals');
  if (!res.ok) throw new Error('Failed to fetch festivals');
  return res.json();
}

export function useFestivals() {
  return useQuery({
    queryKey: ['festivals'],
    queryFn: fetchFestivals,
  });
}
