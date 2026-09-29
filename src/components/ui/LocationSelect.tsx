"use client";

import { useMemo } from "react";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { citiesOf, provinceNames } from "@/lib/iran-locations";

export default function LocationSelect({
  province,
  city,
  onChange,
}: {
  province: string;
  city: string;
  onChange: (next: { province: string; city: string }) => void;
}) {
  const cities = useMemo(() => citiesOf(province), [province]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <SearchableSelect
        value={province}
        options={provinceNames}
        placeholder="انتخاب استان"
        searchPlaceholder="جستجوی استان..."
        onChange={(p) => onChange({ province: p, city: p === province ? city : "" })}
      />
      <SearchableSelect
        value={city}
        options={cities}
        placeholder={province ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}
        searchPlaceholder="جستجوی شهر..."
        disabled={!province}
        onChange={(c) => onChange({ province, city: c })}
      />
    </div>
  );
}
