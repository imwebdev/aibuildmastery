import { supabase, type Article, type CategoryCount } from "./supabase";

export async function getArticles({
  category,
  search,
  tag,
  page = 1,
  limit = 12,
}: {
  category?: string;
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ articles: Article[]; total: number }> {
  let query = supabase
    .from("knowledge_articles")
    .select("*", { count: "exact" });

  if (category) {
    query = query.eq("category", category);
  }

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  if (search) {
    query = query.textSearch("fts", search, { type: "websearch" });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order("date", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching articles:", error);
    return { articles: [], total: 0 };
  }

  return { articles: data || [], total: count || 0 };
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    return null;
  }

  return data;
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const { data, error } = await supabase.rpc("get_category_counts");

  if (error) {
    // Fallback: manual aggregation
    const { data: articles } = await supabase
      .from("knowledge_articles")
      .select("category");

    if (!articles) return [];

    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  return data || [];
}

export async function getPopularTags(
  limit = 20
): Promise<{ tag: string; count: number }[]> {
  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("tags");

  if (error || !data) return [];

  const tagCounts: Record<string, number> = {};
  data.forEach((article) => {
    if (article.tags) {
      article.tags.forEach((tag: string) => {
        const cleaned = tag.replace(/^\[/, "").trim();
        if (cleaned && !["blog", "article", "youtube", "knowledge-base", "auto-ingested", "daily-learning"].includes(cleaned)) {
          tagCounts[cleaned] = (tagCounts[cleaned] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getRelatedArticles(
  article: Article,
  limit = 4
): Promise<Article[]> {
  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .eq("category", article.category)
    .neq("id", article.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

export async function getRecentArticles(limit = 6): Promise<Article[]> {
  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}
