import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Sparkles, TrendingUp } from "lucide-react";
import { getRecentArticles, getCategoryCounts } from "@/lib/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { CATEGORY_COLORS } from "@/lib/supabase";
import { LEARNING_PATHS } from "@/lib/learning-paths";

export const revalidate = 300; // 5 min ISR

export default async function HomePage() {
  const [recentArticles, categories] = await Promise.all([
    getRecentArticles(6),
    getCategoryCounts(),
  ]);

  const totalArticles = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-24 sm:pt-32 sm:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              className="font-bold tracking-tight text-foreground"
              style={{
                fontSize: "clamp(40px, 7vw, 80px)",
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
              }}
            >
              AI knowledge,
              <br />
              <span className="bg-gradient-to-r from-primary to-system-purple bg-clip-text text-transparent">
                structured for action.
              </span>
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl text-muted-foreground"
              style={{
                fontSize: "clamp(19px, 2.1vw, 28px)",
                lineHeight: 1.35,
              }}
            >
              {totalArticles}+ curated articles on AI models, agents, infrastructure, and strategy. No fluff, no clickbait.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-[12px] bg-primary px-5 py-2.5 text-[15px] font-medium text-white transition-all hover:brightness-110"
              >
                Browse Articles
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="/learning-paths"
                className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-[12px] bg-surface-elevated px-5 py-2.5 text-[15px] font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-surface-hover"
              >
                Learning Paths
              </Link>
            </div>
          </div>
        </div>
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-60 w-60 rounded-full bg-system-purple/8 blur-[100px]" />
      </section>

      {/* Stats bar */}
      <section className="border-y border-separator bg-card/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-5 py-5 sm:gap-16">
          <Stat icon={<BookOpen className="h-4 w-4" strokeWidth={1.5} />} value={`${totalArticles}+`} label="Articles" />
          <Stat icon={<Layers className="h-4 w-4" strokeWidth={1.5} />} value={`${categories.length}`} label="Categories" />
          <Stat icon={<TrendingUp className="h-4 w-4" strokeWidth={1.5} />} value={`${LEARNING_PATHS.length}`} label="Paths" />
          <Stat icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />} value="Daily" label="Updated" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2
            className="mb-3 font-semibold tracking-tight text-foreground"
            style={{
              fontSize: "clamp(24px, 3vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            Browse by topic
          </h2>
          <p className="mb-10 text-[17px] text-muted-foreground">
            Dive into the area that matters most to your work.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const color = CATEGORY_COLORS[cat.category] || "#0a84ff";
              return (
                <Link
                  key={cat.category}
                  href={`/articles?category=${encodeURIComponent(cat.category)}`}
                  className="group rounded-2xl bg-card p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:translate-y-[-2px]"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                    <span className="text-[13px] font-medium text-text-tertiary">
                      {cat.count} articles
                    </span>
                  </div>
                  <h3 className="text-[17px] font-semibold text-foreground">
                    {cat.category}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent articles */}
      <section className="bg-card/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2
                className="mb-2 font-semibold tracking-tight text-foreground"
                style={{
                  fontSize: "clamp(24px, 3vw, 40px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                }}
              >
                Latest articles
              </h2>
              <p className="text-[17px] text-muted-foreground">
                Fresh from the knowledge pipeline.
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden items-center gap-1 text-[14px] font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-primary"
            >
              View all articles <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Paths preview */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="mb-3 font-semibold tracking-tight text-foreground"
              style={{
                fontSize: "clamp(24px, 3vw, 40px)",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
              }}
            >
              Guided learning paths
            </h2>
            <p className="mb-10 text-[17px] text-muted-foreground">
              Structured sequences that take you from concept to competence.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNING_PATHS.slice(0, 3).map((path) => (
              <Link
                key={path.id}
                href={`/learning-paths#${path.id}`}
                className="group rounded-2xl bg-card p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:translate-y-[-2px]"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${path.color}20` }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: path.color }}
                  />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-foreground">
                  {path.title}
                </h3>
                <p className="mb-3 text-[14px] leading-relaxed text-muted-foreground line-clamp-2">
                  {path.description}
                </p>
                <div className="flex items-center gap-3 text-[12px] text-text-tertiary">
                  <span className="capitalize rounded-md bg-surface-elevated px-2 py-0.5">
                    {path.level}
                  </span>
                  <span>{path.estimatedHours}h estimated</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/learning-paths"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all paths <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-separator py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2
            className="mb-4 font-bold tracking-tight text-foreground"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Start building with AI.
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-[17px] text-muted-foreground">
            Every article is curated from vetted sources and structured for action. No AI slop.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-[12px] bg-primary px-6 py-3 text-[17px] font-medium text-white transition-all hover:brightness-110"
          >
            Explore the Library
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <span className="text-[15px] font-semibold text-foreground">{value}</span>
      <span className="text-[13px] text-text-tertiary">{label}</span>
    </div>
  );
}
