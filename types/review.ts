export interface ReviewType {
  id: string;
  packageId: string;
  userId: string;
  name: string;
  avatar: string | null;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
  isVerified: boolean;
  bookingId: string | null;
  images: ReviewImageType[];
}

export interface ReviewImageType {
  id: string;
  url: string;
  publicId: string;
}

export interface PackageReviewsType {
  reviews: ReviewType[];
  stats: {
    averageRating: number | null;
    reviewCount: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminReviewListItemType {
  id: string;
  rating: number;
  comment: string;
  approved: boolean;
  isVerified: boolean;
  date: string;
  package: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface AdminReviewListType {
  reviews: AdminReviewListItemType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubmitReviewPayload {
  packageId: string;
  rating: number;
  comment: string;
  images?: File[];
}
