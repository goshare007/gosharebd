export interface AdminDashboardStats {
  bookings: {
    total: number;
    thisMonth: number;
    byStatus: {
      pending: number;
      confirmed: number;
      cancelled: number;
    };
  };
  revenue: {
    total: number;
    thisMonth: number;
  };
  popularPackages: [
    {
      package: {
        id: string;
        name: string;
        coverImage: string;
        destination: {
          name: string;
        };
      };
      bookingCount: number;
      totalRevenue: number;
    },
  ];

  recentBookings: [
    {
      id: string;
      user: {
        name: string;
        email: string;
        image: string;
      };
      package: {
        name: string;
      };
      total: number;
      travelDate: string;
      status: string;
    },
  ];
}

export interface UserDashboardStats {
  bookings: Array<{
    id: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    travelDate: string;
    adultCount: number;
    preteenCount: number;
    childCount: number;
    infantCount: number;
    subtotal: string;
    vat: string;
    total: string;
    notes?: string;
    createdAt: string;
    package: {
      id: string;
      name: string;
      coverImage: string;
      durationDays: number;
      location: string;
    };
    members: Array<{
      id: string;
      type: string;
      fullName: string;
      gender: string;
    }>;
  }>;
  upcomingTrips: Array<{
    id: string;
    status: string;
    travelDate: string;
    adultCount: number;
    total: string;
    package: {
      id: string;
      name: string;
      coverImage: string;
      durationDays: number;
      Location: string;
      destination: { name: string };
    };
  }>;
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    totalSpent: number;
  };
}
