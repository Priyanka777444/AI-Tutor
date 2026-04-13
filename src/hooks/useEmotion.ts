import { useState, useEffect, useRef, useCallback } from "react";
import type { Emotion, EmotionState, EngagementReading } from "../types";
import { DEMO_EMOTION_CYCLE } from "../lib/mockData";

const HISTORY_SECONDS = 60;
const READING_INTERVAL = 1000;

export function useEmotion(demoMode: boolean) {
  const [state, setState] = useState<EmotionState>({
    emotion: "neutral",
    engagementScore: 70,
    faceDetected: false,
  });
  const [history, setHistory] = useState<EngagementReading[]>([]);

  const demoIndexRef = useRef(0);
  const demoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addReading = useCallback((emotion: Emotion, score: number, faceDetected: boolean) => {
    const reading: EngagementReading = {
      timestamp: Date.now(),
      score,
      emotion,
    };

    setState({ emotion, engagementScore: score, faceDetected });
    setHistory((prev) => {
      const cutoff = Date.now() - HISTORY_SECONDS * 1000;
      return [...prev.filter((r) => r.timestamp > cutoff), reading];
    });
  }, []);

  useEffect(() => {
    if (!demoMode) {
      setState({ emotion: "neutral", engagementScore: 70, faceDetected: false });
      return;
    }

    const runDemoCycle = () => {
      const cycleItem = DEMO_EMOTION_CYCLE[demoIndexRef.current % DEMO_EMOTION_CYCLE.length];
      const noise = (Math.random() - 0.5) * 12;
      const score = Math.max(20, Math.min(100, cycleItem.engagementBase + noise));
      addReading(cycleItem.emotion, Math.round(score), true);
    };

    runDemoCycle();

    demoTimerRef.current = setInterval(runDemoCycle, READING_INTERVAL);

    cycleTimerRef.current = setInterval(() => {
      demoIndexRef.current = (demoIndexRef.current + 1) % DEMO_EMOTION_CYCLE.length;
    }, 8000);

    return () => {
      if (demoTimerRef.current) clearInterval(demoTimerRef.current);
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, [demoMode, addReading]);

  const chartData = history.map((r, i) => ({
    time: i,
    score: r.score,
    emotion: r.emotion,
  }));

  return { state, history, chartData };
}
