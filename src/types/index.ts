export type Emotion = "focused" | "bored" | "frustrated" | "neutral" | "looking_away";

export interface EngagementReading {
  timestamp: number;
  score: number;
  emotion: Emotion;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  emotion?: Emotion;
  timestamp: Date;
}

export interface Session {
  id: string;
  date: string;
  duration: number;
  avg_engagement: number;
  emotion_distribution: Record<string, number>;
  topic: string;
}

export interface KnowledgeDoc {
  id: string;
  filename: string;
  page_count: number;
  upload_date: string;
  status: "processing" | "ready" | "error";
  chunks_count: number;
}

export interface Settings {
  openai_api_key: string;
  teaching_style: "socratic" | "explanatory" | "quiz";
  preferred_subject: string;
  tts_enabled: boolean;
}

export interface EmotionState {
  emotion: Emotion;
  engagementScore: number;
  faceDetected: boolean;
}
