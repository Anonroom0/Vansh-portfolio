import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Image, MessageSquare, Trash2, Plus, LogOut, Wifi, WifiOff } from "lucide-react";
import { supabase, type Message, type PortfolioAsset } from "../lib/supabase";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "vaibhav-admin-2026";

export function Admin() {
  const [hostnameOk, setHostnameOk] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"messages" | "assets" | "status">("messages");
  const [messages, setMessages] = useState<Message[]>([]);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [newAsset, setNewAsset] = useState({ type: "photo" as string, title: "", url: "", image_url: "" });

  useEffect(() => {
    const host = window.location.hostname;
    if (host === "administrator.vanshkumar.in" || host === "localhost" || host === "127.0.0.1") {
      setHostnameOk(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
      loadData();
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const loadData = async () => {
    const { data: msgs } = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(100);
    if (msgs) setMessages(msgs);
    const { data: assts } = await supabase.from("portfolio_assets").select("*").order("sort_order");
    if (assts) setAssets(assts);
    const { data: settings } = await supabase.from("admin_settings").select("value").eq("key", "online_status").single();
    if (settings?.value) setIsOnline(!!settings.value.is_online);
  };

  const toggleOnline = async () => {
    const next = !isOnline;
    await supabase.from("admin_settings").upsert({
      key: "online_status",
      value: { is_online: next, last_updated: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    });
    setIsOnline(next);
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const addAsset = async () => {
    if (!newAsset.title) return;
    const { data } = await supabase.from("portfolio_assets").insert({
      type: newAsset.type,
      title: newAsset.title,
      url: newAsset.url || null,
      image_url: newAsset.image_url || null,
    }).select().single();
    if (data) {
      setAssets((prev) => [...prev, data]);
      setNewAsset({ type: "photo", title: "", url: "", image_url: "" });
    }
  };

  const deleteAsset = async (id: string) => {
    await supabase.from("portfolio_assets").delete().eq("id", id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  if (!hostnameOk) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-black text-white p-6">
        <div className="text-center space-y-2"><h1 className="text-2xl font-bold">404</h1><p className="text-zinc-500">This page does not exist.</p></div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950 p-6">
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto"><Lock className="w-7 h-7 text-zinc-400" /></div>
            <h1 className="text-xl font-semibold text-white">Admin Access</h1>
            <p className="text-sm text-zinc-500">Password required every visit</p>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoFocus
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50" />
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-[#007AFF] text-white font-medium hover:bg-[#0066DD]">Unlock</button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
            <LogOut className="w-4 h-4" /> Lock
          </button>
        </header>
        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          {([
            { id: "messages" as const, label: "Messages", icon: MessageSquare },
            { id: "assets" as const, label: "Assets", icon: Image },
            { id: "status" as const, label: "Status", icon: Wifi },
          ]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>
        {tab === "status" && (
          <div className="bg-zinc-900 rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold">Online Status</h2>
            <p className="text-sm text-zinc-400">When offline, the AI clone replies automatically.</p>
            <button onClick={toggleOnline}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium ${isOnline ? "bg-emerald-600/20 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              {isOnline ? "Online (AI disabled)" : "Offline (AI active)"}
            </button>
          </div>
        )}
        {tab === "messages" && (
          <div className="space-y-3">
            {messages.length === 0 && <p className="text-zinc-500 text-sm">No messages yet.</p>}
            {messages.map((m) => (
              <div key={m.id} className="bg-zinc-900 rounded-xl p-4 flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                    <span className={m.sender_type === "user" ? "text-blue-400" : m.sender_type === "ai" ? "text-purple-400" : "text-amber-400"}>{m.sender_type}</span>
                    <span>•</span>
                    <span>{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
                <button onClick={() => deleteMessage(m.id)} className="p-1.5 text-zinc-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
        {tab === "assets" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-2xl p-5 space-y-3">
              <h3 className="font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Add asset</h3>
              <select value={newAsset.type} onChange={(e) => setNewAsset((p) => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border-0 text-sm">
                <option value="photo">Photo</option>
                <option value="app">App</option>
                <option value="connection">Connection</option>
                <option value="link">Link</option>
              </select>
              <input placeholder="Title" value={newAsset.title} onChange={(e) => setNewAsset((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border-0 text-sm" />
              <input placeholder="URL (optional)" value={newAsset.url} onChange={(e) => setNewAsset((p) => ({ ...p, url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border-0 text-sm" />
              <input placeholder="Image URL (optional)" value={newAsset.image_url} onChange={(e) => setNewAsset((p) => ({ ...p, image_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border-0 text-sm" />
              <button onClick={addAsset} className="px-4 py-2 rounded-lg bg-[#007AFF] text-sm font-medium">Add</button>
            </div>
            <div className="space-y-2">
              {assets.map((a) => (
                <div key={a.id} className="bg-zinc-900 rounded-xl p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="font-medium">{a.title}</div>
                    <div className="text-xs text-zinc-500">{a.type} · {a.url || "no url"}</div>
                  </div>
                  <button onClick={() => deleteAsset(a.id)} className="p-1.5 text-zinc-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
