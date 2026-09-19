import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { MusicIsland } from "./MusicIsland";
import { NAV } from "../lib/nav";
import { cn } from "../lib/utils";

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-dvh grid-bg">
      <header className="sticky top-0 z-40 border-b-2 border-[var(--line)] bg-[var(--paper)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <NavLink to="/" className="font-black tracking-tight text-lg">VANSH</NavLink>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  cn("px-3 py-1 border-2 border-transparent", isActive && "border-[var(--line)] bg-[var(--card)]")
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <MusicIsland />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Desktop: two columns. Mobile: stacked, Linktree list on home only */}
        <div className="hidden md:grid md:grid-cols-[280px_1fr] gap-8 items-start">
          <aside className="sticky top-24 space-y-3">
            <div className="rule bg-[var(--card)] p-4 shadow-hard">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)]">Vansh Kumar</div>
              <div className="mt-1 font-black text-2xl leading-none">Portfolio</div>
            </div>
            <nav className="space-y-2">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rule bg-[var(--card)] px-4 py-3 font-semibold shadow-hard",
                      isActive && "bg-[var(--ink)] text-[var(--paper)]"
                    )
                  }
                >
                  {n.label}
                  <span aria-hidden>→</span>
                </NavLink>
              ))}
            </nav>
          </aside>
          <section>
            <Outlet />
          </section>
        </div>

        <div className="md:hidden space-y-6">
          {pathname === "/" && (
            <nav className="space-y-2">
              {NAV.filter((n) => n.to !== "/").map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className="flex items-center justify-between rule bg-[var(--card)] px-4 py-4 font-semibold shadow-hard"
                >
                  {n.label}
                  <span aria-hidden>→</span>
                </NavLink>
              ))}
            </nav>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
