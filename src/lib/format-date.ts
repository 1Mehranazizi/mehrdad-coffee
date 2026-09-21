// SQLite's datetime('now') returns "YYYY-MM-DD HH:MM:SS" in UTC with no zone
// marker, so we add it back before handing the value to Date.
function parse(value: string): Date {
  return new Date(value.includes("T") ? value : value.replace(" ", "T") + "Z");
}

const TZ = "Asia/Tehran";

const dateFmt = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: TZ,
});

const dateTimeFmt = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TZ,
});

export function formatDate(value: string): string {
  return dateFmt.format(parse(value));
}

export function formatDateTime(value: string): string {
  return dateTimeFmt.format(parse(value));
}
