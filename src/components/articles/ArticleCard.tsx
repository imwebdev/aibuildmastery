import Link from "next/link";
import { type Article, CATEGORY_COLORS } from "@/lib/supabase";
import { Clock, ArrowUpRight } from "lucide-react";

export function ArticleCard({ article }: { article: Article }) {
  const categoryColor = CATEGORY_COLORS[article.category] || "#0a84ff";

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <article className="relative h-full rounded-2xl bg-card p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3),0_1px_4px_rgba(0,0,0,0.15)] hover:translate-y-[-2px]">
        {/* Category pill */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: `${categoryColor}18`,
              color: categoryColor,
            }}
          >
            {article.category}
          </span>
          <ArrowUpRight
            className="h-4 w-4 text-text-tertiary opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-[17px] font-semibold leading-snug text-foreground line-clamp-2">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="mb-4 text-[14px] leading-relaxed text-muted-foreground line-clamp-3">
          {article.summary}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[12px] text-text-tertiary">
          {article.reading_time_min && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {article.reading_time_min} min
            </span>
          )}
          {article.date && (
            <span>
              {new Date(article.date + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {article.subcategory && (
            <span className="text-text-tertiary">{article.subcategory}</span>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tags
              .filter(
                (t) =>
                  !["blog", "article", "youtube", "knowledge-base", "auto-ingested", "daily-learning"].includes(t) &&
                  !t.startsWith("[")
              )
              .slice(0, 3)
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-surface-elevated px-2 py-0.5 text-[11px] text-text-tertiary"
                >
                  {tag}
                </span>
              ))}
          </div>
        )}
      </article>
    </Link>
  );
}
