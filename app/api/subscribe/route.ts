import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, name, source } = parsed.data;

    const existing = await prisma.subscriber.findUnique({
      where: { email },
      select: { status: true },
    });

    // Already actively subscribed — no need to update anything
    if (existing?.status === 'ACTIVE') {
      return NextResponse.json(
        { message: 'You are already subscribed.' },
        { status: 200 },
      );
    }

    // Re-subscribing after opting out — reactivate
    if (existing?.status === 'UNSUBSCRIBED') {
      await prisma.subscriber.update({
        where: { email },
        data: {
          status: 'ACTIVE',
          name: name ?? undefined,
          unsubscribedAt: null,
          subscribedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: 'Welcome back! You are now subscribed.',
      });
    }

    // Brand new subscriber
    await prisma.subscriber.create({
      data: {
        email,
        name: name ?? undefined,
        source: source ?? 'newsletter_form',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(
      { message: 'Thank you for subscribing!' },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
