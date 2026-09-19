import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-zinc-600 dark:text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-[#007AFF]" />
          Class 11 · Meerut · Building in public
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          Hey, I&apos;m{" "}
          <span className="bg-gradient-to-r from-[#007AFF] to-[#5856D6] bg-clip-text text-transparent">Vansh</span>
        </h1>
        <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed font-medium">
          Computer Science student preparing for JEE.
          <br />I ship apps, mod consoles, and design things that move.
        </p>
        <div className="flex flex-wrap gap-3 pt-4">
          <Link to="/apps" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#007AFF] text-white font-medium hover:bg-[#0066DD] transition-colors shadow-lg shadow-[#007AFF]/25">
            View projects <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/chat" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-strong font-medium hover:scale-[1.02] transition-transform">
            Chat with me
          </Link>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Apps launched", value: "2+" },
          { label: "Focus", value: "JEE + Code" },
          { label: "Stack", value: "React · Supabase" },
          { label: "Based in", value: "Meerut" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold tracking-tight">{s.value}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
