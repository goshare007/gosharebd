import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as
      | 'PENDING'
      | 'CONFIRMED'
      | 'CANCELLED'
      | null;
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const where = status ? { status } : {};

    // 3. Bookings + total count in parallel
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          travelDate: true,
          createdAt: true,
          total: true,
          adultCount: true,
          preteenCount: true,
          childCount: true,
          infantCount: true,
          user: {
            select: { name: true, email: true },
          },
          package: {
            select: {
              name: true,
              coverImage: true,
              durationDays: true,
              destination: { select: { name: true } },
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    // 4. Tab counts — parallel
    const [pending, confirmed, cancelled] = await Promise.all([
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      counts: { all: total, pending, confirmed, cancelled },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 },
    );
  }
}
