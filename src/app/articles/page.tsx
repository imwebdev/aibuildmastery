"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { CategoryFilter } from "@/components/articles/CategoryFilter";
import { SearchBar } from "@/components/articles/SearchBar";
import { type Article } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

function ArticlesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<
    { category: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;

  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const selectedTag = searchParams.get("tag");

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchQuery) params.set("search", searchQuery);
    if (selectedTag) params.set("tag", selectedTag);
    params.set("page", String(page));
    params.set("limit", String(limit));

    try {
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setTotal(data.total || 0);
      if (data.categories) setCategories(data.categories);
    } catch {
      console.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, selectedTag, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  function handleCategorySelect(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("page");
    setPage(1);
    router.push(`/articles?${params}`);
  }

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    setPage(1);
    router.push(`/articles?${params}`);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:pt-12">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="mb-2 font-bold tracking-tight text-foreground"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          Articles
        </h1>
        <p className="text-[17px] text-muted-foreground">
          {total} curated articles across AI models, agents, infrastructure, and
          strategy.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar
          value={localSearch}
          onChange={setLocalSearch}
          onSubmit={handleSearch}
        />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {/* Active filters */}
      {(searchQuery || selectedTag) && (
        <div className="mb-6 flex items-center gap-2">
          {searchQuery && (
            <span className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1 text-[13px] text-muted-foreground">
              Search: &quot;{searchQuery}&quot;
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  setLocalSearch("");
                  router.push(`/articles?${params}`);
                }}
                className="ml-1 text-text-tertiary hover:text-foreground"
              >
                &times;
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1 text-[13px] text-muted-foreground">
              Tag: {selectedTag}
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("tag");
                  router.push(`/articles?${params}`);
                }}
                className="ml-1 text-text-tertiary hover:text-foreground"
              >
                &times;
              </button>
            </span>
          )}
        </div>
      )}

      {/* Articles grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[17px] text-muted-foreground">
            No articles found. Try a different search or category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-[12px] bg-surface-elevated px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-3 text-[13px] text-text-tertiary">
                {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-[12px] bg-surface-elevated px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
        </div>
      }
    >
      <ArticlesContent />
    </Suspense>
  );
}
