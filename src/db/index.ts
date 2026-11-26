import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// prepare: false is required by Supabase's transaction pooler.
export const db = drizzle(
  postgres(process.env.DATABASE_URL!, { prepare: false }),
  { schema },
);
