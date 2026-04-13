import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
import { Session } from "./pages/Session";
import { Knowledge } from "./pages/Knowledge";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { ensureAnonymousSession } from "./lib/supabase";

function AppRoutes({ demoMode, onToggleDemo }: { demoMode: boolean; onToggleDemo: () => void }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  if (isLanding) {
    return <Landing />;
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f13]">
      <Navbar demoMode={demoMode} onToggleDemo={onToggleDemo} />
      <main className="flex-1 ml-16 min-h-screen">
        <Routes>
          <Route path="/session" element={<Session demoMode={demoMode} />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    ensureAnonymousSession().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes demoMode={demoMode} onToggleDemo={() => setDemoMode((d) => !d)} />
    </BrowserRouter>
  );
}
