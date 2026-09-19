-- Vaibhav Portfolio — Supabase Schema
-- Paste into Supabase SQL Editor and run once

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- chat_users
CREATE TABLE IF NOT EXISTS public.chat_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generated_user_id TEXT NOT NULL UNIQUE,
  generated_password_hash TEXT NOT NULL,
  display_name TEXT,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_users_generated_user_id ON public.chat_users(generated_user_id);

-- messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai', 'admin')),
  content TEXT NOT NULL,
  chat_user_id UUID NOT NULL REFERENCES public.chat_users(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_chat_user_id ON public.messages(chat_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- portfolio_assets
CREATE TABLE IF NOT EXISTS public.portfolio_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('photo', 'app', 'connection', 'link')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image_url TEXT,
  favicon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_portfolio_assets_type ON public.portfolio_assets(type);

-- admin_settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.admin_settings (key, value)
VALUES ('online_status', '{"is_online": false, "last_updated": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE public.chat_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_chat_users" ON public.chat_users FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_select_chat_users" ON public.chat_users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_messages" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_select_messages" ON public.messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_update_messages" ON public.messages FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "public_select_assets" ON public.portfolio_assets FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "public_all_assets_admin" ON public.portfolio_assets FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_select_settings" ON public.admin_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_upsert_settings" ON public.admin_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Seed sample assets
INSERT INTO public.portfolio_assets (type, title, description, url, sort_order) VALUES
  ('app', 'AnonRoom', 'Anonymous messaging platform', 'https://anonroom.example.com', 1),
  ('app', 'JeeFlow', 'JEE study planner & revision tracker', 'https://jeeflow.example.com', 2),
  ('connection', 'GitHub', 'Open-source work', 'https://github.com', 1),
  ('connection', 'Spotify', 'What I listen to', 'https://open.spotify.com', 2)
ON CONFLICT DO NOTHING;
