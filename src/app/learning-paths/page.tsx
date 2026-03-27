import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { LEARNING_PATHS } from "@/lib/learning-paths";
import { getArticles } from "@/lib/articles";

export const revalidate = 300;

export default async function LearningPathsPage() {
  // Get article counts per category for the paths
  const pathsWithCounts = await Promise.all(
    LEARNING_PATHS.map(async (path) => {
      const { total } = await getArticles({
        category: path.categories[0],
        limit: 1,
      });
      return { ...path, articleCount: total };
    })
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:pt-12">
      <div className="mb-12">
        <h1
          className="mb-3 font-bold tracking-tight text-foreground"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          Learning Paths
        </h1>
        <p className="max-w-xl text-[17px] text-muted-foreground">
          Curated sequences of articles that take you from concept to
          competence. Each path is a structured journey through a specific domain
          of AI.
        </p>
      </div>

      <div className="space-y-6">
        {pathsWithCounts.map((path) => (
          <div
            key={path.id}
            id={path.id}
            className="group rounded-2xl bg-card p-6 sm:p-8 transition-all duration-300"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Icon */}
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${path.color}15` }}
              >
                <div
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: path.color }}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-[22px] font-semibold tracking-tight text-foreground">
                    {path.title}
                  </h2>
                  <span
                    className="rounded-md px-2 py-0.5 text-[11px] font-medium capitalize"
                    style={{
                      backgroundColor: `${path.color}18`,
                      color: path.color,
                    }}
                  >
                    {path.level}
                  </span>
                </div>

                <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {path.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[13px] text-text-tertiary">
                    <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {path.articleCount} articles
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-text-tertiary">
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                    ~{path.estimatedHours}h to complete
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/articles?category=${encodeURIComponent(path.categories[0])}`}
                className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 self-start rounded-[12px] bg-surface-elevated px-4 py-2 text-[13px] font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-surface-hover"
              >
                Start Path
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
