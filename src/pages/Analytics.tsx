import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { Clock, TrendingUp, Brain, Calendar } from "lucide-react";
import { MOCK_SESSIONS } from "../lib/mockData";
import type { Session } from "../types";

const EMOTION_COLORS: Record<string, string> = {
  focused: "#34d399",
  bored: "#facc15",
  frustrated: "#f87171",
  neutral: "#9ca3af",
};

const TOPIC_CLOUD = [
  { word: "Neural Networks", size: 28, color: "#6366f1" },
  { word: "Gradient Descent", size: 22, color: "#8b5cf6" },
  { word: "Backpropagation", size: 19, color: "#a78bfa" },
  { word: "Loss Function", size: 16, color: "#6366f1" },
  { word: "Overfitting", size: 20, color: "#818cf8" },
  { word: "Regularization", size: 15, color: "#7c3aed" },
  { word: "Activation Function", size: 18, color: "#6366f1" },
  { word: "Learning Rate", size: 25, color: "#8b5cf6" },
  { word: "Epoch", size: 14, color: "#a78bfa" },
  { word: "CNN", size: 17, color: "#6366f1" },
  { word: "Transformer", size: 16, color: "#818cf8" },
  { word: "Attention", size: 21, color: "#7c3aed" },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function SessionCard({ session }: { session: Session }) {
  const dominant = Object.entries(session.emotion_distribution).sort((a, b) => b[1] - a[1])[0];
  return (
    <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-white">{session.topic || "General Session"}</p>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={12} className="text-white/30" />
            <span className="text-xs text-white/40">{formatDate(session.date)}</span>
          </div>
        </div>
        <div
          className="text-lg font-black"
          style={{ color: session.avg_engagement >= 70 ? "#34d399" : session.avg_engagement >= 45 ? "#facc15" : "#f87171" }}
        >
          {session.avg_engagement}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-white/30" />
          <span className="text-xs text-white/50">{formatDuration(session.duration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Brain size={13} className="text-white/30" />
          <span className="text-xs text-white/50 capitalize">
            {dominant?.[0]} ({dominant?.[1]}%)
          </span>
        </div>
      </div>

      <div className="flex gap-1">
        {Object.entries(session.emotion_distribution).map(([emotion, pct]) => (
          <div
            key={emotion}
            className="h-1.5 rounded-full"
            style={{
              width: `${pct}%`,
              backgroundColor: EMOTION_COLORS[emotion] || "#6b7280",
            }}
            title={`${emotion}: ${pct}%`}
          />
        ))}
      </div>
    </div>
  );
}

export function Analytics() {
  const [sessions] = useState<Session[]>(MOCK_SESSIONS);

  const avgEngagement = Math.round(sessions.reduce((a, s) => a + s.avg_engagement, 0) / sessions.length);
  const totalTime = sessions.reduce((a, s) => a + s.duration, 0);

  const engagementTrend = sessions
    .slice()
    .reverse()
    .map((s, i) => ({
      session: `S${i + 1}`,
      engagement: s.avg_engagement,
      date: formatDate(s.date),
    }));

  const emotionTotals: Record<string, number> = { focused: 0, bored: 0, frustrated: 0, neutral: 0 };
  sessions.forEach((s) => {
    Object.entries(s.emotion_distribution).forEach(([k, v]) => {
      emotionTotals[k] = (emotionTotals[k] || 0) + v;
    });
  });
  const pieData = Object.entries(emotionTotals).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round(value / sessions.length),
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { date: string } }> }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#1e1e2e] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
          <p className="text-white/50 mb-1">{payload[0].payload.date}</p>
          <p className="text-white font-semibold">{payload[0].value}% engagement</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Learning Analytics</h1>
          <p className="text-white/40 text-sm">Track your progress and engagement over time</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Sessions", value: sessions.length, icon: Calendar, color: "text-indigo-400" },
            { label: "Avg Engagement", value: `${avgEngagement}%`, icon: TrendingUp, color: "text-emerald-400" },
            { label: "Total Study Time", value: formatDuration(totalTime), icon: Clock, color: "text-yellow-400" },
            { label: "Best Session", value: `${Math.max(...sessions.map((s) => s.avg_engagement))}%`, icon: Brain, color: "text-violet-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
              <Icon size={18} className={`${color} mb-3`} />
              <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
              <div className="text-xs text-white/40">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="col-span-3 bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-5">Engagement Trend</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementTrend} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="session" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ fill: "#6366f1", r: 4 }}
                    activeDot={{ r: 6, fill: "#818cf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-2 bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Emotion Distribution</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="48%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={EMOTION_COLORS[entry.name.toLowerCase()] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{value}</span>}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    contentStyle={{ background: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "white" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>

        <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Most Discussed Topics</h2>
          <div className="flex flex-wrap gap-3 items-center justify-center py-4">
            {TOPIC_CLOUD.map(({ word, size, color }) => (
              <span
                key={word}
                className="cursor-default hover:opacity-80 transition-opacity font-semibold"
                style={{ fontSize: `${size * 0.6}px`, color }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
