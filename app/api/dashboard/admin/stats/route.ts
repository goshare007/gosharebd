// app/api/admin/stats/route.ts

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBookings,
      monthlyBookings,
      revenueAll,
      revenueMonth,
      popularPackages,
      recentBookings,
      bookingsByStatus,
    ] = await Promise.all([
      // Total bookings (all time)
      prisma.booking.count(),

      // Bookings this month
      prisma.booking.count({
        where: { createdAt: { gte: startOfMonth } },
      }),

      // Total revenue (all time) — only CONFIRMED bookings
      prisma.booking.aggregate({
        _sum: { total: true },
        where: { status: 'CONFIRMED' },
      }),

      // Revenue this month — only CONFIRMED bookings
      prisma.booking.aggregate({
        _sum: { total: true },
        where: {
          status: 'CONFIRMED',
          createdAt: { gte: startOfMonth },
        },
      }),

      // Popular packages by booking count (top 5)
      prisma.booking.groupBy({
        by: ['packageId'],
        _count: { packageId: true },
        _sum: { total: true },
        orderBy: { _count: { packageId: 'desc' } },
        take: 5,
      }),

      // Recent bookings (last 10)
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          package: { select: { id: true, name: true, coverImage: true } },
        },
      }),

      // Bookings grouped by status
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    // Hydrate popular packages with their package details
    const popularPackageIds = popularPackages.map((p) => p.packageId);
    const packageDetails = await prisma.package.findMany({
      where: { id: { in: popularPackageIds } },
      select: {
        id: true,
        name: true,
        coverImage: true,
        destination: { select: { name: true } },
      },
    });

    const packageMap = Object.fromEntries(packageDetails.map((p) => [p.id, p]));

    const popularPackagesHydrated = popularPackages.map((p) => ({
      package: packageMap[p.packageId] ?? null,
      bookingCount: p._count.packageId,
      totalRevenue: p._sum.total ?? 0,
    }));

    // Normalize booking status counts
    const statusCounts = Object.fromEntries(
      bookingsByStatus.map((b) => [b.status, b._count.status]),
    );

    return NextResponse.json({
      bookings: {
        total: totalBookings,
        thisMonth: monthlyBookings,
        byStatus: {
          pending: statusCounts.PENDING ?? 0,
          confirmed: statusCounts.CONFIRMED ?? 0,
          cancelled: statusCounts.CANCELLED ?? 0,
        },
      },
      revenue: {
        total: revenueAll._sum.total ?? 0,
        thisMonth: revenueMonth._sum.total ?? 0,
      },
      popularPackages: popularPackagesHydrated,
      recentBookings,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 },
    );
  }
}
