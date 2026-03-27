"use client";

import { CATEGORY_COLORS } from "@/lib/supabase";

type Props = {
  categories: { category: string; count: number }[];
  selected: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`whitespace-nowrap shrink-0 rounded-[12px] px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
          selected === null
            ? "bg-primary text-white"
            : "bg-surface-elevated text-muted-foreground hover:bg-surface-hover hover:text-foreground"
        }`}
      >
        All ({total})
      </button>
      {categories.map((cat) => {
        const color = CATEGORY_COLORS[cat.category] || "#0a84ff";
        const isSelected = selected === cat.category;

        return (
          <button
            key={cat.category}
            onClick={() => onSelect(isSelected ? null : cat.category)}
            className={`whitespace-nowrap shrink-0 rounded-[12px] px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
              isSelected
                ? "text-white"
                : "bg-surface-elevated text-muted-foreground hover:text-foreground"
            }`}
            style={
              isSelected
                ? { backgroundColor: color }
                : undefined
            }
          >
            <span className="flex items-center gap-1.5">
              {!isSelected && (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              {cat.category} ({cat.count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
