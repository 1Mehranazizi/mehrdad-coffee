import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type GrindType = {
  id: string;
  title: string;
  sortOrder: number;
};

type GrindTypeRow = {
  id: string;
  title: string;
  sort_order: number;
};

function mapRow(row: GrindTypeRow): GrindType {
  return { id: row.id, title: row.title, sortOrder: row.sort_order };
}

export function listGrindTypes(): GrindType[] {
  const rows = db
    .prepare("SELECT * FROM grind_types ORDER BY sort_order ASC, title ASC")
    .all() as GrindTypeRow[];
  return rows.map(mapRow);
}

export function getGrindTypeById(id: string): GrindType | undefined {
  const row = db.prepare("SELECT * FROM grind_types WHERE id = ?").get(id) as
    | GrindTypeRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function createGrindType(input: { title: string; sortOrder?: number }): GrindType {
  const id = newId("grind");
  db.prepare("INSERT INTO grind_types (id, title, sort_order) VALUES (?, ?, ?)").run(
    id,
    input.title,
    input.sortOrder ?? 0
  );
  return getGrindTypeById(id)!;
}

export function updateGrindType(id: string, input: { title: string; sortOrder?: number }): void {
  db.prepare("UPDATE grind_types SET title = ?, sort_order = ? WHERE id = ?").run(
    input.title,
    input.sortOrder ?? 0,
    id
  );
}

export function deleteGrindType(id: string): void {
  db.prepare("DELETE FROM grind_types WHERE id = ?").run(id);
}
