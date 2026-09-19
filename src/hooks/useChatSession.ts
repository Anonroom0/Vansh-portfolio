import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { generatePassword, generateUserId, simpleHash } from "../lib/utils";

const STORAGE_KEY = "vk_chat_credentials";

type Credentials = { userId: string; password: string; dbId: string };

export function useChatSession() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restore = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Credentials;
          const { data } = await supabase
            .from("chat_users")
            .select("*")
            .eq("generated_user_id", parsed.userId)
            .single();
          if (data) {
            const hash = await simpleHash(parsed.password);
            if (hash === data.generated_password_hash) {
              setCredentials(parsed);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch { /* ignore */ }
      setIsLoading(false);
    };
    restore();
  }, []);

  const createSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = generateUserId();
      const password = generatePassword();
      const hash = await simpleHash(password);
      const { data, error: insertError } = await supabase
        .from("chat_users")
        .insert({ generated_user_id: userId, generated_password_hash: hash })
        .select()
        .single();
      if (insertError) throw insertError;
      const creds: Credentials = { userId, password, dbId: data.id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
      setCredentials(creds);
      setShowSaveModal(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create session");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithCredentials = useCallback(async (userId: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("chat_users")
        .select("*")
        .eq("generated_user_id", userId.trim().toUpperCase())
        .single();
      if (fetchError || !data) throw new Error("Invalid User ID");
      const hash = await simpleHash(password);
      if (hash !== data.generated_password_hash) throw new Error("Invalid Password");
      const creds: Credentials = { userId: data.generated_user_id, password, dbId: data.id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
      setCredentials(creds);
      setShowSaveModal(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCredentials(null);
  }, []);

  return { credentials, showSaveModal, setShowSaveModal, isLoading, error, createSession, loginWithCredentials, logout };
}
