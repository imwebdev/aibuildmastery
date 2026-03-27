"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-12"
      style={{
        background: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          AI Build Mastery
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/articles"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Articles
          </Link>
          <Link
            href="/learning-paths"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Learning Paths
          </Link>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-muted-foreground md:hidden"
          aria-label="Menu"
        >
          {menuOpen ? (
            <X className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
      </nav>

      {/* Search bar overlay */}
      {searchOpen && (
        <div
          className="border-b border-border"
          style={{
            background: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "saturate(180%) blur(20px)",
          }}
        >
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3"
          >
            <Search className="h-4 w-4 shrink-0 text-text-tertiary" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              autoFocus
              className="w-full bg-transparent text-[15px] text-foreground placeholder:text-text-tertiary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="shrink-0 text-[13px] text-primary"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="border-b border-border md:hidden"
          style={{
            background: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "saturate(180%) blur(20px)",
          }}
        >
          <div className="mx-auto max-w-6xl space-y-1 px-5 py-4">
            <Link
              href="/articles"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Articles
            </Link>
            <Link
              href="/learning-paths"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Learning Paths
            </Link>
            <form onSubmit={handleSearch} className="pt-2">
              <div className="flex items-center gap-2 rounded-xl bg-input px-3 py-2">
                <Search className="h-4 w-4 text-text-tertiary" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-[15px] text-foreground placeholder:text-text-tertiary focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
