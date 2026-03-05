// app/api/user/dashboard/route.ts

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    const [allBookings, upcomingBookings, stats] = await Promise.all([
      // All bookings with full detail (last 20)
      prisma.booking.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          package: {
            select: {
              id: true,
              name: true,
              coverImage: true,
              durationDays: true,
              location: true,
            },
          },
          members: true,
        },
      }),

      // Upcoming confirmed trips
      prisma.booking.findMany({
        where: {
          userId,
          status: 'CONFIRMED',
          travelDate: { gte: now },
        },
        orderBy: { travelDate: 'asc' },
        take: 3,
        include: {
          package: {
            select: {
              id: true,
              name: true,
              coverImage: true,
              durationDays: true,
              location: true,
            },
          },
        },
      }),

      // Aggregate stats
      prisma.booking.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
        _sum: { total: true },
      }),
    ]);

    // Normalize stats
    const statMap = Object.fromEntries(
      stats.map((s) => [
        s.status,
        { count: s._count.status, revenue: s._sum.total ?? 0 },
      ]),
    );

    const totalSpent = stats.reduce(
      (acc, s) =>
        s.status === 'CONFIRMED' ? acc + Number(s._sum.total ?? 0) : acc,
      0,
    );

    return NextResponse.json({
      bookings: allBookings,
      upcomingTrips: upcomingBookings,
      stats: {
        total: allBookings.length,
        confirmed: statMap.CONFIRMED?.count ?? 0,
        pending: statMap.PENDING?.count ?? 0,
        cancelled: statMap.CANCELLED?.count ?? 0,
        totalSpent,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch user dashboard' },
      { status: 500 },
    );
  }
}
