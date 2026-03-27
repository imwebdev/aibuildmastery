import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  source_url: string | null;
  source_type: string | null;
  date: string;
  reading_time_min: number | null;
  related_articles: string[] | null;
  created_at: string;
};

export type CategoryCount = {
  category: string;
  count: number;
};

export const CATEGORY_COLORS: Record<string, string> = {
  "AI Models & APIs": "#0a84ff",
  "AI Agents & MCP": "#bf5af2",
  "AI Leadership & Strategy": "#ff9f0a",
  "Infrastructure & Cloud": "#30d158",
  "Developer Frameworks": "#ff453a",
  "AI Hardware": "#5e5ce6",
  "Open Source & Industry": "#64d2ff",
  "Automation & Workflows": "#ffd60a",
  "Open Source & Community": "#ac8e68",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "AI Models & APIs": "Brain",
  "AI Agents & MCP": "Bot",
  "AI Leadership & Strategy": "TrendingUp",
  "Infrastructure & Cloud": "Cloud",
  "Developer Frameworks": "Code2",
  "AI Hardware": "Cpu",
  "Open Source & Industry": "Globe",
  "Automation & Workflows": "Zap",
  "Open Source & Community": "Users",
};
