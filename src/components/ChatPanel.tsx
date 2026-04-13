import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Paperclip, Brain, Loader, Volume2, VolumeX, StopCircle } from "lucide-react";
import type { Message, Emotion } from "../types";
import { EmotionBadge } from "./EmotionBadge";
import { useSpeech } from "../hooks/useSpeech";

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentEmotion: Emotion;
  onSend: (content: string) => void;
  onUploadPdf?: () => void;
  ttsEnabled: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ message, isSpeaking }: { message: Message; isSpeaking: boolean }) {
  const isUser = message.role === "user";

  const getBorderStyle = () => {
    if (isUser) return "";
    if (message.emotion === "frustrated") return "border-l-2 border-orange-400";
    if (message.emotion === "bored") return "border-l-2 border-yellow-400";
    return "";
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-start group`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-indigo-500/20">
          {isSpeaking ? (
            <Volume2 size={14} className="text-white animate-pulse" />
          ) : (
            <Brain size={14} className="text-white" />
          )}
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-medium text-indigo-400">AdaptIQ Tutor</span>
            {message.emotion && <EmotionBadge emotion={message.emotion} size="sm" />}
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${getBorderStyle()} ${
            isUser
              ? "bg-indigo-600 text-white rounded-tr-sm"
              : "bg-[#1e1e2e] text-white/90 rounded-tl-sm border border-white/5"
          }`}
        >
          {message.content}
        </div>

        <span className="text-xs text-white/20 px-1">{formatTime(message.timestamp)}</span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-[#1e1e2e] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-white/50 font-semibold">
          U
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
        <Brain size={14} className="text-white" />
      </div>
      <div className="bg-[#1e1e2e] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export function ChatPanel({
  messages,
  isLoading,
  error,
  currentEmotion,
  onSend,
  onUploadPdf,
  ttsEnabled,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isRecording, isTranscribing, isSpeaking, startRecording, stopRecording, speak, stopSpeaking } =
    useSpeech();

  const lastMessageRef = useRef<string>("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && lastMsg.content !== lastMessageRef.current) {
      lastMessageRef.current = lastMsg.content;
      speak(lastMsg.content, ttsEnabled);
    }
  }, [messages, ttsEnabled, speak]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    onSend(text);
  }, [input, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicPress = async () => {
    if (isRecording) {
      const transcript = await stopRecording();
      if (transcript) setInput(transcript);
    } else {
      await startRecording();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadPdf) onUploadPdf();
    e.target.value = "";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-white/80">AdaptIQ Session</span>
        </div>
        <div className="flex items-center gap-2">
          <EmotionBadge emotion={currentEmotion} size="sm" />
          {ttsEnabled && (
            <button onClick={stopSpeaking} className="text-white/30 hover:text-white/60 transition-colors" title="Stop speaking">
              {isSpeaking ? <Volume2 size={14} className="text-indigo-400" /> : <VolumeX size={14} />}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isSpeaking={isSpeaking && msg === messages[messages.length - 1] && msg.role === "assistant"} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="text-center">
            <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-1.5 inline-block">
              {error}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-end gap-2 bg-[#1a1a2e] rounded-2xl border border-white/10 px-3 py-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-white/30 hover:text-indigo-400 transition-colors p-1.5 flex-shrink-0"
            title="Upload PDF"
          >
            <Paperclip size={18} />
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Enter to send)"
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-white/20 text-sm resize-none outline-none py-1.5 max-h-32"
            style={{ minHeight: "36px" }}
          />

          <button
            onMouseDown={handleMicPress}
            onMouseUp={isRecording ? handleMicPress : undefined}
            className={`p-1.5 rounded-lg flex-shrink-0 transition-all ${
              isRecording
                ? "text-red-400 bg-red-400/10 animate-pulse"
                : isTranscribing
                ? "text-yellow-400"
                : "text-white/30 hover:text-indigo-400"
            }`}
            title={isRecording ? "Release to transcribe" : "Hold to record"}
          >
            {isTranscribing ? (
              <Loader size={18} className="animate-spin" />
            ) : isRecording ? (
              <StopCircle size={18} />
            ) : (
              <Mic size={18} />
            )}
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl p-2 flex-shrink-0 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-white/20 text-center mt-2">
          {isRecording ? "Recording... release mic to transcribe" : "Shift+Enter for new line"}
        </p>
      </div>
    </div>
  );
}
