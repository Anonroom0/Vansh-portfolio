import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { supabase, type PortfolioAsset } from "../lib/supabase";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

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
    setReady(false);
    supabase
      .from("portfolio_assets")
      .select("*")
      .eq("type", type)
      .eq("is_published", true)
      .order("sort_order")
      .then(({ data }) => {
        setItems(data || []);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [type]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>

      {!ready && (
        <div className={type === "photo" ? "columns-2 gap-3 space-y-3" : "space-y-3"}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`skeleton ${type === "photo" ? "h-40 break-inside-avoid" : "h-20"}`} />
          ))}
        </div>
      )}

      {ready && items.length === 0 && (
        <div className="surface p-6 text-[15px]" style={{ color: "var(--muted)" }}>
          {empty}
        </div>
      )}

      {ready && items.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={type === "photo" ? "columns-2 gap-3 space-y-3" : "space-y-3"}
        >
          {items.map((asset) =>
            type === "photo" ? (
              <motion.div key={asset.id} variants={item} className="break-inside-avoid surface overflow-hidden">
                {asset.image_url ? (
                  <img src={asset.image_url} alt={asset.title} className="w-full block" loading="lazy" />
                ) : (
                  <div className="h-40 flex items-center justify-center text-sm" style={{ color: "var(--muted)" }}>
                    {asset.title}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.a
                key={asset.id}
                variants={item}
                whileTap={{ scale: 0.98 }}
                href={asset.url || "#"}
                target={asset.url ? "_blank" : undefined}
                rel="noreferrer"
                className="flex gap-4 items-center surface p-4 hover:shadow-md transition-shadow"
              >
                {(asset.image_url || asset.favicon_url) && (
                  <img
                    src={asset.image_url || asset.favicon_url || ""}
                    alt=""
                    className="w-12 h-12 object-cover rounded-xl shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{asset.title}</div>
                  {asset.description && (
                    <div className="text-sm truncate" style={{ color: "var(--muted)" }}>
                      {asset.description}
                    </div>
                  )}
                </div>
                {asset.url && <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "var(--muted)" }} />}
              </motion.a>
            )
          )}
        </motion.div>
      )}
    </div>
  );
}
