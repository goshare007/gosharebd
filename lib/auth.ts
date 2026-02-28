import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  trustedOrigins: [`${process.env.NEXT_PUBLIC_API_URL}`],

  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Fires only when a brand new user row is inserted —
          // i.e. first-ever Google sign-in, not on subsequent logins.
          await prisma.subscriber.upsert({
            where: { email: user.email },
            update: {
              // They may have subscribed anonymously before signing up.
              // Backfill their name and ensure they're marked active.
              name: user.name ?? undefined,
              status: 'ACTIVE',
            },
            create: {
              email: user.email,
              name: user.name ?? undefined,
              source: 'google_signup',
              status: 'ACTIVE',
            },
          });
        },
      },
    },
  },

  plugins: [
    admin({
      defaultRole: 'USER',
      adminRoles: ['ADMIN'],
    }),
  ],
});
