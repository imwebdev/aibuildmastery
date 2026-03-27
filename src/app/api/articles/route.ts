import { NextRequest, NextResponse } from "next/server";
import { getArticles, getCategoryCounts } from "@/lib/articles";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  const [{ articles, total }, categories] = await Promise.all([
    getArticles({ category, search, tag, page, limit }),
    getCategoryCounts(),
  ]);

  return NextResponse.json({
    articles,
    total,
    categories,
    page,
    limit,
  });
}
