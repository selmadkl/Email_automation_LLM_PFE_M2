import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Mail, AlertTriangle, Clock, CheckCircle } from "lucide-react";
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
    { label: "Total E-mails",    value: stats.total,
      icon: Mail,          bg: "bg-indigo-50 dark:bg-indigo-900/20", color: "text-indigo-600" },
    { label: "Haute Priorité",   value: getCount(stats.par_priorite, "priorite_finale", "Haute"),
      icon: AlertTriangle, bg: "bg-red-50 dark:bg-red-900/20",       color: "text-red-500" },
    { label: "Moyenne Priorité", value: getCount(stats.par_priorite, "priorite_finale", "Moyenne"),
      icon: Clock,         bg: "bg-amber-50 dark:bg-amber-900/20",   color: "text-amber-500" },
    { label: "Basse Priorité",   value: getCount(stats.par_priorite, "priorite_finale", "Basse"),
      icon: CheckCircle,   bg: "bg-emerald-50 dark:bg-emerald-900/20", color: "text-emerald-500" },
  ] : [];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />
      <main className="ml-52 flex-1 p-7">

        <div className="mb-7">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            Tableau de bord
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Vue d'ensemble des e-mails du département
          </p>
        </div>

        {/* Cartes stats */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          {cards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}
                className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className={`inline-flex p-2 rounded-xl mb-4 ${stat.bg}`}>
                  <Icon size={17} className={stat.color} />
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Graphiques */}
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Par catégorie
              </h2>
              <CategoriesChart data={stats.par_categorie} />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Par priorité
              </h2>
              <PrioriteChart data={stats.par_priorite} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}