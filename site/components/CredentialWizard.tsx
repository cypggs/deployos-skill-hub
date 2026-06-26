"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit, Globe, Database, Copy, Check } from "lucide-react";

type CredentialType = "github" | "vercel" | "supabase";

interface Step {
  title: string;
  detail: string;
  code?: string;
}

const credentials: Record<CredentialType, { title: string; icon: React.ElementType; env: string; steps: Step[] }> = {
  github: {
    title: "GitHub Token",
    icon: FolderGit,
    env: "GITHUB_TOKEN",
    steps: [
      {
        title: "打开创建页面",
        detail: "访问 github.com/settings/tokens/new 生成新的 Personal Access Token。",
      },
      {
        title: "选择权限",
        detail: "勾选 repo（完整仓库访问）和 workflow（CI/CD 工作流）。",
      },
      {
        title: "生成并复制",
        detail: "点击 Generate token，立即复制生成的字符串。",
      },
      {
        title: "写入 .env",
        detail: "将 token 粘贴到 .env 文件中对应变量。",
        code: "GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx",
      },
    ],
  },
  vercel: {
    title: "Vercel Token + Team ID",
    icon: Globe,
    env: "VERCEL_TOKEN, VERCEL_TEAM_ID",
    steps: [
      {
        title: "创建 Token",
        detail: "访问 vercel.com/account/tokens，点击 Create Token。",
      },
      {
        title: "获取 Team ID",
        detail: "在 Vercel Dashboard 的 URL 中查看：https://vercel.com/[team]/...，[team] 即为 teamId。个人账号可留空。",
      },
      {
        title: "写入 .env",
        detail: "将两项凭证写入 .env。",
        code: "VERCEL_TOKEN=xxxxxxxx\nVERCEL_TEAM_ID=team_xxxxxxxx",
      },
    ],
  },
  supabase: {
    title: "Supabase 三个 Key",
    icon: Database,
    env: "SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_MANAGEMENT_TOKEN",
    steps: [
      {
        title: "项目 URL & Anon Key",
        detail: "进入 Supabase Dashboard → Project Settings → API，复制 Project URL 和 anon public key。",
        code: "SUPABASE_URL=https://xxxxx.supabase.co\nSUPABASE_ANON_KEY=eyJ...",
      },
      {
        title: "Service Role Key",
        detail: "同一页面 reveal service_role key，仅用于服务端，切勿暴露给浏览器。",
        code: "SUPABASE_SERVICE_ROLE_KEY=eyJ...",
      },
      {
        title: "Management Token",
        detail: "访问 supabase.com/dashboard/account/tokens，生成新 token 用于自动执行 SQL。",
        code: "SUPABASE_MANAGEMENT_TOKEN=sbp_...",
      },
    ],
  },
};

export default function CredentialWizard() {
  const [active, setActive] = useState<CredentialType>("github");
  const [copied, setCopied] = useState(false);

  const activeCred = credentials[active];

  const copyEnv = () => {
    const env = activeCred.steps
      .map((s) => s.code)
      .filter(Boolean)
      .join("\n\n");
    if (env) {
      navigator.clipboard.writeText(env);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="credentials" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            凭证
            <span className="text-neon-green">获取向导</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            一键解锁 fullstack-deploy 所需的全部 API Key。按平台逐步操作即可。
          </p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row border-b border-white/5">
            {(Object.keys(credentials) as CredentialType[]).map((key) => {
              const cred = credentials[key];
              const Icon = cred.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-mono text-sm transition-all ${
                    active === key
                      ? "bg-neon-cyan/10 text-neon-cyan border-b-2 border-neon-cyan"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cred.title}
                </button>
              );
            })}
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <activeCred.icon className="w-7 h-7 text-neon-cyan" />
                  <div>
                    <h3 className="text-xl font-bold">{activeCred.title}</h3>
                    <p className="text-xs font-mono text-slate-400">ENV: {activeCred.env}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeCred.steps.map((step, i) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-cyan/10 text-neon-cyan flex items-center justify-center font-mono text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-slate-400 mb-2">
                          {step.detail}
                        </p>
                        {step.code && (
                          <div className="terminal rounded-lg p-3 font-mono text-sm text-neon-green relative group"
                          >
                            <pre className="whitespace-pre-wrap">{step.code}</pre>
                            <button
                              onClick={copyEnv}
                              className="absolute top-2 right-2 p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-neon-green" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
