import { Link, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, BookOpen, BarChart2, Settings, Zap } from "lucide-react";

interface NavbarProps {
  demoMode: boolean;
  onToggleDemo: () => void;
}

const navItems = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/session", label: "Session", icon: Brain },
  { path: "/knowledge", label: "Knowledge", icon: BookOpen },
  { path: "/analytics", label: "Analytics", icon: BarChart2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Navbar({ demoMode, onToggleDemo }: NavbarProps) {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-full w-16 bg-[#12121a] border-r border-white/5 flex flex-col items-center py-6 z-50">
      <Link to="/" className="mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Brain size={18} className="text-white" />
        </div>
      </Link>

      <div className="flex flex-col gap-1 flex-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} title={label}>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                  active
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-white/30 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                <span className="absolute left-14 bg-[#1e1e2e] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-xl">
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <button
        onClick={onToggleDemo}
        title={demoMode ? "Demo Mode ON" : "Demo Mode OFF"}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
          demoMode
            ? "bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/10"
            : "text-white/30 hover:text-white/60 hover:bg-white/5"
        }`}
      >
        <Zap size={16} />
      </button>
    </nav>
  );
}
