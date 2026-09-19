import { supabase } from "./supabase";

/**
 * Calls the Supabase Edge Function `ai-reply`.
 * GROQ_API_KEY lives only on the server — never in the browser bundle.
 */
export async function getAIReply(
  userMessage: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[] = []
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("ai-reply", {
      body: {
        message: userMessage,
        history: conversationHistory,
      },
    });

    if (error) {
      console.error("Edge function error:", error);
      return "Sorry, my AI brain hiccuped. Message saved — Vaibhav will see it later.";
    }

    return data?.reply?.trim() || "Hmm, I blanked for a second. Try again?";
  } catch (err) {
    console.error("AI reply error:", err);
    return "Sorry, my AI brain hiccuped. Message saved — Vaibhav will see it later.";
  }
}
