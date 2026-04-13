interface EngagementGaugeProps {
  score: number;
  size?: number;
}

export function EngagementGauge({ score, size = 120 }: EngagementGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return "#34d399";
    if (s >= 45) return "#facc15";
    return "#f87171";
  };

  const color = getColor(clampedScore);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size / 2 + 16 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute top-0 left-0">
        <path
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
        />
      </svg>
      <div
        className="absolute text-center"
        style={{ bottom: 4, left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="text-2xl font-bold text-white leading-none" style={{ color }}>
          {clampedScore}
        </div>
        <div className="text-xs text-white/40 mt-0.5">engagement</div>
      </div>
    </div>
  );
}
