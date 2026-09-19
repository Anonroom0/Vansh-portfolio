import { useEffect, useState } from "react";
import { Lock, Image, MessageSquare, Trash2, Plus, LogOut, Wifi, WifiOff, Music } from "lucide-react";
import { supabase, type Message, type PortfolioAsset } from "../lib/supabase";
import type { PlaylistTrack } from "../components/MusicIsland";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "";

export function Admin() {
  const [hostnameOk, setHostnameOk] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"messages" | "assets" | "playlist" | "status">("assets");
  const [messages, setMessages] = useState<Message[]>([]);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [newAsset, setNewAsset] = useState({ type: "photo", title: "", url: "", image_url: "", description: "" });
  const [newTrack, setNewTrack] = useState({ title: "", artist: "", audio_url: "", artwork_url: "" });

  useEffect(() => {
    const host = window.location.hostname;
    if (host === "administrator.vanshkumar.in" || host === "localhost" || host === "127.0.0.1") setHostnameOk(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
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
    const { data: tracks } = await supabase.from("playlist").select("*").order("sort_order");
    if (tracks) setPlaylist(tracks as PlaylistTrack[]);
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

  const addAsset = async () => {
    if (!newAsset.title) return;
    const { data } = await supabase.from("portfolio_assets").insert({
      type: newAsset.type,
      title: newAsset.title,
      url: newAsset.url || null,
      image_url: newAsset.image_url || null,
      description: newAsset.description || null,
    }).select().single();
    if (data) {
      setAssets((p) => [...p, data]);
      setNewAsset({ type: "photo", title: "", url: "", image_url: "", description: "" });
    }
  };

  const addTrack = async () => {
    if (!newTrack.title || !newTrack.audio_url) return;
    const { data } = await supabase.from("playlist").insert({
      title: newTrack.title,
      artist: newTrack.artist || null,
      audio_url: newTrack.audio_url,
      artwork_url: newTrack.artwork_url || null,
      sort_order: playlist.length,
    }).select().single();
    if (data) {
      setPlaylist((p) => [...p, data as PlaylistTrack]);
      setNewTrack({ title: "", artist: "", audio_url: "", artwork_url: "" });
    }
  };

  if (!hostnameOk) {
    return <div className="min-h-dvh grid place-items-center bg-black text-white"><div><h1 className="text-2xl font-black">404</h1></div></div>;
  }

  if (!authed) {
    return (
      <div className="min-h-dvh grid place-items-center bg-[#111] p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 text-white">
          <Lock className="w-6 h-6" />
          <h1 className="text-xl font-black">Admin</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoFocus
            className="w-full px-3 py-3 bg-black border-2 border-white text-white outline-none" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full py-3 bg-white text-black font-bold">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#111] text-[#f3f3f3] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-black">Admin</h1>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-2 text-sm opacity-70"><LogOut className="w-4 h-4" /> Lock</button>
        </header>
        <div className="flex flex-wrap gap-2 border-b-2 border-white/20 pb-2">
          {([
            { id: "assets" as const, label: "Content", icon: Image },
            { id: "playlist" as const, label: "Playlist", icon: Music },
            { id: "messages" as const, label: "Messages", icon: MessageSquare },
            { id: "status" as const, label: "Status", icon: Wifi },
          ]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-bold border-2 ${tab === t.id ? "border-white bg-white text-black" : "border-transparent text-white/60"}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {tab === "status" && (
          <button onClick={toggleOnline} className="flex items-center gap-2 px-4 py-3 border-2 border-white font-bold">
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            {isOnline ? "Online — AI off" : "Offline — AI on"}
          </button>
        )}

        {tab === "messages" && (
          <div className="space-y-2">
            {messages.length === 0 && <p className="text-white/50 text-sm">No messages.</p>}
            {messages.map((m) => (
              <div key={m.id} className="border-2 border-white/20 p-3 flex gap-3">
                <div className="flex-1">
                  <div className="text-xs text-white/50">{m.sender_type} · {new Date(m.created_at).toLocaleString()}</div>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
                <button onClick={() => { supabase.from("messages").delete().eq("id", m.id); setMessages((p) => p.filter((x) => x.id !== m.id)); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "assets" && (
          <div className="space-y-4">
            <div className="border-2 border-white p-4 space-y-2">
              <h3 className="font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add content</h3>
              <select value={newAsset.type} onChange={(e) => setNewAsset((p) => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40">
                <option value="photo">Photo (gallery)</option>
                <option value="app">App</option>
                <option value="connection">Link / contact</option>
                <option value="link">Interest</option>
              </select>
              <input placeholder="Title" value={newAsset.title} onChange={(e) => setNewAsset((p) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40" />
              <input placeholder="Description" value={newAsset.description} onChange={(e) => setNewAsset((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40" />
              <input placeholder="URL" value={newAsset.url} onChange={(e) => setNewAsset((p) => ({ ...p, url: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40" />
              <input placeholder="Image URL" value={newAsset.image_url} onChange={(e) => setNewAsset((p) => ({ ...p, image_url: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40" />
              <button onClick={addAsset} className="px-4 py-2 bg-white text-black font-bold">Add</button>
            </div>
            {assets.map((a) => (
              <div key={a.id} className="border-2 border-white/20 p-3 flex items-center gap-3">
                <div className="flex-1"><div className="font-bold">{a.title}</div><div className="text-xs text-white/50">{a.type}</div></div>
                <button onClick={() => { supabase.from("portfolio_assets").delete().eq("id", a.id); setAssets((p) => p.filter((x) => x.id !== a.id)); }}><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {tab === "playlist" && (
          <div className="space-y-4">
            <p className="text-sm text-white/60">Paste full-length MP3/audio URLs (Jamendo, Internet Archive, your own file host). Previews will not auto-skip — user hits next.</p>
            <div className="border-2 border-white p-4 space-y-2">
              <input placeholder="Title" value={newTrack.title} onChange={(e) => setNewTrack((p) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40" />
              <input placeholder="Artist" value={newTrack.artist} onChange={(e) => setNewTrack((p) => ({ ...p, artist: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40" />
              <input placeholder="Audio URL (full file)" value={newTrack.audio_url} onChange={(e) => setNewTrack((p) => ({ ...p, audio_url: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40" />
              <input placeholder="Artwork URL" value={newTrack.artwork_url} onChange={(e) => setNewTrack((p) => ({ ...p, artwork_url: e.target.value }))} className="w-full px-3 py-2 bg-black border-2 border-white/40" />
              <button onClick={addTrack} className="px-4 py-2 bg-white text-black font-bold">Add track</button>
            </div>
            {playlist.map((t) => (
              <div key={t.id} className="border-2 border-white/20 p-3 flex items-center gap-3">
                <div className="flex-1"><div className="font-bold">{t.title}</div><div className="text-xs text-white/50">{t.artist}</div></div>
                <button onClick={() => { supabase.from("playlist").delete().eq("id", t.id); setPlaylist((p) => p.filter((x) => x.id !== t.id)); }}><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
