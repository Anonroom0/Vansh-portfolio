import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

const placeholders = [
  { id: 1, h: "h-48", label: "Build log #1" },
  { id: 2, h: "h-64", label: "PS3 setup" },
  { id: 3, h: "h-40", label: "Gym bench prototype" },
  { id: 4, h: "h-56", label: "Desk setup" },
  { id: 5, h: "h-44", label: "Code late night" },
  { id: 6, h: "h-60", label: "Meerut sunset" },
  { id: 7, h: "h-52", label: "Hardware experiments" },
  { id: 8, h: "h-36", label: "Whiteboard plans" },
];

export function Gallery() {
  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Photo Gallery</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          Moments, builds, and experiments. (Placeholders — admin can upload real photos.)
        </p>
      </motion.div>
      <div className="columns-2 sm:columns-3 gap-4 space-y-4">
        {placeholders.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            className={`break-inside-avoid rounded-2xl overflow-hidden glass group relative ${p.h}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-zinc-400 dark:text-zinc-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <span className="text-xs text-white/90 font-medium">{p.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
