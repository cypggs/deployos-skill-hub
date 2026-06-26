"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare } from "lucide-react";
import { getVisitorId, Feedback } from "@/lib/supabase";

export default function FeedbackWall() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const visitorId = getVisitorId();

  const load = () => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        if (data.feedbacks) setFeedbacks(data.feedbacks);
      });
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitor_id: visitorId,
        author: author.trim() || "Anonymous",
        content: content.trim(),
      }),
    });
    setContent("");
    setAuthor("");
    setSubmitting(false);
    load();
  };

  return (
    <section id="feedback" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            反馈
            <span className="text-neon-cyan">留言墙</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            留下你对 fullstack-deploy skill 的想法，数据实时写入 Supabase。
          </p>
        </div>

        <form
          onSubmit={submit}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-neon-cyan" />
            <span className="font-mono text-sm text-slate-400">NEW MESSAGE</span>
          </div>
          <input
            type="text"
            placeholder="你的名字（可选）"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-cyan/50"
          />
          <textarea
            placeholder="写下你的反馈..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-cyan/50 resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-mono hover:bg-neon-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
            {submitting ? "SENDING..." : "SEND"}
          </button>
        </form>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {feedbacks.map((fb) => (
              <motion.div
                key={fb.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-neon-cyan">
                    {fb.author || "Anonymous"}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(fb.created_at).toLocaleString("zh-CN")}
                  </span>
                </div>
                <p className="text-slate-300 text-sm">{fb.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {feedbacks.length === 0 && (
            <div className="text-center text-slate-500 font-mono py-12">
              NO MESSAGES YET. BE THE FIRST.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
