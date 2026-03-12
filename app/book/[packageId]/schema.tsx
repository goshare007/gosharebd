import z from 'zod';

// ─── Member schema ────────────────────────────────────────────────────────────

export const memberSchema = z.object({
  type: z.enum(['adult', 'preteen']),

  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long')
    .regex(/^[\p{L}\s'.,-]+$/u, 'Full name contains invalid characters'),

  gender: z.enum(['male', 'female', 'other']),

  idNumber: z
    .string()
    .min(5, 'Enter a valid ID or passport number')
    .max(30, 'ID number is too long')
    .regex(/^[A-Z0-9\s-]+$/i, 'ID number contains invalid characters'),

  email: z.string().email({ message: 'Enter a valid email address' }),

  phone: z
    .string()
    .min(11, 'Phone number must be at least 11 digits')
    .max(15, 'Phone number is too long')
    // Accepts local BD (01XXXXXXXXX) and international (+8801XXXXXXXXX) formats
    .regex(
      /^(\+?88)?01[3-9]\d{8}$/,
      'Enter a valid Bangladeshi phone number (e.g. 01712345678)',
    ),
});

// ─── Booking schema ───────────────────────────────────────────────────────────

export const bookingSchema = z.object({
  // departureId is required — users must select a specific scheduled departure,
  // not a free-form date. The API links the booking to Departure.id.
  departureId: z.string().min(1, 'Please select a departure date'),

  group: z.object({
    adult: z.number().int().min(1, 'At least 1 adult is required'),
    preteen: z.number().int().min(0),
    child: z.number().int().min(0),
    infant: z.number().int().min(0),
  }),

  members: z.array(memberSchema).min(1, 'At least one traveller is required'),

  notes: z
    .string()
    .max(500, 'Notes must be 500 characters or fewer')
    .optional(),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type GroupMember = z.infer<typeof memberSchema>;
