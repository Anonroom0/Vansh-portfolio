import { motion } from "framer-motion";
import { Gamepad2, Cpu, Dumbbell } from "lucide-react";

const sections = [
  {
    icon: Gamepad2,
    title: "Games",
    items: ["GTA V", "God of War: Ghost of Sparta", "Red Dead Redemption", "PS3 Homebrew & Modding (multiMAN, Apollo)"],
  },
  {
    icon: Cpu,
    title: "Tech",
    items: ["Cloud infrastructure — Cloudflare R2, Backblaze", "Python automation (Termux / Telethon)", "Custom mechanical engineering — adjustable gym bench linkages", "AI media generation"],
  },
  {
    icon: Dumbbell,
    title: "Hands-on",
    items: ["Designing and fabricating gym equipment", "Console homebrew & firmware exploration", "Shipping full-stack web apps end-to-end"],
  },
];

export function Interests() {
  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Interests & Favorites</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">What I geek out on when I&apos;m not studying or shipping.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-5">
        {sections.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-strong rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 dark:bg-[#007AFF]/20 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-[#007AFF]" />
              </div>
              <h2 className="text-xl font-semibold">{s.title}</h2>
            </div>
            <ul className="space-y-2.5">
              {s.items.map((item) => (
                <li key={item} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2">
                  <span className="text-[#007AFF] mt-1.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
