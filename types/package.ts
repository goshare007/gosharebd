export interface SinglePackageType {
  id: string;
  destinationId: string;
  name: string;
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
  Location: string;
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
  Location: string;
  pricePerPerson: number;
}
