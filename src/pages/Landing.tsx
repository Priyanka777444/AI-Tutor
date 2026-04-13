import { Link } from "react-router-dom";
import { Brain, Eye, Mic, Database, TrendingUp, ChevronRight, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Emotion Detection",
    description: "Real-time facial analysis tracks focus, frustration, and boredom through your webcam to adapt lessons instantly.",
    color: "from-indigo-500 to-blue-500",
    glow: "shadow-indigo-500/20",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Speak naturally with your tutor using speech transcription and Groq-powered responses.",
    color: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/20",
  },
  {
    icon: Database,
    title: "RAG Knowledge Base",
    description: "Upload your PDFs and lecture notes. The AI retrieves relevant context to answer questions from your own materials.",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: TrendingUp,
    title: "Adaptive Teaching",
    description: "Engagement scores drive dynamic teaching styles — simplifying when you're stuck, energizing when you're bored.",
    color: "from-orange-500 to-amber-500",
    glow: "shadow-orange-500/20",
  },
];

const stats = [
  { value: "Llama 3", label: "AI Model", sub: "Groq" },
  { value: "500ms", label: "Detection Rate", sub: "Facial Analysis" },
  { value: "∞", label: "Knowledge Docs", sub: "Upload Limit" },
  { value: "3", label: "Teaching Modes", sub: "Adaptive" },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-violet-600/8 to-transparent rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            AdaptIQ
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/settings" className="text-sm text-white/50 hover:text-white/80 transition-colors">
            Settings
          </Link>
          <Link
            to="/session"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Sparkles size={14} />
            Start Learning
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-8">
        <div className="text-center pt-24 pb-20">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
            <Zap size={12} className="text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">Powered by GPT-4o + MediaPipe Vision</span>
          </div>

          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tight">
            Your AI Tutor That
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Actually Sees You
            </span>
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            AdaptIQ watches your engagement in real-time, detects when you're frustrated or bored,
            and dynamically adjusts how it teaches — just like a great human tutor would.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/session"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
            >
              Start Learning Free
              <ChevronRight size={20} />
            </Link>
            <Link
              to="/analytics"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium px-6 py-4 rounded-2xl text-base transition-all border border-white/10"
            >
              View Analytics
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-20">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">
                {value}
              </div>
              <div className="text-sm font-medium text-white/70">{label}</div>
              <div className="text-xs text-white/30 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Built Different</h2>
            <p className="text-white/40 text-lg">Four pillars that make AdaptIQ uniquely effective</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, description, color, glow }) => (
              <div
                key={title}
                className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg ${glow} group-hover:scale-105 transition-transform`}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Ready to learn smarter?</h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Enable your webcam, upload your study materials, and let AdaptIQ transform how you learn.
            </p>
            <Link
              to="/session"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-600/30"
            >
              Launch Session
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center py-8 text-white/20 text-sm border-t border-white/5">
        <p>AdaptIQ — Adaptive AI Tutoring &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
