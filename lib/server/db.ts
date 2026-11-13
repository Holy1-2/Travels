import mysql, {
  type Pool,
  type PoolConnection,
  type ResultSetHeader,
} from 'mysql2/promise';

const connection = {
  host: process.env.DB_HOST || process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? '',
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'hamubere_travels',
};

export const databaseName = connection.database;
export const databaseLabel = `${connection.user}@${connection.host}:${connection.port}/${connection.database}`;

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS bookings (
    reference        VARCHAR(16) PRIMARY KEY,
    kind             VARCHAR(16) NOT NULL,
    item_slug        VARCHAR(160) NOT NULL,
    item_name        VARCHAR(200) NOT NULL,
    guest_name       VARCHAR(160) NOT NULL,
    guest_email      VARCHAR(255) NOT NULL,
    guest_phone      VARCHAR(40) NOT NULL DEFAULT '',
    check_in         CHAR(10) NOT NULL,
    check_out        CHAR(10) NULL,
    guests           INT UNSIGNED NOT NULL,
    nights           INT UNSIGNED NOT NULL DEFAULT 0,
    unit_price       INT UNSIGNED NOT NULL,
    subtotal         INT UNSIGNED NOT NULL,
    service_fee      INT UNSIGNED NOT NULL,
    total            INT UNSIGNED NOT NULL,
    currency         CHAR(3) NOT NULL DEFAULT 'RWF',
    status           VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_status   VARCHAR(20) NOT NULL DEFAULT 'unpaid',
    notes            TEXT NOT NULL,
    created_at       VARCHAR(32) NOT NULL,
    updated_at       VARCHAR(32) NOT NULL,
    KEY idx_bookings_item_dates (kind, item_slug, check_in, check_out),
    KEY idx_bookings_email (guest_email),
    KEY idx_bookings_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS payments (
    id                 VARCHAR(40) PRIMARY KEY,
    booking_reference  VARCHAR(16) NOT NULL,
    provider           VARCHAR(20) NOT NULL,
    method             VARCHAR(20) NOT NULL,
    amount             INT UNSIGNED NOT NULL,
    currency           CHAR(3) NOT NULL,
    status             VARCHAR(20) NOT NULL DEFAULT 'pending',
    provider_reference VARCHAR(191) NULL,
    checkout_url       TEXT NULL,
    payer_phone        VARCHAR(40) NULL,
    failure_reason     TEXT NULL,
    created_at         VARCHAR(32) NOT NULL,
    updated_at         VARCHAR(32) NOT NULL,
    KEY idx_payments_booking (booking_reference),
    KEY idx_payments_provider_reference (provider_reference),
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_reference)
      REFERENCES bookings(reference) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS listing_requests (
    id            VARCHAR(20) PRIMARY KEY,
    property_name VARCHAR(200) NOT NULL,
    property_type VARCHAR(60) NOT NULL,
    region        VARCHAR(60) NOT NULL,
    rooms         INT UNSIGNED NOT NULL,
    contact_name  VARCHAR(160) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    phone         VARCHAR(40) NOT NULL,
    notes         TEXT NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at    VARCHAR(32) NOT NULL,
    KEY idx_listing_requests_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS booking_events (
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(16) NOT NULL,
    type              VARCHAR(60) NOT NULL,
    detail            TEXT NULL,
    created_at        VARCHAR(32) NOT NULL,
    KEY idx_booking_events_booking (booking_reference, created_at),
    CONSTRAINT fk_booking_events_booking FOREIGN KEY (booking_reference)
      REFERENCES bookings(reference) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS content_meta (
    \`key\`   VARCHAR(64) PRIMARY KEY,
    \`value\` TEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS stays (
    slug        VARCHAR(160) PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    type        VARCHAR(40) NOT NULL,
    region      VARCHAR(40) NOT NULL,
    location    VARCHAR(200) NOT NULL,
    price       INT UNSIGNED NOT NULL,
    rating      DECIMAL(2,1) NOT NULL DEFAULT 0,
    reviews     INT UNSIGNED NOT NULL DEFAULT 0,
    capacity    TINYINT UNSIGNED NOT NULL DEFAULT 2,
    beds        VARCHAR(160) NOT NULL DEFAULT '',
    images      LONGTEXT NOT NULL,
    tagline     VARCHAR(255) NOT NULL DEFAULT '',
    description LONGTEXT NOT NULL,
    amenities   LONGTEXT NOT NULL,
    nearby      LONGTEXT NOT NULL,
    host        VARCHAR(160) NOT NULL DEFAULT '',
    host_note   TEXT NOT NULL,
    badge       VARCHAR(80) NULL,
    is_demo     TINYINT(1) NOT NULL DEFAULT 0,
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  VARCHAR(32) NOT NULL,
    updated_at  VARCHAR(32) NOT NULL,
    KEY idx_stays_region (region)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS experiences (
    slug          VARCHAR(160) PRIMARY KEY,
    name          VARCHAR(200) NOT NULL,
    region        VARCHAR(40) NOT NULL,
    duration      VARCHAR(80) NOT NULL,
    price         INT UNSIGNED NOT NULL,
    group_size    VARCHAR(80) NOT NULL DEFAULT '',
    image         VARCHAR(255) NOT NULL DEFAULT '',
    summary       VARCHAR(500) NOT NULL DEFAULT '',
    description   LONGTEXT NOT NULL,
    includes      LONGTEXT NOT NULL,
    meeting_point VARCHAR(255) NOT NULL DEFAULT '',
    is_demo       TINYINT(1) NOT NULL DEFAULT 0,
    sort_order    INT NOT NULL DEFAULT 0,
    created_at    VARCHAR(32) NOT NULL,
    updated_at    VARCHAR(32) NOT NULL,
    KEY idx_experiences_region (region)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

declare global {
  // eslint-disable-next-line no-var
  var __hamubereMysqlPool: Promise<Pool> | undefined;
}

async function createPool(): Promise<Pool> {
  const bootstrap = await mysql.createConnection({
    host: connection.host,
    port: connection.port,
    user: connection.user,
    password: connection.password,
  });

  try {
    await bootstrap.query(
      `CREATE DATABASE IF NOT EXISTS \`${connection.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await bootstrap.end();
  }

  const pool = mysql.createPool({
    ...connection,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4_unicode_ci',
    multipleStatements: true,
    dateStrings: true,
  });

  await pool.query(SCHEMA_SQL);
  return pool;
}

export function getPool() {
  if (!global.__hamubereMysqlPool) {
    global.__hamubereMysqlPool = createPool().catch((error) => {
      global.__hamubereMysqlPool = undefined;
      throw error;
    });
  }
  return global.__hamubereMysqlPool;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = await getPool();
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  const rows = await query<T>(sql, params);
  return rows[0];
}

export async function execute(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
  const pool = await getPool();
  const [result] = await pool.query(sql, params);
  return result as ResultSetHeader;
}

export async function transaction<T>(
  work: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function ping() {
  const row = await queryOne<{ ok: number }>('SELECT 1 AS ok');
  return row?.ok === 1;
}

export function nowISO() {
  return new Date().toISOString();
}

export function minutesAgoISO(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}
