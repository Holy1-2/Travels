import { execute, getPool, nowISO, query, queryOne, transaction } from './db';
import {
  experiences as demoExperiences,
  regions,
  stays as demoStays,
  type Experience,
  type RegionSlug,
  type Stay,
  type StayType,
} from '@/lib/data';

export interface StayRow {
  slug: string;
  name: string;
  type: StayType;
  region: RegionSlug;
  location: string;
  price: number;
  rating: number | string;
  reviews: number;
  capacity: number;
  beds: string;
  images: string;
  tagline: string;
  description: string;
  amenities: string;
  nearby: string;
  host: string;
  host_note: string;
  badge: string | null;
  is_demo: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceRow {
  slug: string;
  name: string;
  region: RegionSlug;
  duration: string;
  price: number;
  group_size: string;
  image: string;
  summary: string;
  description: string;
  includes: string;
  meeting_point: string;
  is_demo: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

let contentReady: Promise<void> | undefined;

export function ensureContentSchema(): Promise<void> {
  if (!contentReady) {
    contentReady = (async () => {
      await getPool();
      await seedDemoContent(false);
    })().catch((error) => {
      contentReady = undefined;
      throw error;
    });
  }
  return contentReady;
}

function parseArray<T>(value: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function mapStay(row: StayRow): Stay {
  return {
    slug: row.slug,
    name: row.name,
    type: row.type,
    region: row.region,
    location: row.location,
    price: Number(row.price),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    capacity: Number(row.capacity),
    beds: row.beds,
    images: parseArray<string>(row.images, []),
    tagline: row.tagline,
    description: parseArray<string>(row.description, []),
    amenities: parseArray<string>(row.amenities, []),
    nearby: parseArray<{ name: string; distance: string }>(row.nearby, []),
    host: row.host,
    hostNote: row.host_note,
    ...(row.badge ? { badge: row.badge } : {}),
  };
}

export function mapExperience(row: ExperienceRow): Experience {
  return {
    slug: row.slug,
    name: row.name,
    region: row.region,
    duration: row.duration,
    price: Number(row.price),
    groupSize: row.group_size,
    image: row.image,
    summary: row.summary,
    description: parseArray<string>(row.description, []),
    includes: parseArray<string>(row.includes, []),
    meetingPoint: row.meeting_point,
  };
}

export async function getStays(): Promise<Stay[]> {
  await ensureContentSchema();
  const rows = await query<StayRow>('SELECT * FROM stays ORDER BY sort_order ASC, name ASC');
  return rows.map(mapStay);
}

export async function getStayBySlug(slug: string): Promise<Stay | undefined> {
  await ensureContentSchema();
  const row = await queryOne<StayRow>('SELECT * FROM stays WHERE slug = ?', [slug]);
  return row ? mapStay(row) : undefined;
}

export async function getExperiences(): Promise<Experience[]> {
  await ensureContentSchema();
  const rows = await query<ExperienceRow>(
    'SELECT * FROM experiences ORDER BY sort_order ASC, name ASC'
  );
  return rows.map(mapExperience);
}

export async function getExperienceBySlug(slug: string): Promise<Experience | undefined> {
  await ensureContentSchema();
  const row = await queryOne<ExperienceRow>('SELECT * FROM experiences WHERE slug = ?', [slug]);
  return row ? mapExperience(row) : undefined;
}

export async function getStaysInRegion(region: RegionSlug) {
  const all = await getStays();
  return all.filter((stay) => stay.region === region);
}

export async function getExperiencesInRegion(region: RegionSlug) {
  const all = await getExperiences();
  return all.filter((experience) => experience.region === region);
}

export function getRegions() {
  return regions;
}

export async function countContent() {
  await ensureContentSchema();
  const stays = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM stays');
  const experiences = await queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM experiences'
  );
  const demoStays = await queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM stays WHERE is_demo = 1'
  );
  const demoExperiences = await queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM experiences WHERE is_demo = 1'
  );

  return {
    stays: Number(stays?.count ?? 0),
    experiences: Number(experiences?.count ?? 0),
    demoStays: Number(demoStays?.count ?? 0),
    demoExperiences: Number(demoExperiences?.count ?? 0),
  };
}

async function setMeta(key: string, value: string) {
  await execute(
    'INSERT INTO content_meta (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
    [key, value]
  );
}

async function getMeta(key: string) {
  const row = await queryOne<{ value: string }>('SELECT `value` FROM content_meta WHERE `key` = ?', [
    key,
  ]);
  return row?.value;
}

interface StayValues {
  slug: string;
  name: string;
  type: string;
  region: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  capacity: number;
  beds: string;
  images: string;
  tagline: string;
  description: string;
  amenities: string;
  nearby: string;
  host: string;
  host_note: string;
  badge: string | null;
  is_demo: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function stayValues(stay: Stay, index: number, timestamp: string, isDemo: number): StayValues {
  return {
    slug: stay.slug,
    name: stay.name,
    type: stay.type,
    region: stay.region,
    location: stay.location,
    price: stay.price,
    rating: stay.rating,
    reviews: stay.reviews,
    capacity: stay.capacity,
    beds: stay.beds,
    images: JSON.stringify(stay.images),
    tagline: stay.tagline,
    description: JSON.stringify(stay.description),
    amenities: JSON.stringify(stay.amenities),
    nearby: JSON.stringify(stay.nearby),
    host: stay.host,
    host_note: stay.hostNote,
    badge: stay.badge ?? null,
    is_demo: isDemo,
    sort_order: index,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

const UPSERT_STAY = `
  INSERT INTO stays (
    slug, name, type, region, location, price, rating, reviews, capacity, beds,
    images, tagline, description, amenities, nearby, host, host_note, badge,
    is_demo, sort_order, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    name = VALUES(name), type = VALUES(type), region = VALUES(region),
    location = VALUES(location), price = VALUES(price), rating = VALUES(rating),
    reviews = VALUES(reviews), capacity = VALUES(capacity), beds = VALUES(beds),
    images = VALUES(images), tagline = VALUES(tagline), description = VALUES(description),
    amenities = VALUES(amenities), nearby = VALUES(nearby), host = VALUES(host),
    host_note = VALUES(host_note), badge = VALUES(badge), is_demo = VALUES(is_demo),
    sort_order = VALUES(sort_order), updated_at = VALUES(updated_at)
`;

function stayParams(values: StayValues) {
  return [
    values.slug,
    values.name,
    values.type,
    values.region,
    values.location,
    values.price,
    values.rating,
    values.reviews,
    values.capacity,
    values.beds,
    values.images,
    values.tagline,
    values.description,
    values.amenities,
    values.nearby,
    values.host,
    values.host_note,
    values.badge,
    values.is_demo,
    values.sort_order,
    values.created_at,
    values.updated_at,
  ];
}

interface ExperienceValues {
  slug: string;
  name: string;
  region: string;
  duration: string;
  price: number;
  group_size: string;
  image: string;
  summary: string;
  description: string;
  includes: string;
  meeting_point: string;
  is_demo: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function experienceValues(
  experience: Experience,
  index: number,
  timestamp: string,
  isDemo: number
): ExperienceValues {
  return {
    slug: experience.slug,
    name: experience.name,
    region: experience.region,
    duration: experience.duration,
    price: experience.price,
    group_size: experience.groupSize,
    image: experience.image,
    summary: experience.summary,
    description: JSON.stringify(experience.description),
    includes: JSON.stringify(experience.includes),
    meeting_point: experience.meetingPoint,
    is_demo: isDemo,
    sort_order: index,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

const UPSERT_EXPERIENCE = `
  INSERT INTO experiences (
    slug, name, region, duration, price, group_size, image, summary, description,
    includes, meeting_point, is_demo, sort_order, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    name = VALUES(name), region = VALUES(region), duration = VALUES(duration),
    price = VALUES(price), group_size = VALUES(group_size), image = VALUES(image),
    summary = VALUES(summary), description = VALUES(description),
    includes = VALUES(includes), meeting_point = VALUES(meeting_point),
    is_demo = VALUES(is_demo), sort_order = VALUES(sort_order),
    updated_at = VALUES(updated_at)
`;

function experienceParams(values: ExperienceValues) {
  return [
    values.slug,
    values.name,
    values.region,
    values.duration,
    values.price,
    values.group_size,
    values.image,
    values.summary,
    values.description,
    values.includes,
    values.meeting_point,
    values.is_demo,
    values.sort_order,
    values.created_at,
    values.updated_at,
  ];
}

/**
 * The original site content is inserted once so the site works out of the box.
 * Every seeded row is flagged `is_demo = 1` and can be removed from the admin
 * panel without touching anything an admin has created.
 */
export async function seedDemoContent(force = false) {
  await getPool();

  const marker = await getMeta('demo_seeded');
  if (!force && marker) return { seeded: false, stays: 0, experiences: 0 };

  const existing = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM stays');
  const existingExperiences = await queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM experiences'
  );

  if (!force && (Number(existing?.count ?? 0) > 0 || Number(existingExperiences?.count ?? 0) > 0)) {
    await setMeta('demo_seeded', '1');
    return { seeded: false, stays: 0, experiences: 0 };
  }

  const timestamp = nowISO();

  await transaction(async (connection) => {
    if (force) {
      await connection.query('DELETE FROM stays WHERE is_demo = 1');
      await connection.query('DELETE FROM experiences WHERE is_demo = 1');
    }

    for (const [index, stay] of demoStays.entries()) {
      await connection.query(UPSERT_STAY, stayParams(stayValues(stay, index, timestamp, 1)));
    }

    for (const [index, experience] of demoExperiences.entries()) {
      await connection.query(
        UPSERT_EXPERIENCE,
        experienceParams(experienceValues(experience, index, timestamp, 1))
      );
    }

    await connection.query(
      'INSERT INTO content_meta (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
      ['demo_seeded', '1']
    );
  });

  return { seeded: true, stays: demoStays.length, experiences: demoExperiences.length };
}

export async function clearDemoContent() {
  await getPool();
  const [stays, experiences] = await transaction(async (connection) => {
    const [stayResult] = await connection.query('DELETE FROM stays WHERE is_demo = 1');
    const [experienceResult] = await connection.query('DELETE FROM experiences WHERE is_demo = 1');
    await connection.query(
      'INSERT INTO content_meta (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
      ['demo_seeded', 'cleared']
    );
    return [
      (stayResult as { affectedRows: number }).affectedRows,
      (experienceResult as { affectedRows: number }).affectedRows,
    ];
  });

  return { stays, experiences };
}

export interface StayInput {
  slug: string;
  name: string;
  type: StayType;
  region: RegionSlug;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  capacity: number;
  beds: string;
  images: string[];
  tagline: string;
  description: string[];
  amenities: string[];
  nearby: { name: string; distance: string }[];
  host: string;
  hostNote: string;
  badge?: string | null;
}

export async function saveStay(input: StayInput, slug?: string) {
  await ensureContentSchema();
  const timestamp = nowISO();

  if (slug && slug !== input.slug) {
    await execute('DELETE FROM stays WHERE slug = ?', [slug]);
  }

  const existing = await queryOne<{ sort_order: number }>(
    'SELECT sort_order FROM stays WHERE slug = ?',
    [input.slug]
  );

  const values = stayValues(
    {
      ...input,
      badge: input.badge ?? undefined,
    } as Stay,
    existing?.sort_order ?? 1000,
    timestamp,
    0
  );

  await execute(UPSERT_STAY, stayParams(values));
  return getStayBySlug(input.slug);
}

export async function deleteStay(slug: string) {
  await ensureContentSchema();
  const result = await execute('DELETE FROM stays WHERE slug = ?', [slug]);
  return result.affectedRows > 0;
}

export interface ExperienceInput {
  slug: string;
  name: string;
  region: RegionSlug;
  duration: string;
  price: number;
  groupSize: string;
  image: string;
  summary: string;
  description: string[];
  includes: string[];
  meetingPoint: string;
}

export async function saveExperience(input: ExperienceInput, slug?: string) {
  await ensureContentSchema();
  const timestamp = nowISO();

  if (slug && slug !== input.slug) {
    await execute('DELETE FROM experiences WHERE slug = ?', [slug]);
  }

  const existing = await queryOne<{ sort_order: number }>(
    'SELECT sort_order FROM experiences WHERE slug = ?',
    [input.slug]
  );

  const values = experienceValues(input as Experience, existing?.sort_order ?? 1000, timestamp, 0);

  await execute(UPSERT_EXPERIENCE, experienceParams(values));
  return getExperienceBySlug(input.slug);
}

export async function deleteExperience(slug: string) {
  await ensureContentSchema();
  const result = await execute('DELETE FROM experiences WHERE slug = ?', [slug]);
  return result.affectedRows > 0;
}

export interface ListingRequestRecord {
  id: string;
  propertyName: string;
  propertyType: string;
  region: string;
  rooms: number;
  contactName: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  createdAt: string;
}

export async function getListingRequests(): Promise<ListingRequestRecord[]> {
  await ensureContentSchema();
  const rows = await query<{
    id: string;
    property_name: string;
    property_type: string;
    region: string;
    rooms: number;
    contact_name: string;
    email: string;
    phone: string;
    notes: string;
    status: string;
    created_at: string;
  }>('SELECT * FROM listing_requests ORDER BY created_at DESC');

  return rows.map((row) => ({
    id: row.id,
    propertyName: row.property_name,
    propertyType: row.property_type,
    region: row.region,
    rooms: Number(row.rooms),
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function updateListingRequestStatus(id: string, status: string) {
  await ensureContentSchema();
  await execute('UPDATE listing_requests SET status = ? WHERE id = ?', [status, id]);
  const requests = await getListingRequests();
  return requests.find((request) => request.id === id);
}
