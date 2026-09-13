"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  items,
}: {
  items: { title: string; content: ReactNode }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="rounded-2xl border border-line bg-cream divide-y divide-line">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-right"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-ink">
                {item.title}
              </span>
              <ChevronDown
                size={18}
                className={`text-ink-soft transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-7 text-ink-soft">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
