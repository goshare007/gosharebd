// types/bookings.ts

// ─── Shared ───────────────────────────────────────────────────────────────────

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type BookingMember = {
  id: string;
  type: 'adult' | 'preteen';
  fullName: string;
  gender: 'male' | 'female' | 'other';
  idNumber: string;
  email: string;
  phone: string;
};

export type BookingPackage = {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  durationDays: number;
  location: string;
  division: string;
};

export type BookingsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// ─── My bookings ──────────────────────────────────────────────────────────────

// Prisma returns Decimal as string over JSON
export type Booking = {
  id: string;
  userId: string;
  packageId: string;
  departureId: string;
  travelDate: string;
  notes: string | null;
  adultCount: number;
  preteenCount: number;
  childCount: number;
  infantCount: number;
  subtotal: string;
  vat: string;
  total: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  package: BookingPackage;
  members: BookingMember[];
};

export type BookingsParams = {
  status?: BookingStatus | 'ALL';
  page?: number;
  limit?: number;
};

export type BookingsResponse = {
  bookings: Booking[];
  pagination: BookingsPagination;
};

// ─── Admin booking list ───────────────────────────────────────────────────────

export type AdminBooking = {
  id: string;
  status: BookingStatus;
  travelDate: string;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
  subtotal: string;
  vat: string;
  total: string;
  adultCount: number;
  preteenCount: number;
  childCount: number;
  infantCount: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  package: {
    id: string;
    name: string;
    slug: string;
    coverImage: string;
    durationDays: number;
    location: string;
    division: string;
  };
  members: BookingMember[];
};

export type AdminBookingListType = {
  bookings: AdminBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  counts: {
    all: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
};

// ─── Admin single booking detail ──────────────────────────────────────────────

export type BookingDetailsType = {
  id: string;
  status: BookingStatus;
  travelDate: string;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
  adultCount: number;
  preteenCount: number;
  childCount: number;
  infantCount: number;
  subtotal: string;
  vat: string;
  total: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  package: {
    id: string;
    name: string;
    slug: string;
    coverImage: string;
    durationDays: number;
    location: string;
    division: string;
  };
  members: BookingMember[];
};
