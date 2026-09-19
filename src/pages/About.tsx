import { motion } from "framer-motion";
import { BookOpen, MapPin, GraduationCap, Code2 } from "lucide-react";

const cards = [
  { icon: GraduationCap, title: "Class 11 · CS", body: "Currently in Class 11 studying Computer Science. Deep into algorithms, systems, and building real products." },
  { icon: MapPin, title: "Meerut, India", body: "Based in Meerut. Building for the web from a city that keeps me grounded and focused." },
  { icon: BookOpen, title: "JEE Prep", body: "Preparing seriously with Arjuna JEE 2.0. Balancing rigorous academics with shipping side projects." },
  { icon: Code2, title: "Builder mindset", body: "React, Vite, Supabase, Python, Cloudflare R2, Termux automation — I learn by shipping." },
];

export function About() {
  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">About me</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          I&apos;m Vaibhav K. Singhal — a Class 11 Computer Science student from Meerut, India, currently preparing for the JEE while building apps that real people use.
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-strong rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 dark:bg-[#007AFF]/20 flex items-center justify-center">
              <c.icon className="w-5 h-5 text-[#007AFF]" />
            </div>
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
