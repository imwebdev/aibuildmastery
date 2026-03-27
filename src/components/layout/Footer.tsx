import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-separator">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[13px] text-text-tertiary">
            AI Build Mastery. Curated AI knowledge for builders and leaders.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/articles"
              className="text-[13px] text-text-tertiary transition-colors hover:text-foreground"
            >
              Articles
            </Link>
            <Link
              href="/learning-paths"
              className="text-[13px] text-text-tertiary transition-colors hover:text-foreground"
            >
              Paths
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
