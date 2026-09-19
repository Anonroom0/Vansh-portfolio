import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MusicIsland } from "./MusicIsland";
import { NAV } from "../lib/nav";
import { cn } from "../lib/utils";

export function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isRoot = pathname === "/";
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    const active = scrollerRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [pathname]);

  const currentLabel = NAV.find((n) => (n.to === "/" ? isRoot : pathname.startsWith(n.to)))?.label ?? "Vansh";

  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: "var(--hairline)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-14 flex items-center gap-3">
            {!isRoot ? (
              <button onClick={() => navigate(-1)} className="icon-btn shrink-0 -ml-1.5" aria-label="Back">
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <NavLink to="/" className="font-bold tracking-tight text-[17px] shrink-0">
                Vansh
              </NavLink>
            )}
            <span className="font-semibold text-[15px] truncate">{isRoot ? "" : currentLabel}</span>
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <MusicIsland />
              <ThemeToggle />
            </div>
          </div>

          <nav ref={scrollerRef} className="flex items-center gap-1 no-scrollbar overflow-x-auto pb-2.5 -mt-0.5">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = n.to === "/" ? isRoot : pathname.startsWith(n.to);
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  data-active={active}
                  className={cn("pill flex items-center gap-1.5 shrink-0", active && "active")}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.4} />
                  {n.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
