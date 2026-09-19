import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { NAV } from "../lib/nav";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function Home() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
      <motion.div variants={item} className="space-y-4">
        <p className="text-[13px] font-semibold tracking-wide" style={{ color: "var(--accent)" }}>
          Meerut · Class 11 · Computer Science
        </p>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.94]">
          Vansh
          <br />
          Kumar.
        </h1>
        <p className="max-w-lg text-lg md:text-xl leading-relaxed" style={{ color: "var(--muted)" }}>
          Preparing for JEE. Building things that actually ship — added by hand, nothing fake.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {NAV.filter((n) => n.to !== "/").map((n) => {
          const Icon = n.icon;
          return (
            <NavLink
              key={n.to}
              to={n.to}
              className="surface p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <span className="icon-btn w-10 h-10">
                <Icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
              </span>
              <span className="font-semibold">{n.label}</span>
            </NavLink>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
