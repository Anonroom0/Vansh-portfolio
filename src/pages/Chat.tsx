import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, KeyRound, LogOut, Loader2, Bot } from "lucide-react";
import { format } from "date-fns";
import { useChatSession } from "../hooks/useChatSession";
import { supabase, type Message } from "../lib/supabase";
import { getAIReply } from "../lib/groq";
import { cn } from "../lib/utils";

export function Chat() {
  const { credentials, showSaveModal, setShowSaveModal, isLoading, error, createSession, loginWithCredentials, logout } = useChatSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loginUserId, setLoginUserId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!credentials?.dbId) return;
    const load = async () => {
      const { data } = await supabase.from("messages").select("*").eq("chat_user_id", credentials.dbId).order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    load();
    const channel = supabase
      .channel(`messages:${credentials.dbId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `chat_user_id=eq.${credentials.dbId}` },
        (payload) => {
          setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new as Message]));
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [credentials?.dbId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, aiThinking]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !credentials || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      const { data: userMsg, error: insertErr } = await supabase
        .from("messages")
        .insert({ sender_type: "user", content: text, chat_user_id: credentials.dbId })
        .select()
        .single();
      if (insertErr) throw insertErr;
      if (userMsg) setMessages((prev) => (prev.some((m) => m.id === userMsg.id) ? prev : [...prev, userMsg]));

      let isOnline = false;
      try {
        const { data: settings } = await supabase.from("admin_settings").select("value").eq("key", "online_status").single();
        isOnline = settings?.value?.is_online === true;
      } catch { /* ignore */ }

      if (!isOnline) {
        setAiThinking(true);
        const history = messages
          .filter((m) => m.sender_type === "user" || m.sender_type === "ai")
          .map((m) => ({ role: (m.sender_type === "user" ? "user" : "assistant") as "user" | "assistant", content: m.content }));
        const reply = await getAIReply(text, history);
        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({ sender_type: "ai", content: reply, chat_user_id: credentials.dbId })
          .select()
          .single();
        if (aiMsg) setMessages((prev) => (prev.some((m) => m.id === aiMsg.id) ? prev : [...prev, aiMsg]));
        setAiThinking(false);
      }
    } catch (e) {
      console.error(e);
      setAiThinking(false);
    } finally {
      setSending(false);
    }
  }, [input, credentials, sending, messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" />
      </div>
    );
  }

  if (!credentials) {
    return (
      <div className="max-w-md mx-auto space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Chat with Vansh</h1>
          <p className="text-zinc-600 dark:text-zinc-400">No signup needed. We generate a private User ID + Password so you can return later.</p>
        </div>
        <div className="glass-strong rounded-3xl p-6 space-y-4">
          <button onClick={createSession} className="w-full py-3.5 rounded-2xl bg-[#007AFF] text-white font-medium hover:bg-[#0066DD] transition-colors">
            Start new conversation
          </button>
          <div className="relative flex items-center gap-3 text-sm text-zinc-500">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />or continue existing<div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <input value={loginUserId} onChange={(e) => setLoginUserId(e.target.value)} placeholder="User ID (e.g. VK-XXXXXXXX)"
            className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-[#007AFF]/40 outline-none" />
          <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-[#007AFF]/40 outline-none" />
          <button onClick={() => loginWithCredentials(loginUserId, loginPassword)}
            className="w-full py-3 rounded-2xl glass font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            Restore conversation
          </button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-9rem)] max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">Messages</h1>
          <p className="text-xs text-zinc-500">ID: {credentials.userId}</p>
        </div>
        <button onClick={logout} className="p-2 rounded-xl glass hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors" title="Logout">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4">
        {messages.length === 0 && <div className="text-center text-zinc-500 text-sm py-12">Say hi — if I&apos;m offline my AI clone will reply.</div>}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex flex-col", m.sender_type === "user" ? "items-end" : "items-start")}>
            <div className={cn(m.sender_type === "user" ? "bubble-user" : m.sender_type === "ai" ? "bubble-ai" : "bubble-admin")}>
              {m.sender_type === "ai" && (
                <span className="inline-flex items-center gap-1 text-[10px] opacity-70 mb-1"><Bot className="w-3 h-3" /> AI Clone</span>
              )}
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 px-1">{format(new Date(m.created_at), "HH:mm")}</span>
          </div>
        ))}
        {aiThinking && (
          <div className="flex items-start">
            <div className="bubble-ai flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Thinking…</span></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="iMessage…" className="flex-1 px-4 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-[#007AFF]/40 outline-none text-[15px]" />
        <button onClick={sendMessage} disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-full bg-[#007AFF] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#0066DD] transition-colors shrink-0">
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
      <AnimatePresence>
        {showSaveModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#007AFF]/15 flex items-center justify-center"><KeyRound className="w-5 h-5 text-[#007AFF]" /></div>
                <h2 className="text-lg font-bold">Save these credentials</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Write them down or screenshot. You&apos;ll need them to retrieve this conversation later.</p>
              <div className="space-y-2 bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 font-mono text-sm">
                <div><span className="text-zinc-500">User ID:</span> <span className="font-semibold select-all">{credentials.userId}</span></div>
                <div><span className="text-zinc-500">Password:</span> <span className="font-semibold select-all">{credentials.password}</span></div>
              </div>
              <button onClick={() => setShowSaveModal(false)} className="w-full py-3 rounded-2xl bg-[#007AFF] text-white font-medium">I saved them</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
