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
    const travelDate = formData.get('travelDate') as string;

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

    const notes = formData.get('notes') as string | null;

    // Validate required fields
    if (!packageId || !travelDate || !group || !members) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Calculate subtotal using tier multipliers
    const pricePerPerson = Number(pkg.pricePerPerson);

    const subtotal = (Object.keys(group) as Array<keyof typeof group>).reduce(
      (sum, tier) =>
        sum + group[tier] * pricePerPerson * TIERS[tier].multiplier,
      0,
    );

    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;

    // Create booking + members in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      return tx.booking.create({
        data: {
          userId: session.user.id,
          packageId,
          travelDate: new Date(travelDate),
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
        include: {
          members: true,
        },
      });
    });

    return NextResponse.json(
      { message: 'Booking added successfully', bookingId: booking.id },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { message: 'Failed to add booking' },
      { status: 500 },
    );
  }
}
