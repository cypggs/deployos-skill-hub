"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import StatsDashboard from "@/components/StatsDashboard";
import PhaseTimeline from "@/components/PhaseTimeline";
import CredentialWizard from "@/components/CredentialWizard";
import Checklist from "@/components/Checklist";
import Voting from "@/components/Voting";
import FeedbackWall from "@/components/FeedbackWall";
import Terminal from "@/components/Terminal";
import HealthPanel from "@/components/HealthPanel";
import { getVisitorId } from "@/lib/supabase";

export default function Home() {
  useEffect(() => {
    const visitorId = getVisitorId();
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_id: visitorId }),
    }).catch(() => {});
  }, []);

  return (
    <main className="relative min-h-screen cyber-grid">
      <div className="fixed inset-0 pointer-events-none scanline" />

      <Hero />
      <StatsDashboard />
      <PhaseTimeline />
      <CredentialWizard />
      <Checklist />
      <Voting />
      <Terminal />
      <FeedbackWall />
      <HealthPanel />

      <footer className="py-12 text-center border-t border-white/5">
        <p className="text-slate-500 font-mono text-sm">
          Built with{" "}
          <span className="text-neon-cyan">fullstack-deploy</span> skill ·
          Powered by Next.js + Supabase + Vercel
        </p>
        <p className="text-slate-600 text-xs mt-2">
          © {new Date().getFullYear()} DeployOS Skill Hub
        </p>
      </footer>
    </main>
  );
}
