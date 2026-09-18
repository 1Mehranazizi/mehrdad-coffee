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
  return connection;
}

declare global {
  // eslint-disable-next-line no-var
  var __dbConnection: Database.Database | undefined;
}

export const db = globalThis.__dbConnection ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  globalThis.__dbConnection = db;
}
