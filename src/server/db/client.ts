import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");
const SCHEMA_PATH = path.join(process.cwd(), "src/server/db/schema.sql");

function createConnection() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const connection = new Database(DB_PATH);
  connection.pragma("journal_mode = WAL");
  connection.pragma("foreign_keys = ON");
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
  connection.exec(schema);
  migrate(connection);
  return connection;
}

/** CREATE TABLE IF NOT EXISTS doesn't add columns to existing tables, so add them here. */
function ensureColumn(
  connection: Database.Database,
  table: string,
  column: string,
  ddl: string
) {
  const cols = connection.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    connection.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
  }
}

function migrate(connection: Database.Database) {
  ensureColumn(connection, "customers", "customer_type", "TEXT NOT NULL DEFAULT 'regular'");
  ensureColumn(connection, "product_variants", "partner_price", "INTEGER");
}

declare global {
  // eslint-disable-next-line no-var
  var __dbConnection: Database.Database | undefined;
}

export const db = globalThis.__dbConnection ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  globalThis.__dbConnection = db;
}
