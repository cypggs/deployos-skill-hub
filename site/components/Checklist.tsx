"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { getVisitorId, PHASES, ChecklistItem } from "@/lib/supabase";

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const visitorId = getVisitorId();

  useEffect(() => {
    fetch(`/api/checklist?visitor_id=${visitorId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.items) setItems(data.items);
        if (data.completions) setCompleted(new Set(data.completions));
      })
      .finally(() => setLoading(false));
  }, [visitorId]);

  const toggle = async (itemId: string) => {
    const next = new Set(completed);
    const isDone = next.has(itemId);
    if (isDone) next.delete(itemId);
    else next.add(itemId);
    setCompleted(next);

    await fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitor_id: visitorId,
        item_id: itemId,
        completed: !isDone,
      }),
    });
  };

  const grouped = PHASES.map((phase) => ({
    phase,
    items: items.filter((i) => i.phase === phase.number),
  }));

  const total = items.length;
  const done = completed.size;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <section id="checklist" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            交互式
            <span className="text-neon-pink">部署检查清单</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            勾选你已完成或理解的任务，进度会自动保存到 Supabase。
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-slate-400">COMPLETION RATE</span>
            <span className="text-2xl font-mono font-bold text-neon-cyan">
              {percent}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
            />
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-slate-500 font-mono py-12">
              LOADING CHECKLIST...
            </div>
          ) : (
            grouped.map(({ phase, items }) => (
              <div key={phase.number} className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-slate-500">
                    PHASE {phase.number}
                  </span>
                  <h3 className="font-bold text-white">{phase.title}</h3>
                </div>
                <div className="space-y-2">
                  {items.map((item) => {
                    const isDone = completed.has(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                          isDone
                            ? "bg-neon-green/5 border border-neon-green/20"
                            : "bg-white/5 border border-white/5 hover:border-neon-cyan/30"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            isDone
                              ? "bg-neon-green border-neon-green"
                              : "border-slate-500"
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 text-black" />}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`text-sm font-medium ${
                              isDone ? "text-slate-400 line-through" : "text-white"
                            }`}
                          >
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
