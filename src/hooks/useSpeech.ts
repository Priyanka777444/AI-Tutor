import { useState, useRef, useCallback } from "react";
import { transcribeAudio } from "../lib/api";

export function useSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e.error);
        setIsRecording(false);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) { resolve(""); return; }

      recorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const transcript = await transcribeAudio(blob);
          resolve(transcript);
        } catch (err) {
          console.error("Transcription error:", err);
          resolve("");
        } finally {
          setIsTranscribing(false);
          recorder.stream.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.stop();
    });
  }, []);

  const speak = useCallback((text: string, enabled: boolean) => {
    if (!enabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { isRecording, isTranscribing, isSpeaking, startRecording, stopRecording, speak, stopSpeaking };
}
