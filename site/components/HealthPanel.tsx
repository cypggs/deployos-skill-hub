"use client";

import { useEffect, useState } from "react";
import { Server, Activity, Database, Cloud } from "lucide-react";

interface HealthStatus {
  ok: boolean;
  latency: number;
  timestamp: string;
}

export default function HealthPanel() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const check = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health?t=" + Date.now());
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({ ok: false, latency: 0, timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  const checks = [
    { label: "Next.js 前端", icon: Cloud, status: true },
    { label: "Supabase 数据库", icon: Database, status: health?.ok },
    { label: "API 路由", icon: Server, status: health !== null },
  ];

  return (
    <section id="health" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            系统
            <span className="text-neon-green">健康面板</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            实时检测后端 API 与 Supabase 的连接状态。
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {checks.map((c) => {
              const Icon = c.icon;
              const ok = c.status;
              return (
                <div
                  key={c.label}
                  className={`p-4 rounded-xl border flex items-center gap-4 ${
                    ok === undefined
                      ? "bg-white/5 border-white/10"
                      : ok
                      ? "bg-neon-green/5 border-neon-green/30"
                      : "bg-red-500/5 border-red-500/30"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      ok === undefined
                        ? "text-slate-500"
                        : ok
                        ? "text-neon-green"
                        : "text-red-400"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {c.label}
                    </div>
                    <div
                      className={`text-xs font-mono ${
                        ok === undefined
                          ? "text-slate-500"
                          : ok
                          ? "text-neon-green"
                          : "text-red-400"
                      }`}
                    >
                      {ok === undefined
                        ? "CHECKING..."
                        : ok
                        ? "OPERATIONAL"
                        : "DEGRADED"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between terminal rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-neon-cyan" />
              <div className="font-mono text-sm">
                <span className="text-slate-400">Latency: </span>
                <span className="text-white">
                  {loading ? "..." : `${health?.latency || 0}ms`}
                </span>
              </div>
            </div>
            <button
              onClick={check}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-mono transition-all"
            >
              REFRESH
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
