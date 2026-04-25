import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { LayoutDashboard, Mail, Sun, Moon, LogOut } from "lucide-react";

const menuItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
  { label: "E-mails", icon: Mail, path: "/emails" },
];

export default function Sidebar() {
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen w-52 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between fixed left-0 top-0 z-10">

      {/* Logo */}
      <div>
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Mail size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-white">MailDept</span>
          </div>
          <p className="text-xs text-gray-400 pl-9">FGEI · UMMTO</p>
        </div>

        <div className="mx-3 border-t border-gray-100 dark:border-gray-800 mb-3" />

        {/* Menu */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bas */}
      <div className="px-3 pb-5 space-y-1">
        <button
          onClick={() => setDark(!dark)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
          {dark ? "Mode clair" : "Mode sombre"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}