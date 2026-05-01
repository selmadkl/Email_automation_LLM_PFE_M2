import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Mail, AlertTriangle, Clock, CheckCircle, TrendingUp, RefreshCw } from "lucide-react";
import CategoriesChart from "../components/charts/CategoriesChart";
import PrioriteChart from "../components/charts/PrioriteChart";
import { fetchStats, fetchRecurrents } from "../services/api";



export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recurrents, setRecurrents] = useState([]);
  const [groupeOuvert, setGroupeOuvert] = useState(null);
  const [emailsGroupe, setEmailsGroupe] = useState({});

  const toggleGroupe = async (groupe) => {
    if (groupeOuvert === groupe.id) {
      setGroupeOuvert(null);
      return;
    }
    setGroupeOuvert(groupe.id);
    if (!emailsGroupe[groupe.id]) {
      const res = await fetch(`http://localhost:5000/api/recurrents/${groupe.id}/emails`);
      const data = await res.json();
      setEmailsGroupe(prev => ({ ...prev, [groupe.id]: data }));
    }
  };
  useEffect(() => {
    const load = () => {
      fetchStats().then(data => { if (data) setStats(data); });
      fetchRecurrents().then(data => { if (data) setRecurrents(data); });
    };
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  const getCount = (liste, key, val) =>
    liste?.find(x => x[key] === val)?.total ?? 0;

  const cards = stats ? [
    {
      label: "Total E-mails",
      value: stats.total,
      icon: Mail,
      gradient: "from-indigo-500 to-violet-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      color: "text-indigo-600 dark:text-indigo-400",
      shadow: "shadow-indigo-100 dark:shadow-indigo-900/20",
    },
    {
      label: "Haute Priorité",
      value: getCount(stats.par_priorite, "priorite_finale", "Haute"),
      icon: AlertTriangle,
      gradient: "from-red-500 to-rose-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      color: "text-red-500 dark:text-red-400",
      shadow: "shadow-red-100 dark:shadow-red-900/20",
    },
    {
      label: "Moyenne Priorité",
      value: getCount(stats.par_priorite, "priorite_finale", "Moyenne"),
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      color: "text-amber-500 dark:text-amber-400",
      shadow: "shadow-amber-100 dark:shadow-amber-900/20",
    },
    {
      label: "Basse Priorité",
      value: getCount(stats.par_priorite, "priorite_finale", "Basse"),
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      color: "text-emerald-500 dark:text-emerald-400",
      shadow: "shadow-emerald-100 dark:shadow-emerald-900/20",
    },
  ] : [];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />
      <main className="ml-0 md:ml-16 lg:ml-56 mb-16 md:mb-0 flex-1 p-4 md:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Vue d'ensemble des e-mails du département FGEI
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full self-start sm:self-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Système actif</span>
          </div>
        </div>

        {/* Cartes stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
          {cards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}
                className={`bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-5 border border-gray-100 dark:border-gray-800 shadow-sm ${stat.shadow} hover:shadow-md transition-shadow duration-200`}>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`inline-flex p-2 md:p-2.5 rounded-xl ${stat.bg}`}>
                    <Icon size={15} className={stat.color} />
                  </div>
                  <TrendingUp size={13} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-gray-400 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Graphiques */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4 md:mb-5">
                <div className="w-1 h-4 rounded-full bg-indigo-500" />
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Répartition par catégorie
                </h2>
              </div>
              <CategoriesChart data={stats.par_categorie} />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4 md:mb-5">
                <div className="w-1 h-4 rounded-full bg-violet-500" />
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Répartition par priorité
                </h2>
              </div>
              <PrioriteChart data={stats.par_priorite} />
            </div>
          </div>
        )}
        {/* Récurrence */}
        {recurrents.length > 0 && (
          <div className="mt-3 md:mt-5 bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 md:mb-5">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                Emails récurrents détectés
              </h2>
              <span className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                {recurrents.length} groupe{recurrents.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3">
              {recurrents.map((groupe, i) => (
                <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                  
                  {/* Ligne groupe */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/40">
                    <RefreshCw size={13} className="text-amber-500 shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-200 flex-1 font-medium line-clamp-1">
                       {groupe.tag}
                    </p>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold shrink-0">
                      ×{groupe.occurrences}
                    </span>
                    <button
                      onClick={() => setGroupeOuvert(groupeOuvert === i ? null : i)}
                      className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold shrink-0 ml-1"
                    >
                      {groupeOuvert === groupe.id ? "Masquer" : "Voir emails"}
                    </button>
                  </div>

                  {/* Emails du groupe */}
                  {groupeOuvert === groupe.id && (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                      {(emailsGroupe[groupe.id] || []).map((email, j) => (
                        <div key={j} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
                              {email.sujet || "Sans objet"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{email.expediteur}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                              ${email.priorite_finale === "Haute"
                                ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                : email.priorite_finale === "Moyenne"
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                              }`}>
                              {email.priorite_finale}
                            </span>
                            <span className="text-xs text-gray-400">
                              {email.date_classification
                                ? new Date(email.date_classification).toLocaleDateString("fr-FR", {
                                    day: "2-digit", month: "short"
                                  })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
  
}