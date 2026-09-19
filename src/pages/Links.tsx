import { motion } from "framer-motion";
import { Github, Music, ExternalLink, Globe } from "lucide-react";

const socials = [
  { name: "GitHub", href: "https://github.com", icon: Github, color: "hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black" },
  { name: "Spotify", href: "https://open.spotify.com", icon: Music, color: "hover:bg-[#1DB954] hover:text-white" },
];

const connections = [
  { title: "Friend's Portfolio", url: "https://example.com", description: "Another builder I respect" },
  { title: "Study Resource Hub", url: "https://example.com", description: "Shared notes & materials" },
];

export function Links() {
  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Contacts & Links</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">Find me online or explore other people I connect with.</p>
      </motion.div>
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Personal Contacts</h2>
        <div className="flex flex-wrap gap-3">
          {socials.map((s, i) => (
            <motion.a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}
              className={`glass-strong rounded-2xl px-5 py-3.5 flex items-center gap-3 font-medium transition-all ${s.color}`}>
              <s.icon className="w-5 h-5" />{s.name}
            </motion.a>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Other Connections</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {connections.map((c, i) => (
            <motion.a key={c.title} href={c.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="glass-strong rounded-2xl p-5 flex items-start gap-4 group hover:scale-[1.01] transition-transform">
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold flex items-center gap-1.5">
                  {c.title}
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#007AFF]" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{c.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}
