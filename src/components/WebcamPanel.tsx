import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, AlertTriangle } from "lucide-react";
import type { EmotionState } from "../types";
import { EmotionBadge, getEmotionColor } from "./EmotionBadge";
import { EngagementGauge } from "./EngagementGauge";
import { EngagementChart } from "./EngagementChart";

interface WebcamPanelProps {
  emotionState: EmotionState;
  chartData: Array<{ time: number; score: number; emotion: string }>;
  demoMode: boolean;
}

export function WebcamPanel({ emotionState, chartData, demoMode }: WebcamPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCameraError(false);
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const borderColor = getEmotionColor(emotionState.emotion);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative rounded-2xl overflow-hidden bg-[#0d0d14] border border-white/5 aspect-video">
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl border-2 transition-all duration-700"
              style={{ borderColor: `${borderColor}60` }}
            />
            {emotionState.emotion === "looking_away" && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-lg px-3 py-1.5">
                <AlertTriangle size={14} className="text-orange-400" />
                <span className="text-orange-400 text-xs font-medium">Looking Away</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <EmotionBadge emotion={emotionState.emotion} size="sm" />
              {demoMode && (
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Demo
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            {cameraError ? (
              <>
                <CameraOff size={32} className="text-white/20" />
                <p className="text-white/30 text-sm">Camera unavailable</p>
                <button
                  onClick={startCamera}
                  className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 rounded-lg px-3 py-1.5 transition-colors"
                >
                  Try again
                </button>
              </>
            ) : (
              <>
                <Camera size={32} className="text-white/20" />
                <p className="text-white/30 text-sm">Requesting camera...</p>
              </>
            )}
          </div>
        )}

        {!cameraActive && demoMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/20 flex items-center justify-center">
              <span className="text-4xl">🎭</span>
            </div>
            <p className="text-white/40 text-sm">Demo Mode Active</p>
            <EmotionBadge emotion={emotionState.emotion} size="sm" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-4 flex flex-col items-center">
          <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Engagement</p>
          <EngagementGauge score={emotionState.engagementScore} size={110} />
        </div>

        <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-4 flex flex-col">
          <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Detection</p>
          <div className="space-y-2 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Face</span>
              <span className={`text-xs font-medium ${emotionState.faceDetected ? "text-emerald-400" : "text-white/30"}`}>
                {emotionState.faceDetected ? "Detected" : "None"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Score</span>
              <span className="text-xs font-medium text-white">{emotionState.engagementScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">State</span>
              <EmotionBadge emotion={emotionState.emotion} size="sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-4 flex-1 min-h-0">
        <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Live Engagement (60s)</p>
        <div className="h-28">
          <EngagementChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
