import { CheckCircle } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const dateFormatee = date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  const heure = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return { dateFormatee, heure };
}

const prioriteStyle = {
  Haute:   "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  Moyenne: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  Basse:   "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
};

const prioriteDot = {
  Haute:   "bg-red-500",
  Moyenne: "bg-amber-500",
  Basse:   "bg-emerald-500",
};

export default function EmailsTable({ emails = [], onSelect, traites = [] }) {
  return (
    <>
      {/* ── MOBILE : cartes ── */}
      <div className="md:hidden space-y-2">
        {emails.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-5 py-10 text-center text-sm text-gray-400">
            Aucun e-mail trouvé.
          </div>
        ) : (
          emails.map((email) => {
            const d      = formatDate(email.date_classification);
            const traite = traites.includes(email.message_id);
            return (
              <div
                key={email.message_id}
                onClick={() => onSelect && onSelect(email)}
                className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-4 py-3.5 cursor-pointer transition-colors active:bg-gray-50 dark:active:bg-gray-800 ${traite ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${prioriteStyle[email.priorite_finale] || prioriteStyle["Basse"]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${prioriteDot[email.priorite_finale] || "bg-gray-400"}`} />
                    {email.priorite_finale}
                  </span>
                  <span className="text-xs text-gray-400">{d.dateFormatee} {d.heure}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{email.expediteur}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{email.sujet}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                    {(email.categorie || "").replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                    {email.profil}
                  </span>
                  {traite && (
                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded-lg">
                      Traité
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── DESKTOP : tableau ── */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-5 py-3 text-left">Priorité</th>
              <th className="px-5 py-3 text-left">Expéditeur</th>
              <th className="px-5 py-3 text-left">Sujet</th>
              <th className="px-5 py-3 text-left hidden lg:table-cell">Catégorie</th>
              <th className="px-5 py-3 text-left hidden lg:table-cell">Profil</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {emails.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                  Aucun e-mail trouvé.
                </td>
              </tr>
            ) : (
              emails.map((email) => {
                const d = formatDate(email.date_classification);
                return (
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
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs hidden lg:table-cell">
                      {(email.categorie || "").replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs hidden lg:table-cell">
                      {email.profil}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {d.dateFormatee} {d.heure}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {traites.includes(email.message_id) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                          <CheckCircle size={11} />
                          Traité
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-400">
                          En attente
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}