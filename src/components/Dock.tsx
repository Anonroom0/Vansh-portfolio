import { motion } from "framer-motion";
import { Home, User, AppWindow, Heart, Image, Link2, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/about", icon: User, label: "About" },
  { to: "/apps", icon: AppWindow, label: "Apps" },
  { to: "/interests", icon: Heart, label: "Interests" },
  { to: "/gallery", icon: Image, label: "Gallery" },
  { to: "/links", icon: Link2, label: "Links" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
];

export function Dock() {
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-strong rounded-3xl px-3 py-2.5 flex items-end gap-1 shadow-2xl shadow-black/20 dark:shadow-black/60">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "dock-item relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl text-zinc-600 dark:text-zinc-400",
                isActive && "text-[#007AFF] bg-[#007AFF]/10 dark:bg-[#007AFF]/20"
              )
            }
            title={label}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-6 h-6 transition-transform", isActive && "scale-110")} strokeWidth={isActive ? 2.2 : 1.8} />
                {isActive && <motion.span layoutId="dock-indicator" className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#007AFF]" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
