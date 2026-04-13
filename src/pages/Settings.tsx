import { useState, useEffect } from "react";
import { Eye, EyeOff, Save, Camera, Mic, Volume2, CheckCircle, Key, BookOpen, Sliders } from "lucide-react";

const SUBJECTS = [
  "Machine Learning", "Mathematics", "Physics", "Chemistry", "Biology",
  "Computer Science", "History", "Literature", "Economics", "General",
];

export function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [teachingStyle, setTeachingStyle] = useState<"socratic" | "explanatory" | "quiz">("socratic");
  const [subject, setSubject] = useState("Machine Learning");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<"unknown" | "granted" | "denied">("unknown");
  const [micStatus, setMicStatus] = useState<"unknown" | "granted" | "denied">("unknown");

  useEffect(() => {
    setApiKey(localStorage.getItem("adaptiq_groq_key") || "");
    setOpenaiApiKey(localStorage.getItem("adaptiq_openai_key") || "");
    setTeachingStyle((localStorage.getItem("adaptiq_teaching_style") as "socratic" | "explanatory" | "quiz") || "socratic");
    setSubject(localStorage.getItem("adaptiq_subject") || "Machine Learning");
    setTtsEnabled(localStorage.getItem("adaptiq_tts") !== "false");

    navigator.permissions?.query({ name: "camera" as PermissionName }).then((r) => {
      setCameraStatus(r.state === "granted" ? "granted" : r.state === "denied" ? "denied" : "unknown");
    }).catch(() => setCameraStatus("unknown"));

    navigator.permissions?.query({ name: "microphone" as PermissionName }).then((r) => {
      setMicStatus(r.state === "granted" ? "granted" : r.state === "denied" ? "denied" : "unknown");
    }).catch(() => setMicStatus("unknown"));
  }, []);

  const handleSave = () => {
    localStorage.setItem("adaptiq_groq_key", apiKey);
    localStorage.setItem("adaptiq_openai_key", openaiApiKey);
    localStorage.setItem("adaptiq_teaching_style", teachingStyle);
    localStorage.setItem("adaptiq_subject", subject);
    localStorage.setItem("adaptiq_tts", ttsEnabled ? "true" : "false");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const PermissionIndicator = ({ status, label, icon: Icon }: { status: string; label: string; icon: typeof Camera }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-white/40" />
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
          status === "granted"
            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
            : status === "denied"
            ? "text-red-400 bg-red-400/10 border-red-400/20"
            : "text-white/30 bg-white/5 border-white/10"
        }`}
      >
        {status === "granted" ? "Granted" : status === "denied" ? "Denied" : "Unknown"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f13] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-white/40 text-sm">Configure your AdaptIQ experience</p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Key size={16} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Groq API Key</h2>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_... or your key"
                className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors font-mono"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-white/30 mt-2">
              Stored locally in your browser only. Required for AI chat responses.
            </p>
          </div>

          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Key size={16} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">OpenAI API Key</h2>
            </div>
            <div className="relative">
              <input
                type={showOpenAIKey ? "text" : "password"}
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-colors font-mono"
              />
              <button
                onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showOpenAIKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-white/30 mt-2">
              Stored locally in your browser only. Required for speech transcription.
            </p>
          </div>

          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sliders size={16} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Teaching Preferences</h2>
            </div>

            <div className="mb-5">
              <label className="text-xs text-white/50 uppercase tracking-wider mb-3 block">Teaching Style</label>
              <div className="grid grid-cols-3 gap-2">
                {(["socratic", "explanatory", "quiz"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setTeachingStyle(style)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium capitalize transition-all border ${
                      teachingStyle === style
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                        : "bg-white/3 text-white/50 border-white/10 hover:border-white/20 hover:text-white/70"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/25 mt-2">
                {teachingStyle === "socratic" && "Guides you to discover answers through questions"}
                {teachingStyle === "explanatory" && "Provides clear, direct explanations"}
                {teachingStyle === "quiz" && "Tests your knowledge with quizzes and challenges"}
              </p>
            </div>

            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Preferred Subject</label>
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-white/30 flex-shrink-0" />
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Volume2 size={16} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Audio & Voice</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-0.5">Text-to-Speech</p>
                <p className="text-xs text-white/30">AI responses are read aloud automatically</p>
              </div>
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${ttsEnabled ? "bg-indigo-600" : "bg-white/10"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${ttsEnabled ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera size={16} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Permissions</h2>
            </div>
            <div className="divide-y divide-white/5">
              <PermissionIndicator status={cameraStatus} label="Camera (for emotion detection)" icon={Camera} />
              <PermissionIndicator status={micStatus} label="Microphone (for voice input)" icon={Mic} />
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              saved
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
            }`}
          >
            {saved ? (
              <>
                <CheckCircle size={16} /> Settings Saved
              </>
            ) : (
              <>
                <Save size={16} /> Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
