"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const snippets = [
  {
    label: "启动技能",
    code: "/fullstack-deploy 我要做一个任务管理应用，前端用 Next.js，数据库用 Supabase，部署到 Vercel。",
  },
  {
    label: "加载凭证",
    code: "set -a && source .env && set +a",
  },
  {
    label: "自动执行 SQL",
    code: `jq -Rs '{query: .}' database.sql | \\
curl -s -X POST "https://api.supabase.com/v1/projects/{project-ref}/database/query" \\
  -H "Authorization: Bearer $SUPABASE_MANAGEMENT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d @-`,
  },
  {
    label: "创建 GitHub 仓库",
    code: `curl -X POST \\
  -H "Authorization: token $GITHUB_TOKEN" \\
  -H "Accept: application/vnd.github.v3+json" \\
  https://api.github.com/user/repos \\
  -d '{"name":"my-app","description":"...","private":false}'`,
  },
  {
    label: "Vercel 生产部署",
    code: "vercel --token $VERCEL_TOKEN --yes --prod",
  },
];

export default function Terminal() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(snippets[active].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            常用
            <span className="text-neon-purple">命令终端</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            一键复制 fullstack-deploy 流水线中的核心命令。
          </p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex flex-wrap border-b border-white/5">
            {snippets.map((s, i) => (
              <button
                key={s.label}
                onClick={() => {
                  setActive(i);
                  setCopied(false);
                }}
                className={`px-5 py-3 text-sm font-mono transition-all ${
                  active === i
                    ? "bg-neon-purple/10 text-neon-purple border-b-2 border-neon-purple"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="relative terminal p-6 min-h-[240px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-slate-500 font-mono">
                deployos@skill-hub:~$
              </span>
            </div>

            <motion.pre
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-sm text-neon-green whitespace-pre-wrap leading-relaxed"
            >
              {snippets[active].code}
            </motion.pre>

            <button
              onClick={copy}
              className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-neon-green" />
                  COPIED
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  COPY
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
