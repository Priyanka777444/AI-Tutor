import type { Emotion } from "../types";

interface EmotionBadgeProps {
  emotion: Emotion;
  size?: "sm" | "md";
}

const EMOTION_CONFIG: Record<Emotion, { label: string; dot: string; bg: string; text: string }> = {
  focused: {
    label: "Focused",
    dot: "bg-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
    text: "text-emerald-400",
  },
  bored: {
    label: "Bored",
    dot: "bg-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    text: "text-yellow-400",
  },
  frustrated: {
    label: "Frustrated",
    dot: "bg-red-400",
    bg: "bg-red-400/10 border-red-400/30",
    text: "text-red-400",
  },
  neutral: {
    label: "Neutral",
    dot: "bg-gray-400",
    bg: "bg-gray-400/10 border-gray-400/30",
    text: "text-gray-400",
  },
  looking_away: {
    label: "Looking Away",
    dot: "bg-orange-400",
    bg: "bg-orange-400/10 border-orange-400/30",
    text: "text-orange-400",
  },
};

export function EmotionBadge({ emotion, size = "md" }: EmotionBadgeProps) {
  const config = EMOTION_CONFIG[emotion];

  return (
    <div
      className={`inline-flex items-center gap-1.5 border rounded-full transition-all duration-500 ${config.bg} ${
        size === "sm" ? "px-2 py-0.5" : "px-3 py-1"
      }`}
    >
      <span className={`rounded-full animate-pulse ${config.dot} ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      <span className={`font-medium ${config.text} ${size === "sm" ? "text-xs" : "text-sm"}`}>
        {config.label}
      </span>
    </div>
  );
}

export function getEmotionColor(emotion: Emotion): string {
  const colors: Record<Emotion, string> = {
    focused: "#34d399",
    bored: "#facc15",
    frustrated: "#f87171",
    neutral: "#9ca3af",
    looking_away: "#fb923c",
  };
  return colors[emotion];
}
