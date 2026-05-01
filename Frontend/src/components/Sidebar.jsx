import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard, Mail, Sun, Moon, LogOut, Menu, X,
} from "lucide-react";

const menuItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
  { label: "E-mails",         icon: Mail,            path: "/emails" },
];

export default function Sidebar() {
  const { dark, setDark } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  /* ── classes communes ── */
  const navBtn = (active) =>
    `flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200
     ${active
       ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
       : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white"
     }`;

  /* ── contenu partagé (menu + actions) ── */
  const MenuContent = ({ collapsed = false, onNav }) => (
    <>
      {/* Logo */}
      <div className={`${collapsed ? "px-3 pt-5 pb-3 flex justify-center" : "px-5 pt-6 pb-4"}`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
            <img src="/logo3.png" alt="SmartMail Uni" className="w-5 h-5 object-contain" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
              <img src="/logo3.png" alt="SmartMail Uni" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800 dark:text-white tracking-tight">SmartMail Uni</span>
              <p className="text-xs text-gray-400 leading-none mt-0.5">FGEI · UMMTO</p>
            </div>
          </div>
        )}
      </div>

      <div className={`${collapsed ? "mx-2" : "mx-4"} h-px bg-gray-100 dark:bg-gray-800 mb-3`} />

      {/* Nav */}
      <nav className={`${collapsed ? "px-2" : "px-3"} space-y-1 flex-1`}>
        {menuItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.path);
          return collapsed ? (
            /* Tablette : icône seule + tooltip */
            <div key={item.path} className="relative group">
              <button
                onClick={() => { navigate(item.path); onNav?.(); }}
                className={`${navBtn(active)} w-full justify-center p-2.5`}
                aria-label={item.label}
              >
                <Icon size={18} />
              </button>
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2
                bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5
                opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </span>
            </div>
          ) : (
            /* Desktop / Drawer : icône + label */
            <button
              key={item.path}
              onClick={() => { navigate(item.path); onNav?.(); }}
              className={`${navBtn(active)} w-full px-3.5 py-2.5`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bas */}
      <div className={`${collapsed ? "px-2" : "px-3"} pb-5 space-y-1`}>
        <div className={`${collapsed ? "mx-1" : "mx-1"} h-px bg-gray-100 dark:bg-gray-800 mb-3`} />

        {collapsed ? (
          /* Tablette : icônes seules */
          <>
            <div className="relative group">
              <button
                onClick={() => setDark(!dark)}
                className={`${navBtn(false)} w-full justify-center p-2.5`}
                aria-label={dark ? "Mode clair" : "Mode sombre"}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2
                bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5
                opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                {dark ? "Mode clair" : "Mode sombre"}
              </span>
            </div>
            <div className="relative group">
              <button
                onClick={() => navigate("/login")}
                className="w-full flex justify-center p-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                aria-label="Déconnexion"
              >
                <LogOut size={18} />
              </button>
              <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2
                bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5
                opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Déconnexion
              </span>
            </div>
          </>
        ) : (
          /* Desktop / Drawer : boutons complets */
          <>
            <button
              onClick={() => setDark(!dark)}
              className={`${navBtn(false)} w-full px-3.5 py-2.5`}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              {dark ? "Mode clair" : "Mode sombre"}
            </button>
            <button
              onClick={() => { navigate("/login"); onNav?.(); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP lg+ : sidebar fixe complète
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex h-screen w-56 flex-col fixed left-0 top-0 z-10
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
        <MenuContent collapsed={false} />
      </div>

      {/* ══════════════════════════════════════
          TABLETTE md : sidebar icônes seules
      ══════════════════════════════════════ */}
      <div className="hidden md:flex lg:hidden h-screen w-16 flex-col fixed left-0 top-0 z-10
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
        <MenuContent collapsed={true} />
      </div>

      {/* ══════════════════════════════════════
          MOBILE < md : bottom nav bar
      ══════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40
        bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800
        flex items-center justify-around px-2 py-2 safe-b">

        {/* Bouton hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label="Menu"
        >
          <Menu size={20} />
          <span className="text-[10px]">Menu</span>
        </button>

        {/* Liens directs */}
        {menuItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                ${active ? "text-indigo-600" : "text-gray-500 dark:text-gray-400"}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Thème */}
        <button
          onClick={() => setDark(!dark)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label="Thème"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-[10px]">Thème</span>
        </button>
      </div>

      {/* ══════════════════════════════════════
          MOBILE : Drawer (slide-in)
      ══════════════════════════════════════ */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panneau */}
          <div className="relative w-64 h-full flex flex-col
            bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
            animate-slide-in">
            {/* Bouton fermer */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
            <MenuContent collapsed={false} onNav={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
  {/* Dans ton App.jsx / layout wrapper */}

}