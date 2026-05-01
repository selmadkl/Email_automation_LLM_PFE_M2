import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import EmailsTable from "../components/EmailsTable";
import EmailDetail from "../components/EmailDetail";
import { fetchEmails } from "../services/api";
import { Search } from "lucide-react";

const FILTRES_PRIORITE  = ["Tous", "Haute", "Moyenne", "Basse"];
const FILTRES_CATEGORIE = ["Toutes", "Demande_Administrative", "Demande_Pedagogique", "Support_Technique", "Partenariat"];
const FILTRES_PROFIL    = ["Tous", "Étudiant", "Étudiante", "Enseignant", "Hiérarchie", "Institutionnel", "Externe"];

export default function EmailsPage() {
  const [emails, setEmails]               = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [total, setTotal]                 = useState(0);
  const [loading, setLoading]             = useState(false);
  const [search, setSearch]               = useState("");
  const [filtre, setFiltre]               = useState("Tous");
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [filtreProfil, setFiltreProfil]   = useState("Tous");

  const [traites, setTraites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("emails_traites")) || []; }
    catch { return []; }
  });
  const [repondus, setRepondus] = useState(() => {
    try { return JSON.parse(localStorage.getItem("emails_repondus")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    setLoading(true);
    fetchEmails().then(data => {
      if (data) { setEmails(data); setTotal(data.length); }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const checkNew = setInterval(() => {
      fetch("http://127.0.0.1:5000/api/ping")
        .then(r => r.json())
        .then(data => {
          if (data.total !== total) {
            fetchEmails().then(d => {
              if (d) { setEmails(d); setTotal(data.total); }
            });
          }
        })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(checkNew);
  }, [total]);

  function refresh() {
    setLoading(true);
    fetchEmails().then(data => {
      if (data) { setEmails(data); setTotal(data.length); }
      setLoading(false);
    });
  }

  function handleTraiter(id) {
    setTraites(prev => {
      const updated = [...prev, id];
      localStorage.setItem("emails_traites", JSON.stringify(updated));
      return updated;
    });
  }

  function handleRepondu(id) {
    setRepondus(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem("emails_repondus", JSON.stringify(updated));
      return updated;
    });
  }

  const filtered = emails.filter((email) => {
    const matchSearch    = (email.sujet || "").toLowerCase().includes(search.toLowerCase()) ||
                           (email.expediteur || "").toLowerCase().includes(search.toLowerCase());
    const matchPriorite  = filtre === "Tous" || email.priorite_finale === filtre;
    const matchCategorie = filtreCategorie === "Toutes" || email.categorie === filtreCategorie;
    const matchProfil    = filtreProfil === "Tous" || email.profil === filtreProfil;
    return matchSearch && matchPriorite && matchCategorie && matchProfil;
  });

  const selectStyle = "shrink-0 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />

      <main className="ml-0 md:ml-16 lg:ml-56 flex-1 flex flex-col overflow-hidden p-4 md:p-6 lg:p-7">

        {/* ── Header fixe ── */}
        <div className="shrink-0 space-y-4 mb-4">

          {/* Titre + bouton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">E-mails</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {filtered.length} / {total} e-mail{total !== 1 ? "s" : ""} classifiés
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 self-start sm:self-auto"
            >
              {loading ? "Chargement..." : "↻ Actualiser"}
            </button>
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par objet ou expéditeur..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <select value={filtre} onChange={(e) => setFiltre(e.target.value)} className={selectStyle}>
              {FILTRES_PRIORITE.map(f => (
                <option key={f} value={f}>{f === "Tous" ? "Toutes priorités" : f}</option>
              ))}
            </select>
            <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)} className={selectStyle}>
              {FILTRES_CATEGORIE.map(f => (
                <option key={f} value={f}>{f === "Toutes" ? "Toutes catégories" : f.replace(/_/g, " ")}</option>
              ))}
            </select>
            <select value={filtreProfil} onChange={(e) => setFiltreProfil(e.target.value)} className={selectStyle}>
              {FILTRES_PROFIL.map(f => (
                <option key={f} value={f}>{f === "Tous" ? "Tous profils" : f}</option>
              ))}
            </select>
            <span className="text-xs text-gray-400 ml-auto shrink-0">
              {filtered.length} e-mail{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ── Zone scrollable ── */}
        <div className="flex-1 overflow-y-auto">
          <EmailsTable
            emails={filtered}
            onSelect={setSelectedEmail}
            traites={traites}
          />
        </div>

      </main>

      {selectedEmail && (
        <EmailDetail
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          traites={traites}
          onTraiter={handleTraiter}
          repondus={repondus}
          onRepondu={handleRepondu}
        />
      )}
    </div>
  );
}