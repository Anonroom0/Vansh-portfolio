import { motion } from "framer-motion";

export function About() {
  return (
    <div className="space-y-6 max-w-2xl">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-extrabold tracking-tight"
      >
        About
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="surface p-6 md:p-8 space-y-4 text-[17px] leading-relaxed"
      >
        <p>I'm Vansh Kumar, a Class 11 Computer Science student from Meerut, India.</p>
        <p style={{ color: "var(--muted)" }}>
          Preparing for JEE (Arjuna JEE 2.0). I build web apps with React, Vite, Supabase, and Python.
        </p>
      </motion.div>
    </div>
  );
}
