import z from 'zod';
// ─── Zod Schema ───────────────────────────────────────────────────────────────
export const memberSchema = z.object({
  type: z.enum(['adult', 'preteen']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']),
  idNumber: z.string().min(5, 'Enter a valid ID or passport number'),
  email: z.email({ message: 'Enter a valid email address' }),
  phone: z
    .string()
    .min(11, 'Phone number must be at least 11 digits')
    .regex(/^[+\d\s\-()]+$/, 'Enter a valid phone number'),
});

export const bookingSchema = z.object({
  travelDate: z.date('Please pick a travel date'),
  group: z.object({
    adult: z.number().min(1, 'At least 1 adult is required'),
    preteen: z.number().min(0),
    child: z.number().min(0),
    infant: z.number().min(0),
  }),
  members: z.array(memberSchema).min(1),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type GroupMember = z.infer<typeof memberSchema>;
