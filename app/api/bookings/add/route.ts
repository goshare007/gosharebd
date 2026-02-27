// app/api/bookings/add/route.ts

import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { TIERS, VAT_RATE } from '@/constants/vat-rate';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const packageId = formData.get('packageId') as string;
    const departureId = formData.get('departureId') as string;
    const notes = formData.get('notes') as string | null;

    let group: {
      adult: number;
      preteen: number;
      child: number;
      infant: number;
    };

    let members: {
      type: 'adult' | 'preteen';
      fullName: string;
      gender: 'male' | 'female' | 'other';
      idNumber: string;
      email: string;
      phone: string;
    }[];

    try {
      group = JSON.parse(formData.get('group') as string);
      members = JSON.parse(formData.get('members') as string);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format in group or members' },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!packageId || !departureId || !group || !members) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: packageId, departureId, group, members',
        },
        { status: 400 },
      );
    }

    // Fetch package for pricing and validation
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    if (!pkg.isActive) {
      return NextResponse.json(
        { error: 'Package is not available' },
        { status: 400 },
      );
    }

    // Validate group size
    const totalPax = group.adult + group.preteen + group.child + group.infant;

    if (totalPax < pkg.minGroupSize || totalPax > pkg.maxGroupSize) {
      return NextResponse.json(
        {
          error: `Group size must be between ${pkg.minGroupSize} and ${pkg.maxGroupSize}`,
        },
        { status: 400 },
      );
    }

    // Validate departure exists, belongs to this package, and has seats
    const departure = await prisma.departure.findFirst({
      where: { id: departureId, packageId },
    });

    if (!departure) {
      return NextResponse.json(
        { error: 'Departure not found for this package' },
        { status: 404 },
      );
    }

    if (departure.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error: `This departure is ${departure.status.toLowerCase()} and cannot be booked`,
        },
        { status: 400 },
      );
    }

    const seatsLeft = departure.totalSeats - departure.bookedSeats;

    if (totalPax > seatsLeft) {
      return NextResponse.json(
        {
          error: `Not enough seats. Only ${seatsLeft} seat${seatsLeft !== 1 ? 's' : ''} remaining on this departure`,
        },
        { status: 409 },
      );
    }

    // Calculate pricing — use departure price override if set, else fall back to package
    const pricePerPerson = departure.pricePerPerson
      ? Number(departure.pricePerPerson)
      : Number(pkg.pricePerPerson);

    const subtotal = (Object.keys(group) as Array<keyof typeof group>).reduce(
      (sum, tier) =>
        sum + group[tier] * pricePerPerson * TIERS[tier].multiplier,
      0,
    );

    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;

    // Atomic transaction:
    // 1. Re-check seat availability with a row lock (select for update via updateMany)
    // 2. Increment bookedSeats
    // 3. Flip status to FULL if no seats remain after this booking
    // 4. Create booking + members
    const booking = await prisma.$transaction(async (tx) => {
      // Atomically increment bookedSeats only if enough remain
      const updated = await tx.departure.updateMany({
        where: {
          id: departureId,
          status: 'ACTIVE',
          // Ensure seats are still available at the moment of commit
          bookedSeats: { lte: departure.totalSeats - totalPax },
        },
        data: {
          bookedSeats: { increment: totalPax },
        },
      });

      // If 0 rows updated → seats were grabbed by a concurrent request
      if (updated.count === 0) {
        throw new Error('SEATS_UNAVAILABLE');
      }

      // Flip to FULL if now at capacity
      const newBookedSeats = departure.bookedSeats + totalPax;
      if (newBookedSeats >= departure.totalSeats) {
        await tx.departure.update({
          where: { id: departureId },
          data: { status: 'FULL' },
        });
      }

      // Create booking — travelDate is frozen snapshot of departure.startDate
      return tx.booking.create({
        data: {
          userId: session.user.id,
          packageId,
          departureId,
          travelDate: departure.startDate,
          notes: notes ?? undefined,
          adultCount: group.adult,
          preteenCount: group.preteen,
          childCount: group.child,
          infantCount: group.infant,
          subtotal,
          vat,
          total,
          status: 'PENDING',
          members: {
            create: members.map((m) => ({
              type: m.type,
              fullName: m.fullName,
              gender: m.gender,
              idNumber: m.idNumber,
              email: m.email,
              phone: m.phone,
            })),
          },
        },
        include: { members: true },
      });
    });

    return NextResponse.json(
      { message: 'Booking added successfully', bookingId: booking.id },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'SEATS_UNAVAILABLE') {
      return NextResponse.json(
        {
          error:
            'Sorry, this departure just became fully booked. Please choose another date.',
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to add booking' },
      { status: 500 },
    );
  }
}
