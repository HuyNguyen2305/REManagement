import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Reuse one pool across dev hot reloads so Supabase doesn't run out of connections.
const globalForDb = globalThis as { pg?: postgres.Sql };
// prepare: false is required by Supabase's transaction pooler.
const client =
  globalForDb.pg ?? postgres(process.env.DATABASE_URL!, { prepare: false });
if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema });
