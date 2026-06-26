"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckSquare, Vote, MessageSquare, Activity } from "lucide-react";

interface Stats {
  totalVisits: number;
  uniqueVisitors: number;
  totalChecklistCompletions: number;
  totalVotes: number;
  totalFeedbacks: number;
  votesByPhase: number[];
}

const initialStats: Stats = {
  totalVisits: 0,
  uniqueVisitors: 0,
  totalChecklistCompletions: 0,
  totalVotes: 0,
  totalFeedbacks: 0,
  votesByPhase: [0, 0, 0, 0, 0, 0],
};

export default function StatsDashboard() {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .finally(() => setLoading(false));

    const id = setInterval(() => {
      fetch("/api/stats")
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setStats(data);
        });
    }, 10000);

    return () => clearInterval(id);
  }, []);

  const cards = [
    { label: "总访问", value: stats.totalVisits, icon: Activity, color: "text-neon-cyan" },
    { label: "独立访客", value: stats.uniqueVisitors, icon: Users, color: "text-neon-purple" },
    { label: "检查完成", value: stats.totalChecklistCompletions, icon: CheckSquare, color: "text-neon-green" },
    { label: "阶段投票", value: stats.totalVotes, icon: Vote, color: "text-neon-yellow" },
    { label: "反馈数量", value: stats.totalFeedbacks, icon: MessageSquare, color: "text-neon-pink" },
  ];

  return (
    <section id="stats" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-cyan/30" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            实时
            <span className="text-neon-cyan">数据</span>
            仪表盘
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-cyan/30" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-5 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <card.icon className={`w-6 h-6 mx-auto mb-3 ${card.color}`} />
              <div className="text-3xl font-mono font-bold text-white mb-1">
                {loading ? "—" : card.value.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-mono">{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Vote distribution mini chart */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 glass-card rounded-xl p-6"
        >
          <h3 className="text-sm font-mono text-slate-400 mb-4">PHASE VOTE DISTRIBUTION</h3>
          <div className="flex items-end gap-2 h-24">
            {stats.votesByPhase.map((count, i) => {
              const max = Math.max(...stats.votesByPhase, 1);
              const pct = (count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-neon-cyan/30 to-neon-cyan/80 transition-all duration-500"
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-xs font-mono text-slate-400">P{i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
