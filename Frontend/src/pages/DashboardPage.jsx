import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Mail, AlertTriangle, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { fetchStats } from "../services/api";
import CategoriesChart from "../components/charts/CategoriesChart";
import PrioriteChart from "../components/charts/PrioriteChart";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(data => { if (data) setStats(data); });
    const interval = setInterval(() =>
      fetchStats().then(data => { if (data) setStats(data); }), 20000);
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
      <main className="ml-56 flex-1 p-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Vue d'ensemble des e-mails du département FGEI
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Système actif</span>
          </div>
        </div>

        {/* Cartes stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {cards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}
                className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm ${stat.shadow} hover:shadow-md transition-shadow duration-200`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex p-2.5 rounded-xl ${stat.bg}`}>
                    <Icon size={16} className={stat.color} />
                  </div>
                  <TrendingUp size={13} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-gray-400 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Graphiques */}
        {stats && (
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-4 rounded-full bg-indigo-500" />
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Répartition par catégorie
                </h2>
              </div>
              <CategoriesChart data={stats.par_categorie} />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-4 rounded-full bg-violet-500" />
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Répartition par priorité
                </h2>
              </div>
              <PrioriteChart data={stats.par_priorite} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}