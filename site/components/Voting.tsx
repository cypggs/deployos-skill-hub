"use client";

import { useEffect, useState } from "react";
import { getVisitorId, PHASES } from "@/lib/supabase";

export default function Voting() {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [voted, setVoted] = useState<Set<number>>(new Set());

  const visitorId = getVisitorId();

  useEffect(() => {
    fetch("/api/vote")
      .then((r) => r.json())
      .then((data) => {
        if (data.counts) setCounts(data.counts);
      });
  }, []);

  const vote = async (phase: number) => {
    if (voted.has(phase)) return;
    const next = [...counts];
    next[phase - 1]++;
    setCounts(next);
    const updated = new Set(voted);
    updated.add(phase);
    setVoted(updated);

    await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_id: visitorId, phase }),
    });
  };

  const max = Math.max(...counts, 1);

  return (
    <section id="voting" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            为最关心的
            <span className="text-neon-yellow">阶段投票</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            点击投票，实时查看大家最感兴趣的部署阶段。
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="space-y-4">
            {PHASES.map((phase, i) => {
              const count = counts[i] || 0;
              const hasVoted = voted.has(phase.number);
              const pct = (count / max) * 100;
              return (
                <div key={phase.number} className="relative">
                  <button
                    onClick={() => vote(phase.number)}
                    disabled={hasVoted}
                    className={`w-full text-left relative z-10 flex items-center justify-between p-4 rounded-lg border transition-all ${
                      hasVoted
                        ? "bg-neon-yellow/10 border-neon-yellow/40"
                        : "bg-white/5 border-white/5 hover:border-neon-yellow/30 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-white/20">
                        {String(phase.number).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="font-semibold text-white">{phase.title}</div>
                        <div className="text-xs text-slate-400">{phase.subtitle}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-mono font-bold text-neon-yellow">
                        {count}
                      </div>
                      <div className="text-xs text-slate-500">
                        {hasVoted ? "已投票" : "点击投票"}
                      </div>
                    </div>
                  </button>
                  <div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-yellow/10 to-transparent transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
