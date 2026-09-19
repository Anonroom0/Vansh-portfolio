import { motion } from "framer-motion";
import { ExternalLink, MessageSquare, CalendarCheck } from "lucide-react";

const apps = [
  {
    name: "AnonRoom",
    tagline: "Anonymous messaging platform",
    description: "Chat freely without revealing who you are. Built for privacy-first conversations with real-time messaging and ephemeral sessions.",
    icon: MessageSquare,
    color: "from-violet-500 to-purple-600",
    tags: ["React", "Supabase", "Realtime"],
  },
  {
    name: "JeeFlow",
    tagline: "JEE study planner & revision",
    description: "A focused planner for JEE aspirants — track chapters, schedule revisions, and stay consistent without the noise of generic todo apps.",
    icon: CalendarCheck,
    color: "from-blue-500 to-cyan-500",
    tags: ["React", "Vite", "Local-first"],
  },
];

export function Apps() {
  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Apps I launched</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">Products I built from idea to shipping.</p>
      </motion.div>
      <div className="space-y-6">
        {apps.map((app, i) => (
          <motion.article key={app.name} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-strong rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shrink-0 shadow-lg`}>
                <app.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{app.name}</h2>
                  <p className="text-[#007AFF] font-medium text-sm mt-0.5">{app.tagline}</p>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{app.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {app.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">{t}</span>
                  ))}
                </div>
                <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#007AFF] hover:underline mt-2">
                  Visit project <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
