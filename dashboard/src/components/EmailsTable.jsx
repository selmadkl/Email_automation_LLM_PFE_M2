import { useState } from "react";
import { Search, Eye } from "lucide-react";

const MOCK_EMAILS = [
  {
    id: 1,
    expediteur: "a.benali@fgei.ummto.dz",
    sujet: "Demande de relevé de notes",
    categorie: "Demande_Administrative",
    sous_categorie: "Scolarité_Etudiant",
    profil: "Étudiant",
    conformite: "Conforme",
    priorite: "Haute",
    date: "2025-04-20",
    resume: "L'étudiant demande un relevé de notes officiel pour le semestre 2.",
    corps: "Bonjour Monsieur le Chef de Département,\n\nJe me permets de vous contacter afin de solliciter un relevé de notes officiel pour le semestre 2 de l'année universitaire 2024-2025.\n\nCe document m'est nécessaire pour ma candidature à une bourse d'excellence.\n\nDans l'attente de votre retour, je vous adresse mes sincères salutations.\n\nA. Benali",
  },
  {
    id: 2,
    expediteur: "doyen@ummto.dz",
    sujet: "Directive rentrée 2025",
    categorie: "Directives_Hiérarchie",
    sous_categorie: "Directives_Hiérarchie",
    profil: "Hiérarchie",
    conformite: "Conforme",
    priorite: "Haute",
    date: "2025-04-21",
    resume: "Le doyen transmet les directives officielles pour la rentrée 2025.",
    corps: "Monsieur le Chef de Département,\n\nJe vous fais parvenir les directives officielles concernant l'organisation de la rentrée universitaire 2025.\n\nVeuillez prendre connaissance des dispositions jointes et vous assurer de leur mise en application dans les délais impartis.\n\nCordialement,\nLe Doyen",
  },
  {
    id: 3,
    expediteur: "m.kaci@fgei.ummto.dz",
    sujet: "Problème accès plateforme Moodle",
    categorie: "Support_Technique",
    sous_categorie: "Support_Technique",
    profil: "Enseignant",
    conformite: "Conforme",
    priorite: "Haute",
    date: "2025-04-22",
    resume: "L'enseignant signale un problème d'accès à la plateforme Moodle.",
    corps: "Bonjour,\n\nDepuis hier matin, je n'arrive plus à accéder à la plateforme Moodle pour déposer mes cours du semestre.\n\nJ'ai essayé depuis plusieurs navigateurs sans succès. Pourriez-vous intervenir dans les plus brefs délais car les étudiants attendent les ressources pédagogiques.\n\nMerci,\nM. Kaci",
  },
  {
    id: 4,
    expediteur: "entreprise@gmail.com",
    sujet: "Proposition de partenariat stage",
    categorie: "Partenariat",
    sous_categorie: "Partenariat",
    profil: "Externe",
    conformite: "Non conforme",
    priorite: "Moyenne",
    date: "2025-04-22",
    resume: "Une entreprise propose un partenariat pour l'accueil de stagiaires.",
    corps: "Bonjour,\n\nNous sommes une entreprise spécialisée en développement logiciel et souhaitons établir un partenariat avec votre département pour l'accueil de stagiaires.\n\nNous pouvons offrir des stages rémunérés de 3 à 6 mois dans nos locaux.\n\nCordialement,\nService RH",
  },
  {
    id: 5,
    expediteur: "s.mammeri@fgei.ummto.dz",
    sujet: "Suivi résultats examens S2",
    categorie: "Demande_Pédagogique",
    sous_categorie: "Suivi_Examens",
    profil: "Enseignant",
    conformite: "Conforme",
    priorite: "Haute",
    date: "2025-04-23",
    resume: "Demande de suivi concernant la publication des résultats du semestre 2.",
    corps: "Monsieur le Chef de Département,\n\nJe souhaite faire le point sur la publication des résultats des examens du semestre 2.\n\nPlusieurs étudiants m'ont contacté concernant l'absence de leurs notes sur le portail universitaire. Pourriez-vous me confirmer la date prévue de publication ?\n\nCordialement,\nS. Mammeri",
  },
  {
    id: 6,
    expediteur: "b.ouali@fgei.ummto.dz",
    sujet: "Demande de congé",
    categorie: "Demande_Administrative",
    sous_categorie: "Demande_Administrative",
    profil: "Enseignant",
    conformite: "Conforme",
    priorite: "Moyenne",
    date: "2025-04-23",
    resume: "L'enseignant soumet une demande de congé pour raison personnelle.",
    corps: "Monsieur le Chef de Département,\n\nJe me permets de solliciter un congé exceptionnel de 3 jours du 28 au 30 avril 2025 pour raison familiale.\n\nJe m'engage à assurer la continuité pédagogique en coordination avec mes collègues.\n\nDans l'attente de votre accord, je vous remercie.\n\nB. Ouali",
  },
  {
    id: 7,
    expediteur: "inconnu@yahoo.fr",
    sujet: "Publicité formation en ligne",
    categorie: "Partenariat",
    sous_categorie: "Partenariat",
    profil: "Externe",
    conformite: "Non conforme",
    priorite: "Basse",
    date: "2025-04-24",
    resume: "Message publicitaire proposant une formation en ligne non sollicitée.",
    corps: "Bonjour,\n\nNous vous proposons des formations en ligne certifiantes à des tarifs exceptionnels.\n\nProfitez de notre offre de lancement : -50% sur tous nos programmes jusqu'au 30 avril.\n\nInscrivez-vous sur notre site dès maintenant !",
  },
];

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

const FILTRES_PRIORITE = ["Tous", "Haute", "Moyenne", "Basse"];
const FILTRES_CATEGORIE = ["Toutes", "Demande_Administrative", "Demande_Pédagogique", "Support_Technique", "Directives_Hiérarchie", "Partenariat"];
const FILTRES_PROFIL = ["Tous", "Étudiant", "Enseignant", "Hiérarchie", "Externe"];

export default function EmailsTable({ onSelect, traites = [] }) {
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState("Tous");
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [filtreProfil, setFiltreProfil] = useState("Tous");

  const filtered = MOCK_EMAILS.filter((email) => {
    const matchSearch =
      email.sujet.toLowerCase().includes(search.toLowerCase()) ||
      email.expediteur.toLowerCase().includes(search.toLowerCase());
    const matchPriorite = filtre === "Tous" || email.priorite === filtre;
    const matchCategorie = filtreCategorie === "Toutes" || email.categorie === filtreCategorie;
    const matchProfil = filtreProfil === "Tous" || email.profil === filtreProfil;
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
  
  {/* Priorité */}
  <select
    value={filtre}
    onChange={(e) => setFiltre(e.target.value)}
    className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    {FILTRES_PRIORITE.map((f) => (
      <option key={f} value={f}>{f === "Tous" ? "Toutes priorités" : f}</option>
    ))}
  </select>

  {/* Catégorie */}
  <select
    value={filtreCategorie}
    onChange={(e) => setFiltreCategorie(e.target.value)}
    className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    {FILTRES_CATEGORIE.map((f) => (
      <option key={f} value={f}>{f === "Toutes" ? "Toutes catégories" : f.replace(/_/g, " ")}</option>
    ))}
  </select>

  {/* Profil */}
  <select
    value={filtreProfil}
    onChange={(e) => setFiltreProfil(e.target.value)}
    className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    {FILTRES_PROFIL.map((f) => (
      <option key={f} value={f}>{f === "Tous" ? "Tous profils" : f}</option>
    ))}
  </select>

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
                     key={email.id}
                      onClick={() => onSelect && onSelect(email)}
                      className={`cursor-pointer transition-colors group ${
                        traites.includes(email.id)? "bg-gray-50 dark:bg-gray-800/30 opacity-60" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"  }`}
                    >
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${prioriteStyle[email.priorite]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${prioriteDot[email.priorite]}`} />
                        {email.priorite}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium truncate max-w-[160px]">
                      {email.expediteur}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-200 truncate max-w-[200px]">
                      {email.sujet}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                      {email.categorie.replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                      {email.profil}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                        <div className="flex items-center gap-2">
                          {email.date}
                           {traites.includes(email.id) && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            Traité
                             </span>
             )}
                         </div>
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