import "server-only";
import { db } from "@/db";
import { activity } from "@/db/schema";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Pass the transaction of the change being recorded, so the change and its Activity row land together.
export function logActivity(tx: Tx, row: typeof activity.$inferInsert) {
  return tx.insert(activity).values(row);
}
