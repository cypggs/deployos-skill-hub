"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-neon-cyan text-sm font-mono mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
          </span>
          FULLSTACK-DEPLOY SKILL v1.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">Deploy</span>
          <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">OS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          一个用来介绍{" "}
          <span className="text-neon-purple font-semibold">fullstack-deploy</span>{" "}
          skill 的交互式指挥中心。从需求到生产环境 URL，六个阶段全流程可视化。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#phases"
            className="px-8 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-mono hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all"
          >
            探索流水线 →
          </a>
          <a
            href="#credentials"
            className="px-8 py-3 rounded-lg glass-card text-slate-300 font-mono hover:text-white hover:border-neon-purple/40 transition-all"
          >
            获取凭证
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 font-mono text-xs"
      >
        SCROLL TO ENGAGE
      </motion.div>
    </section>
  );
}
