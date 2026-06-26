"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHASES } from "@/lib/supabase";
import {
  Target,
  Database,
  Code2,
  GitBranch,
  Rocket,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  database: Database,
  code: Code2,
  "git-branch": GitBranch,
  rocket: Rocket,
  "check-circle": CheckCircle,
};

const phaseDetails: Record<
  number,
  { steps: string[]; output: string; tip: string }
> = {
  1: {
    steps: [
      "用一句话描述你的应用核心目标",
      "列出必备功能与可选功能",
      "根据决策树选择框架：Next.js / Vite / Flask / FastAPI / Astro",
      "设计核心数据表与关系",
    ],
    output: "需求文档 + 技术栈决策 + 数据库草图",
    tip: "越具体的需求描述，AI 生成的代码越贴合你的预期。",
  },
  2: {
    steps: [
      "在 Supabase Dashboard 创建新项目",
      "编写 database.sql：表、索引、触发器、RLS、种子数据",
      "使用 SUPABASE_MANAGEMENT_TOKEN 自动执行，或粘贴到 SQL Editor",
      "验证表结构与策略",
    ],
    output: "完整的 Supabase Schema + 可匿名访问的客户端配置",
    tip: "RLS 是生产安全的底线，永远不要关闭已启用 RLS 表的默认策略。",
  },
  3: {
    steps: [
      "npx create-next-app 初始化前端",
      "安装 @supabase/supabase-js 与相关依赖",
      "创建 .env.local 配置 NEXT_PUBLIC_* 变量",
      "实现 API 路由、页面组件与数据库交互",
      "本地运行 npm run dev 验证",
    ],
    output: "可本地运行的完整应用",
    tip: "把 service_role key 和 MANAGEMENT_TOKEN 只保留在服务端。",
  },
  4: {
    steps: [
      "git init 并添加 .gitignore",
      "git add . && git commit 初始提交",
      "用 GITHUB_TOKEN 调用 GitHub API 创建仓库",
      "添加 remote 并 push -u origin main",
    ],
    output: "GitHub 远程仓库 + 完整提交历史",
    tip: "确保 .env* 和 .claude/settings.json 在 .gitignore 中。",
  },
  5: {
    steps: [
      "npm i -g vercel 或确认 CLI 已安装",
      "vercel --token $VERCEL_TOKEN --yes --prod 首次部署",
      "记录 projectId 与 teamId",
      "通过 Vercel API 添加 NEXT_PUBLIC_* 环境变量",
      "重新部署并关闭访问保护",
    ],
    output: "公开可访问的 .vercel.app 生产域名",
    tip: "首次部署可能因缺少 env 失败，补全后 force redeploy 即可。",
  },
  6: {
    steps: [
      "curl 生产 URL 确认 200",
      "走通关键用户流程",
      "整理 README / CLAUDE.md 文档",
      "交付生产 URL、GitHub、Dashboard 三个链接",
    ],
    output: "交付文档 + 可维护的线上项目",
    tip: "未来每次 push 到 main 都会自动触发 Vercel 重新部署。",
  },
};

export default function PhaseTimeline() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="phases" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            六阶段
            <span className="text-neon-purple">部署流水线</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            点击卡片展开每个阶段的具体动作、预期产出与实战技巧。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PHASES.map((phase, i) => {
            const Icon = iconMap[phase.icon];
            const isOpen = active === phase.number;
            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  isOpen ? "ring-1 ring-neon-cyan/50 shadow-[0_0_30px_rgba(0,243,255,0.15)]" : ""
                }`}
                onClick={() => setActive(isOpen ? null : phase.number)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-4xl font-bold text-white/10">
                      {String(phase.number).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {phase.title}
                  </h3>
                  <div className="text-xs font-mono text-neon-cyan mb-3">
                    {phase.subtitle.toUpperCase()}
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{phase.summary}</p>

                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <span>{isOpen ? "COLLAPSE" : "EXPAND"}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/5 pt-4">
                        <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside mb-4">
                          {phaseDetails[phase.number].steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                        <div className="terminal rounded-lg p-4 mb-3">
                          <div className="text-xs text-slate-500 font-mono mb-1">OUTPUT</div>
                          <div className="text-neon-green font-mono text-sm">
                            {phaseDetails[phase.number].output}
                          </div>
                        </div>
                        <div className="text-xs text-neon-yellow font-mono">
                          TIP: {phaseDetails[phase.number].tip}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
