export interface WishlistType {
  id: string;
  destinationId: string;
  name: string;
  coverImage: string;
  pricePerPerson: number;
  originalPrice: number;
  isCouple: boolean;
  durationDays: number;
  maxGroupSize: number;
  minGroupSize: number;
  Location: string;
  isBestseller: boolean;
  reviewCount: number;
  averageRating: number | null;
}
