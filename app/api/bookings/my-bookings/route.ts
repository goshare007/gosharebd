import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { BookingStatus } from '@/prisma/generated/prisma/client/enums';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') as BookingStatus | 'ALL' | null;
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(20, Number(searchParams.get('limit') ?? '10'));
    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(status && status !== 'ALL' ? { status } : {}),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          package: {
            select: {
              id: true,
              name: true,
              coverImage: true,
              durationDays: true,
              Location: true,
              destination: { select: { id: true, name: true } },
            },
          },
          members: {
            select: {
              id: true,
              type: true,
              fullName: true,
              gender: true,
              idNumber: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 },
    );
  }
}
