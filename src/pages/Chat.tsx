import { useCallback, useEffect, useRef, useState } from "react";
import { Send, LogOut, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useChatSession } from "../hooks/useChatSession";
import { supabase, type Message } from "../lib/supabase";
import { getAIReply } from "../lib/groq";
import { cn } from "../lib/utils";

export function Chat() {
  const { credentials, isLoading, error, register, login, logout } = useChatSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!credentials?.dbId) return;
    supabase
      .from("messages")
      .select("*")
      .eq("chat_user_id", credentials.dbId)
      .order("created_at", { ascending: true })
      .then(({ data }) => data && setMessages(data));

    const channel = supabase
      .channel(`messages:${credentials.dbId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_user_id=eq.${credentials.dbId}` },
        (payload) => {
          setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new as Message]));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [credentials?.dbId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiThinking]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !credentials || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      const { data: userMsg } = await supabase
        .from("messages")
        .insert({ sender_type: "user", content: text, chat_user_id: credentials.dbId })
        .select()
        .single();
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
          .map((m) => ({
            role: (m.sender_type === "user" ? "user" : "assistant") as "user" | "assistant",
            content: m.content,
          }));
        const reply = await getAIReply(text, history);
        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({ sender_type: "ai", content: reply, chat_user_id: credentials.dbId })
          .select()
          .single();
        if (aiMsg) setMessages((prev) => (prev.some((m) => m.id === aiMsg.id) ? prev : [...prev, aiMsg]));
        setAiThinking(false);
      }
    } catch {
      setAiThinking(false);
    } finally {
      setSending(false);
    }
  }, [input, credentials, sending, messages]);

  if (isLoading) return <p className="text-[var(--muted)]">Loading…</p>;

  if (!credentials) {
    return (
      <div className="max-w-md space-y-5">
        <h1 className="text-4xl font-black tracking-tight">Chat</h1>
        <p className="text-[var(--muted)]">Pick your own username and password. No email. No OTP.</p>
        <div className="flex gap-2">
          <button className={mode === "login" ? "btn-fill px-3 py-1" : "btn-hard px-3 py-1"} onClick={() => setMode("login")}>
            Sign in
          </button>
          <button className={mode === "register" ? "btn-fill px-3 py-1" : "btn-hard px-3 py-1"} onClick={() => setMode("register")}>
            Create
          </button>
        </div>
        <div className="rule bg-[var(--card)] p-5 shadow-hard space-y-3">
          <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Username"
            className="w-full px-3 py-3 rule bg-[var(--paper)] outline-none" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full px-3 py-3 rule bg-[var(--paper)] outline-none" />
          <button
            className="btn-fill w-full py-3"
            onClick={() => (mode === "register" ? register(userId, password) : login(userId, password))}
          >
            {mode === "register" ? "Create conversation" : "Open conversation"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black">Chat</h1>
          <p className="text-xs text-[var(--muted)]">{credentials.userId}</p>
        </div>
        <button onClick={logout} className="btn-hard p-2" aria-label="Sign out"><LogOut className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 rule bg-[var(--card)] p-4">
        {messages.length === 0 && <p className="text-sm text-[var(--muted)]">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex flex-col", m.sender_type === "user" ? "items-end" : "items-start")}>
            <div className={cn("max-w-[80%] px-3 py-2 text-sm border-2 border-[var(--line)]", m.sender_type === "user" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper)]")}>
              {m.content}
            </div>
            <span className="text-[10px] text-[var(--muted)] mt-1">{format(new Date(m.created_at), "HH:mm")}</span>
          </div>
        ))}
        {aiThinking && <p className="text-sm text-[var(--muted)]">…</p>}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 pt-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message" className="flex-1 px-3 py-3 rule bg-[var(--card)] outline-none" />
        <button onClick={sendMessage} disabled={!input.trim() || sending} className="btn-fill px-4">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
