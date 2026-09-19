import { Outlet } from "react-router-dom";
import { Dock } from "./Dock";
import { ThemeToggle } from "./ThemeToggle";
import { MusicPlayer } from "./MusicPlayer";
import { motion } from "framer-motion";

export function Layout() {
  return (
    <div className="min-h-dvh relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#007AFF]/15 dark:bg-[#007AFF]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#5856D6]/15 dark:bg-[#5856D6]/10 blur-[100px]" />
      </div>
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="font-semibold text-lg tracking-tight">
          Vansh<span className="text-[#007AFF]">.</span>
        </motion.div>
        <ThemeToggle />
      </header>
      <main className="pt-20 pb-28 px-4 sm:px-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
      <MusicPlayer />
      <Dock />
    </div>
  );
}
