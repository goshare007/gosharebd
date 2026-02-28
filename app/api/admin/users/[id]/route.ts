// app/api/admin/users/[id]/route.ts

import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

const patchSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('ban'),
    banReason: z.string().min(1, 'Reason is required'),
    banExpires: z.string().datetime().optional().nullable(),
  }),
  z.object({ action: z.literal('unban') }),
  z.object({
    action: z.literal('setRole'),
    role: z.enum(['USER', 'ADMIN']),
  }),
]);

type RouteParams = { params: Promise<{ id: string }> };

// ─── PATCH — ban / unban / setRole ────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Prevent admin from acting on themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot modify your own account' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.action === 'ban') {
      // Use better-auth admin plugin to ban — keeps session invalidation in sync
      await auth.api.banUser({
        headers: await headers(),
        body: {
          userId: id,
          banReason: data.banReason,
          banExpiresIn: data.banExpires
            ? Math.floor(
                (new Date(data.banExpires).getTime() - Date.now()) / 1000,
              )
            : undefined,
        },
      });
    }

    if (data.action === 'unban') {
      await auth.api.unbanUser({
        headers: await headers(),
        body: { userId: id },
      });
    }

    if (data.action === 'setRole') {
      await prisma.user.update({
        where: { id },
        data: { role: data.role },
      });
    }

    const updated = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        _count: { select: { bookings: true, reviews: true } },
      },
    });

    return NextResponse.json({ user: updated });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    );
  }
}

// ─── DELETE — hard delete user ────────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 },
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 },
    );
  }
}
