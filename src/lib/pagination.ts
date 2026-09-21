export const PER_PAGE_OPTIONS = [10, 20, 50] as const;
export const DEFAULT_PER_PAGE = 10;

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

/** searchParams values can be string | string[] | undefined — take the first string. */
export function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parsePaging(sp: {
  page?: string | string[];
  perPage?: string | string[];
}): { page: number; perPage: number } {
  const perPageRaw = Number(firstParam(sp.perPage));
  const perPage = (PER_PAGE_OPTIONS as readonly number[]).includes(perPageRaw)
    ? perPageRaw
    : DEFAULT_PER_PAGE;
  const pageRaw = Math.floor(Number(firstParam(sp.page)));
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  return { page, perPage };
}

/** Clamp the requested page into range once the total is known. */
export function buildPaged<T>(
  items: T[],
  total: number,
  page: number,
  perPage: number
): Paged<T> {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return { items, total, page: Math.min(page, totalPages), perPage, totalPages };
}

/** Escape % and _ so user input is matched literally in a LIKE ... ESCAPE '\' clause. */
export function likePattern(q: string): string {
  return `%${q.replace(/[\\%_]/g, (c) => "\\" + c)}%`;
}

/** Persian/Arabic-Indic digits → ASCII, so "۰۹۱۲" and "0912" search alike. */
export function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}
