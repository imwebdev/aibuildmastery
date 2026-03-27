import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { CATEGORY_COLORS } from "@/lib/supabase";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const revalidate = 300;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article, 3);
  const categoryColor = CATEGORY_COLORS[article.category] || "#0a84ff";

  // Parse markdown-like content into HTML-safe paragraphs
  const contentSections = parseContent(article.content);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-8 sm:pt-12">
      {/* Back link */}
      <Link
        href="/articles"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-text-tertiary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        All Articles
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: `${categoryColor}18`,
              color: categoryColor,
            }}
          >
            {article.category}
          </span>
          {article.subcategory && (
            <span className="text-[12px] text-text-tertiary">
              {article.subcategory}
            </span>
          )}
        </div>

        <h1
          className="mb-4 font-bold tracking-tight text-foreground"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}
        >
          {article.title}
        </h1>

        <p className="mb-5 text-[17px] leading-relaxed text-muted-foreground">
          {article.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[13px] text-text-tertiary">
          {article.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
              {new Date(article.date + "T00:00:00").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {article.reading_time_min && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              {article.reading_time_min} min read
            </span>
          )}
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
              Source
            </a>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {article.tags
              .filter(
                (t) =>
                  !["blog", "article", "youtube", "knowledge-base", "auto-ingested", "daily-learning"].includes(t) &&
                  !t.startsWith("[")
              )
              .map((tag) => (
                <Link
                  key={tag}
                  href={`/articles?tag=${encodeURIComponent(tag)}`}
                  className="rounded-md bg-surface-elevated px-2 py-0.5 text-[11px] text-text-tertiary transition-colors hover:text-foreground"
                >
                  {tag}
                </Link>
              ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="border-t border-separator pt-8">
        <div className="prose-custom space-y-6">
          {contentSections.map((section, i) => (
            <ContentSection key={i} section={section} />
          ))}
        </div>
      </div>

      {/* Related */}
      {relatedArticles.length > 0 && (
        <div className="mt-16 border-t border-separator pt-10">
          <h2 className="mb-6 text-[20px] font-semibold tracking-tight text-foreground">
            Related articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type ContentBlock = {
  type: "heading" | "paragraph" | "list" | "link";
  level?: number;
  text: string;
  items?: string[];
  href?: string;
};

function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = content.split("\n");
  let currentList: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip frontmatter
    if (trimmed === "---") continue;
    if (trimmed.startsWith("title:") || trimmed.startsWith("domain:") || trimmed.startsWith("source_type:") || trimmed.startsWith("source_url:") || trimmed.startsWith("content_type:") || trimmed.startsWith("source_name:") || trimmed.startsWith("tags:") || trimmed.startsWith("ingested:") || trimmed.startsWith("published:") || trimmed.startsWith("author:") || trimmed.startsWith("status:")) continue;

    // Skip wikilinks
    if (trimmed.startsWith("- [[")) continue;

    if (trimmed === "") {
      if (currentList.length > 0) {
        blocks.push({ type: "list", text: "", items: currentList });
        currentList = [];
      }
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      if (currentList.length > 0) {
        blocks.push({ type: "list", text: "", items: currentList });
        currentList = [];
      }
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      continue;
    }

    // List items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(trimmed.slice(2));
      continue;
    }

    // Source link
    if (trimmed.startsWith("[Original]")) {
      const urlMatch = trimmed.match(/\((.+?)\)/);
      if (urlMatch) {
        blocks.push({ type: "link", text: "View Original Source", href: urlMatch[1] });
      }
      continue;
    }

    // Regular paragraph
    if (currentList.length > 0) {
      blocks.push({ type: "list", text: "", items: currentList });
      currentList = [];
    }
    blocks.push({ type: "paragraph", text: trimmed });
  }

  if (currentList.length > 0) {
    blocks.push({ type: "list", text: "", items: currentList });
  }

  return blocks;
}

function ContentSection({ section }: { section: ContentBlock }) {
  switch (section.type) {
    case "heading":
      if (section.level === 1) {
        return null; // Skip h1, already shown in header
      }
      if (section.level === 2) {
        return (
          <h2 className="mt-8 text-[22px] font-semibold tracking-tight text-foreground">
            {section.text}
          </h2>
        );
      }
      if (section.level === 3) {
        return (
          <h3 className="mt-6 text-[18px] font-semibold text-foreground">
            {section.text}
          </h3>
        );
      }
      return (
        <h4 className="mt-4 text-[16px] font-semibold text-foreground">
          {section.text}
        </h4>
      );
    case "paragraph":
      return (
        <p className="text-[16px] leading-[1.6] text-muted-foreground">
          {section.text}
        </p>
      );
    case "list":
      return (
        <ul className="space-y-2 pl-5">
          {section.items?.map((item, i) => (
            <li
              key={i}
              className="list-disc text-[15px] leading-relaxed text-muted-foreground marker:text-text-tertiary"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "link":
      return (
        <a
          href={section.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary transition-colors hover:text-primary/80"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
          {section.text}
        </a>
      );
    default:
      return null;
  }
}
