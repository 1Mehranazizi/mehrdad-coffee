import data from "@/data/iran-locations.json";

export type Province = { name: string; cities: string[] };

export const provinces: Province[] = data as Province[];

export const provinceNames: string[] = provinces.map((p) => p.name);

export function citiesOf(province: string): string[] {
  return provinces.find((p) => p.name === province)?.cities ?? [];
}

/** True only when the pair really exists in the dataset (used for server-side validation). */
export function isValidLocation(province: string, city: string): boolean {
  return citiesOf(province).includes(city);
}
