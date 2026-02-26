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
