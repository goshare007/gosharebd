export interface SinglePackageType {
  id: string;
  destinationId: string;
  name: string;
  slug: string;
  division: string;
  tags: string[];
  coverImage: string;
  pricePerPerson: number;
  originalPrice: number;
  couplePrice: number;
  originalCouplePrice: number;
  isCouple: boolean;
  durationDays: number;
  maxGroupSize: number;
  minGroupSize: number;
  location: string;
  summary: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  cancellationPolicy: string;
  weatherPolicy: string;
  ageRestriction: string;
  isBestseller: boolean;
  reviewCount: number;
  averageRating: number | null;
  isActive: boolean;
  gallery: { id: string; url: string; publicId: string }[];
  itinerary: [
    {
      id: string;
      time: string;
      title: string;
      description: string;
      order: number;
    },
  ];
}

export interface AllPackagesType {
  id: string;
  name: string;
  slug: string;
  location: string;
  pricePerPerson: number;
  originalPrice?: number | null;
  coverImage: string;
  durationDays?: number;
  isActive: boolean;
  isBestseller: boolean;
  minGroupSize: number;
  maxGroupSize: number;
  couplePrice?: number;
  originalCouplePrice?: number;
  isCouple: boolean;
  tags: string[];
  reviewCount: number;
  averageRating: number | null;
}

export interface SinglePackageWithDepartureType extends SinglePackageType {
  departures: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    totalSeats: number;
    bookedSeats: number;
    availableSeats: number;
    fillPct: number;
    urgency: 'available' | 'low' | 'critical' | 'full';
    isGuaranteed: boolean;
    note: string | null;
    effectivePricePerPerson: number;
    effectiveOriginalPrice: number | null;
    effectiveCouplePrice: number | null;
    effectiveOriginalCouplePrice: number | null;
    hasPriceOverride: boolean;
    discountPct: number | null;
  };
}
