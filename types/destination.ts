export interface DestinationType {
  id: string;
  name: string;
  image: string;
  division: string;
  summary: string;
  tags: string[];
  packageCount: number;
  startingPrice?: number;
}

export interface SingleDestinationType {
  id: string;
  name: string;
  image: string;
  tags: string[];
  division: string;
  summary: string;
  packageCount: number;
  packages: [
    {
      id: string;
      name: string;
      coverImage: string;
      tags: string[];
      isBestseller: boolean;
      summary: string;
      durationDays: number;
      maxGroupSize: number;
      minGroupSize: number;
      reviewCount: number;
      avgRating: number | null;
      pricePerPerson: number;
      originalPrice?: number;
      couplePrice?: number;
    },
  ];
}
