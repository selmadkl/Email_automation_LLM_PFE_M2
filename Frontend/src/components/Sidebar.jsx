import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { LayoutDashboard, Mail, Sun, Moon, LogOut, Sparkles } from "lucide-react";

const menuItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
  { label: "E-mails",         icon: Mail,            path: "/emails" },
];

export default function Sidebar() {
  const { dark, setDark } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <div className="h-screen w-56 flex flex-col justify-between fixed left-0 top-0 z-10
      bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">

      {/* Logo */}
      <div>
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
              <img src="/logo3.png" alt="SmartMail Uni logo icon with gradient circle background and university branding" size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800 dark:text-white tracking-tight">SmartMail Uni</span>
              <p className="text-xs text-gray-400 leading-none mt-0.5">FGEI · UMMTO</p>
            </div>
          </div>
        </div>

        <div className="mx-4 h-px bg-gray-100 dark:bg-gray-800 mb-3" />

        {/* Menu */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon   = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white"
                  }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bas */}
      <div className="px-3 pb-5 space-y-1">
        <div className="mx-1 h-px bg-gray-100 dark:bg-gray-800 mb-3" />
        <button
          onClick={() => setDark(!dark)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-all"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? "Mode clair" : "Mode sombre"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}