import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase client environment variables");
}

// Browser/client client (respects RLS)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// Server-side admin client (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

export type VisitRow = {
  id: string;
  visitor_id: string;
  created_at: string;
};

export type ChecklistItem = {
  id: string;
  phase: number;
  label: string;
  description: string | null;
  item_order: number;
};

export type UserChecklist = {
  id: string;
  visitor_id: string;
  item_id: string;
  completed: boolean;
};

export type PhaseVote = {
  id: string;
  visitor_id: string;
  phase: number;
  created_at: string;
};

export type Feedback = {
  id: string;
  visitor_id: string;
  author: string | null;
  content: string;
  created_at: string;
};

export const PHASES = [
  {
    number: 1,
    title: "需求 & 规划",
    subtitle: "Requirements & Planning",
    color: "from-neon-cyan to-blue-500",
    icon: "target",
    summary: "收集需求、选择框架、设计数据库 Schema。",
  },
  {
    number: 2,
    title: "数据库搭建",
    subtitle: "Database Setup",
    color: "from-neon-purple to-indigo-500",
    icon: "database",
    summary: "编写 SQL、自动执行、配置 RLS 与 Storage。",
  },
  {
    number: 3,
    title: "应用开发",
    subtitle: "Application Development",
    color: "from-neon-pink to-rose-500",
    icon: "code",
    summary: "初始化项目、安装依赖、实现功能、本地测试。",
  },
  {
    number: 4,
    title: "Git & GitHub",
    subtitle: "Version Control",
    color: "from-neon-green to-emerald-500",
    icon: "git-branch",
    summary: "git init、提交、创建仓库、推送代码。",
  },
  {
    number: 5,
    title: "Vercel 部署",
    subtitle: "Production Deployment",
    color: "from-neon-yellow to-amber-500",
    icon: "rocket",
    summary: "CLI 部署、配置环境变量、关闭访问保护。",
  },
  {
    number: 6,
    title: "交付 & 迭代",
    subtitle: "Completion & Handoff",
    color: "from-cyan-400 to-neon-cyan",
    icon: "check-circle",
    summary: "验证线上功能、交付 URL 与文档、持续迭代。",
  },
] as const;

export function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("deployos_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("deployos_visitor_id", id);
  }
  return id;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
