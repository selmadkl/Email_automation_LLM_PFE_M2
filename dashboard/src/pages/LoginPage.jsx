import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Mail, Lock, LogIn } from "lucide-react";

const MOCK_USER = {
  email: "chef.departement@fgei.ummto.dz",
  password: "admin123",
};

export default function LoginPage() {
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email.trim() === MOCK_USER.email && password === MOCK_USER.password) {
        navigate("/dashboard");
      } else {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

      {/* Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow text-gray-500 dark:text-gray-300 hover:scale-110 transition-transform"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {/* Centre */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg mb-4">
              <Mail size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Gestion des E-mails
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Département FGEI · UMMTO
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-7">
            <form onSubmit={handleLogin} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@fgei.ummto.dz"
                    required
                    className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors duration-200 mt-2"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <LogIn size={15} />
                    Se connecter
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}