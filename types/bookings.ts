export interface AdminBookingListType {
  bookings: [
    bookings: {
      id: string;
      status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
      travelDate: string;
      createdAt: string;
      total: number;
      adultCount: number;
      preteenCount: number;
      childCount: number;
      infantCount: number;
      user: { name: string; email: string };
      package: {
        name: string;
        coverImage: string;
        durationDays: number;
        destination: { name: string };
      };
    },
  ];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
  counts: {
    all: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}

export interface BookingDetailsType {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  travelDate: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  adultCount: number;
  preteenCount: number;
  childCount: number;
  infantCount: number;
  subtotal: number;
  vat: number;
  total: number;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  package: {
    id: string;
    name: string;
    coverImage: string;
    durationDays: number;
    Location: string;
    destination: {
      name: string;
      division: string;
    };
  };
  members: [
    {
      id: string;
      type: string;
      fullName: string;
      gender: string;
      email: string;
      phone: string;
      idNumber: string;
    },
  ];
}

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

export type Booking = {
  id: string;
  status: BookingStatus;
  travelDate: string;
  notes?: string;
  adultCount: number;
  preteenCount: number;
  childCount: number;
  infantCount: number;
  subtotal: string;
  vat: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  package: {
    id: string;
    name: string;
    coverImage: string;
    durationDays: number;
    Location: string;
    destination: { id: string; name: string };
  };
  members: BookingMember[];
};

export type BookingsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type BookingsResponse = {
  bookings: Booking[];
  pagination: BookingsPagination;
};

export type BookingsParams = {
  status?: BookingStatus | 'ALL';
  page?: number;
  limit?: number;
};
