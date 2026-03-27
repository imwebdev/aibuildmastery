export type LearningPath = {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  articleSlugs: string[];
  categories: string[];
  color: string;
  icon: string;
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "getting-started-ai-agents",
    title: "Getting Started with AI Agents",
    description:
      "From chatbots to autonomous agents. Learn the agent architecture, tool use, and MCP protocol that powers modern AI systems.",
    level: "beginner",
    estimatedHours: 4,
    articleSlugs: [],
    categories: ["AI Agents & MCP"],
    color: "#bf5af2",
    icon: "Bot",
  },
  {
    id: "aws-bedrock-builders",
    title: "AWS Bedrock for Builders",
    description:
      "Deploy foundation models on AWS. Covers Bedrock APIs, guardrails, fine-tuning, and production patterns.",
    level: "intermediate",
    estimatedHours: 6,
    articleSlugs: [],
    categories: ["Infrastructure & Cloud"],
    color: "#30d158",
    icon: "Cloud",
  },
  {
    id: "ai-strategy-leaders",
    title: "AI Strategy for Leaders",
    description:
      "Governance, adoption frameworks, risk management, and enterprise AI decision-making for technical leaders.",
    level: "advanced",
    estimatedHours: 5,
    articleSlugs: [],
    categories: ["AI Leadership & Strategy"],
    color: "#ff9f0a",
    icon: "TrendingUp",
  },
  {
    id: "claude-deep-dive",
    title: "Claude & Anthropic Deep Dive",
    description:
      "Master Claude models, the API, prompt engineering, and the Claude Code ecosystem.",
    level: "intermediate",
    estimatedHours: 5,
    articleSlugs: [],
    categories: ["AI Models & APIs"],
    color: "#0a84ff",
    icon: "Brain",
  },
  {
    id: "modern-dev-frameworks",
    title: "Modern Dev Frameworks for AI",
    description:
      "Next.js, React, TypeScript, and Copilot Studio patterns for building AI-powered applications.",
    level: "intermediate",
    estimatedHours: 4,
    articleSlugs: [],
    categories: ["Developer Frameworks"],
    color: "#ff453a",
    icon: "Code2",
  },
];
