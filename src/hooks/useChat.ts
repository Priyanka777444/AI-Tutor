import { useState, useCallback } from "react";
import type { Message, Emotion } from "../types";
import { sendChatMessage } from "../lib/api";
import { DEMO_RESPONSES, MOCK_CHAT_MESSAGES } from "../lib/mockData";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function getDemoResponse(emotion: Emotion): string {
  const key = emotion === "looking_away" ? "neutral" : emotion;
  const responses = DEMO_RESPONSES[key] || DEMO_RESPONSES.neutral;
  return responses[Math.floor(Math.random() * responses.length)];
}

export function useChat(demoMode: boolean) {
  const [messages, setMessages] = useState<Message[]>(MOCK_CHAT_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string, emotion: Emotion, engagementScore: number) => {
      if (!content.trim()) return null;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        emotion,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        let reply: string;

        if (demoMode) {
          await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
          reply = getDemoResponse(emotion);
        } else {
          reply = await sendChatMessage(
            content,
            emotion,
            engagementScore,
            messages.concat(userMessage)
          );
        }

        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: reply,
          emotion,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        return assistantMessage;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to get response";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [demoMode, messages]
  );

  const clearMessages = useCallback(() => {
    setMessages(MOCK_CHAT_MESSAGES);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
