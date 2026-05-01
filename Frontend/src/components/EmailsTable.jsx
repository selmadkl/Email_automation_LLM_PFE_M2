import { useState } from "react";
import { Search, Eye } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now  = new Date();
  const diff = now - date;
  const jours = Math.floor(diff / (1000 * 60 * 60 * 24));

  const options = { weekday: "short", day: "numeric", month: "short" };
  const dateFormatee = date.toLocaleDateString("fr-FR", options);
  const heure = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  let relatif = "";
  if (jours === 0) relatif = "aujourd'hui";
  else if (jours === 1) relatif = "il y a 1 jour";
  else if (jours < 7) relatif = `il y a ${jours} jours`;
  else if (jours < 30) relatif = `il y a ${Math.floor(jours / 7)} sem.`;
  else relatif = `il y a ${Math.floor(jours / 30)} mois`;

  return { dateFormatee, heure, relatif };
}
const prioriteStyle = {
  Haute: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  Moyenne: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  Basse: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
};

const prioriteDot = {
  Haute: "bg-red-500",
  Moyenne: "bg-amber-500",
  Basse: "bg-emerald-500",
};

const FILTRES_PRIORITE  = ["Tous", "Haute", "Moyenne", "Basse"];
const FILTRES_CATEGORIE = ["Toutes", "Demande_Administrative", "Demande_Pedagogique", "Support_Technique", "Partenariat"];
const FILTRES_PROFIL    = ["Tous", "Étudiant", "Étudiante", "Enseignant", "Hiérarchie", "Institutionnel", "Externe"];

export default function EmailsTable({ emails = [], onSelect, traites = [] }) {
  const [search, setSearch]               = useState("");
  const [filtre, setFiltre]               = useState("Tous");
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [filtreProfil, setFiltreProfil]   = useState("Tous");

  const filtered = emails.filter((email) => {
    const matchSearch =
      (email.sujet || "").toLowerCase().includes(search.toLowerCase()) ||
      (email.expediteur || "").toLowerCase().includes(search.toLowerCase());
    const matchPriorite  = filtre === "Tous"    || email.priorite_finale === filtre;
    const matchCategorie = filtreCategorie === "Toutes" || email.categorie === filtreCategorie;
    const matchProfil    = filtreProfil === "Tous" || email.profil === filtreProfil;
    return matchSearch && matchPriorite && matchCategorie && matchProfil;
  });

  return (
    <div className="space-y-4">

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
      <div className="flex items-center gap-3 flex-wrap">
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
          {FILTRES_PRIORITE.map((f) => (
            <option key={f} value={f}>{f === "Tous" ? "Toutes priorités" : f}</option>
          ))}
        </select>

        <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
          {FILTRES_CATEGORIE.map((f) => (
            <option key={f} value={f}>{f === "Toutes" ? "Toutes catégories" : f.replace(/_/g, " ")}</option>
          ))}
        </select>

        <select value={filtreProfil} onChange={(e) => setFiltreProfil(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
          {FILTRES_PROFIL.map((f) => (
            <option key={f} value={f}>{f === "Tous" ? "Tous profils" : f}</option>
          ))}
        </select>

        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} e-mail{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Priorité</th>
                <th className="px-5 py-3 text-left">Expéditeur</th>
                <th className="px-5 py-3 text-left">Sujet</th>
                <th className="px-5 py-3 text-left">Catégorie</th>
                <th className="px-5 py-3 text-left">Profil</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                    Aucun e-mail trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((email) => (
                  <tr
                    key={email.message_id}
                    onClick={() => onSelect && onSelect(email)}
                    className={`cursor-pointer transition-colors group ${
                      traites.includes(email.message_id)
                        ? "bg-gray-50 dark:bg-gray-800/30 opacity-60"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${prioriteStyle[email.priorite_finale] || prioriteStyle["Basse"]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${prioriteDot[email.priorite_finale] || "bg-gray-400"}`} />
                        {email.priorite_finale}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium truncate max-w-[160px]">
                      {email.expediteur}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-200 truncate max-w-[200px]">
                      {email.sujet}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                      {(email.categorie || "").replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                      {email.profil}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {(() => {
                        const d = formatDate(email.date_classification);
                        return (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-gray-600 dark:text-gray-300 font-medium">
                              {d.dateFormatee} {d.heure}
                            </span>
                            <span className="text-gray-400 text-xs">{d.relatif}</span>
                            {traites.includes(email.message_id) && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 w-fit">
                                Traité
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-3.5">
                      <Eye size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}