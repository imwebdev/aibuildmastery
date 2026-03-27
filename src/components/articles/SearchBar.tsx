"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function SearchBar({ value, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="relative"
    >
      <Search
        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
        strokeWidth={1.5}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles..."
        className="h-11 w-full rounded-xl bg-input pl-10 pr-4 text-[15px] text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
    </form>
  );
}
