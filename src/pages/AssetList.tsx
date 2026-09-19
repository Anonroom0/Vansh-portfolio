import { useEffect, useState } from "react";
import { supabase, type PortfolioAsset } from "../lib/supabase";

export function AssetList({
  type,
  title,
  empty,
}: {
  type: PortfolioAsset["type"];
  title: string;
  empty: string;
}) {
  const [items, setItems] = useState<PortfolioAsset[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase
      .from("portfolio_assets")
      .select("*")
      .eq("type", type)
      .eq("is_published", true)
      .order("sort_order")
      .then(({ data }) => {
        setItems(data || []);
        setReady(true);
      });
  }, [type]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black tracking-tight">{title}</h1>
      {!ready && <p className="text-[var(--muted)]">Loading…</p>}
      {ready && items.length === 0 && (
        <div className="rule bg-[var(--card)] p-6 shadow-hard text-[var(--muted)]">{empty}</div>
      )}
      <div className={type === "photo" ? "columns-2 gap-3 space-y-3" : "space-y-3"}>
        {items.map((item) =>
          type === "photo" ? (
            <div key={item.id} className="break-inside-avoid rule bg-[var(--card)] overflow-hidden">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full block" />
              ) : (
                <div className="h-40 flex items-center justify-center text-sm text-[var(--muted)]">{item.title}</div>
              )}
            </div>
          ) : (
            <a
              key={item.id}
              href={item.url || "#"}
              target={item.url ? "_blank" : undefined}
              rel="noreferrer"
              className="flex gap-4 items-center rule bg-[var(--card)] p-4 shadow-hard"
            >
              {(item.image_url || item.favicon_url) && (
                <img src={item.image_url || item.favicon_url || ""} alt="" className="w-12 h-12 object-cover border-2 border-[var(--line)]" />
              )}
              <div className="min-w-0">
                <div className="font-bold">{item.title}</div>
                {item.description && <div className="text-sm text-[var(--muted)]">{item.description}</div>}
              </div>
            </a>
          )
        )}
      </div>
    </div>
  );
}
