export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface AvailableDate {
  date: string;
  slots: number;
}

export interface TourGuide {
  name: string;
  image: string;
  role: string;
  experience: string;
  languages: string[];
  rating: number;
  tours: number;
}

export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  images: string[];
}

export interface Policies {
  cancellation: string;
  weatherPolicy: string;
  ageRestriction: string;
  groupSize: string;
}

export interface PackageType {
  id: number;
  slug: string;
  title: string;
  image: string;
  duration: string;
  groupSize: string;
  pricePerPerson: number;
  originalPricePerPerson: number;
  couplePrice: number | null;
  rating: number;
  reviews: Review[];
  isCouple: boolean;
  isBestseller: boolean;
  description: string;
  highlights: string[];
  destination: string;
  destinationSlug: string;
  tagline: string;
  images: string[];
  originalCouplePrice?: number | null;
  category: string;
  included: string[];
  notIncluded: string[];
  itinerary: ItineraryItem[];
  availableDates: AvailableDate[];
  tourGuide: TourGuide;
  policies: Policies;
}

export interface DestinationType {
  slug: string;
  name: string;
  coverImage: string;
  region: string;
  description: string;
  highlights: string[];
  totalPackages: number;
  couplePackages: number;
  packages: PackageType[];
}

export interface DestinationSummary {
  slug: string;
  name: string;
  image: string;
  region: string;
  packageCount: number;
  description: string;
  highlights: string[];
  startingPrice: number;
}
