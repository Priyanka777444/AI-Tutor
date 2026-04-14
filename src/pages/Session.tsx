import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { WebcamPanel } from "../components/WebcamPanel";
import { ChatPanel } from "../components/ChatPanel";
import { useEmotion } from "../hooks/useEmotion";
import { useChat } from "../hooks/useChat";

interface SessionProps {
  demoMode: boolean;
}

export function Session({ demoMode }: SessionProps) {
  const navigate = useNavigate();
  const { state: emotionState, chartData } = useEmotion(demoMode);
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat(demoMode);

  const ttsEnabled = localStorage.getItem("adaptiq_tts") === "true";

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content, emotionState.emotion, emotionState.engagementScore);
    },
    [sendMessage, emotionState]
  );

  const handleUploadPdf = useCallback(() => {
    navigate("/knowledge");
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen bg-[#0f0f13]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#12121a]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <h1 className="text-sm font-semibold text-white/80">Learning Session</h1>
          {demoMode && (
            <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full">
              Demo Mode
            </span>
          )}
        </div>
        <button
          onClick={clearMessages}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <RotateCcw size={13} />
          New Session
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[38%] min-w-[340px] border-r border-white/5 p-4 overflow-y-auto">
          <WebcamPanel
            emotionState={emotionState}
            chartData={chartData}
            demoMode={demoMode}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            error={error}
            currentEmotion={emotionState.emotion}
            onSend={handleSend}
            onUploadPdf={handleUploadPdf}
            ttsEnabled={ttsEnabled}
          />
        </div>
      </div>
    </div>
  );
}
