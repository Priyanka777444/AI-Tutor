import type { Message } from "../types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function getApiKey(): string {
  return localStorage.getItem("adaptiq_groq_key") || "";
}

function getOpenAIKey(): string {
  return localStorage.getItem("adaptiq_openai_key") || "";
}

export async function sendChatMessage(
  message: string,
  emotion: string,
  engagementScore: number,
  history: Message[]
): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(`${SUPABASE_URL}/functions/v1/adaptiq-chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      emotion,
      engagement_score: engagementScore,
      history: history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      api_key: apiKey,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || "Chat request failed");
  }

  return data.reply as string;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const apiKey = getOpenAIKey();
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.webm");
  if (apiKey) formData.append("api_key", apiKey);

  const response = await fetch(`${SUPABASE_URL}/functions/v1/adaptiq-transcribe`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || "Transcription failed");
  }

  return data.transcript as string;
}
