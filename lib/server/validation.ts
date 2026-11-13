import { z } from 'zod';
import { STAY_TYPES, regions, type RegionSlug, type StayType } from '@/lib/data';

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date (YYYY-MM-DD).');

export const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Enter a phone number we can reach you on.')
  .max(30)
  .regex(/^[+0-9()\s-]+$/, 'Phone numbers can only contain digits and + ( ) -.');

export const createBookingSchema = z.object({
  kind: z.enum(['stay', 'experience']),
  slug: z.string().trim().min(1).max(90),
  checkIn: isoDate,
  checkOut: isoDate.optional().nullable(),
  guests: z.coerce.number().int().min(1).max(10),
  guest: z.object({
    name: z.string().trim().min(2, 'Enter your full name.').max(120),
    email: z.string().trim().email('Enter a valid email address.').max(160),
    phone: phoneSchema,
  }),
  notes: z.string().trim().max(1000).optional().default(''),
});

export const startPaymentSchema = z.object({
  method: z.enum(['card', 'mtn', 'airtel']),
  phone: phoneSchema.optional(),
});

export const confirmPaymentSchema = z.object({
  paymentId: z.string().trim().min(10).max(60),
});

export const cancelBookingSchema = z.object({
  email: z.string().trim().email().max(160),
});

export const lookupBookingSchema = z.object({
  reference: z.string().trim().min(4).max(20).transform((value) => value.toUpperCase()),
  email: z.string().trim().email().max(160),
});

const slugSchema = z
  .string()
  .trim()
  .min(2, 'Use at least two characters.')
  .max(90)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only.');

const stayTypeSchema = z.enum(STAY_TYPES as unknown as [StayType, ...StayType[]]);

const REGION_SLUGS = regions.map((region) => region.slug) as [RegionSlug, ...RegionSlug[]];
const regionSchema = z.enum(REGION_SLUGS);

const textLine = z.string().trim().min(1, 'This line cannot be empty.').max(2000);

export const adminStaySchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2).max(140),
  type: stayTypeSchema,
  region: regionSchema,
  location: z.string().trim().min(2).max(160),
  price: z.coerce.number().int().min(1, 'Add a nightly price.').max(50_000_000),
  rating: z.coerce.number().min(0).max(5),
  reviews: z.coerce.number().int().min(0).max(1_000_000),
  capacity: z.coerce.number().int().min(1).max(50),
  beds: z.string().trim().min(1).max(120),
  images: z.array(z.string().trim().min(1).max(500)).min(1, 'Add at least one image path.'),
  tagline: z.string().trim().min(4).max(240),
  description: z.array(textLine).min(1, 'Add at least one description paragraph.'),
  amenities: z.array(textLine).min(1, 'Add at least one amenity.'),
  nearby: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        distance: z.string().trim().min(1).max(60),
      })
    )
    .default([]),
  host: z.string().trim().min(2).max(120),
  hostNote: z.string().trim().max(600).default(''),
  badge: z.string().trim().max(40).optional().nullable(),
});

export const adminExperienceSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2).max(140),
  region: regionSchema,
  duration: z.string().trim().min(2).max(80),
  price: z.coerce.number().int().min(1, 'Add a price per person.').max(50_000_000),
  groupSize: z.string().trim().min(1).max(80),
  image: z.string().trim().min(1).max(500),
  summary: z.string().trim().min(10).max(400),
  description: z.array(textLine).min(1, 'Add at least one description paragraph.'),
  includes: z.array(textLine).min(1, 'Add at least one inclusion.'),
  meetingPoint: z.string().trim().min(2).max(200),
});

export const adminBookingUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['unpaid', 'processing', 'paid', 'failed', 'refunded']).optional(),
  note: z.string().trim().max(500).optional(),
});

export const adminListingUpdateSchema = z.object({
  status: z.enum(['new', 'reviewing', 'approved', 'declined']),
});

export const listingRequestSchema = z.object({
  propertyName: z.string().trim().min(2, 'Enter the property name.').max(140),
  propertyType: z
    .string()
    .trim()
    .refine((value) => (STAY_TYPES as readonly string[]).includes(value), 'Choose a property type.'),
  region: z
    .string()
    .trim()
    .refine((value) => regions.some((region) => region.slug === value), 'Choose a region.'),
  rooms: z.coerce.number().int().min(1, 'Add at least one room.').max(200),
  contactName: z.string().trim().min(2, 'Enter your name.').max(120),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: phoneSchema,
  notes: z.string().trim().max(2000).optional().default(''),
});
