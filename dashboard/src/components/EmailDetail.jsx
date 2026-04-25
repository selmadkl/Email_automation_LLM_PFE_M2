import { X, Mail, User, Tag, Brain, CheckCircle } from "lucide-react";
import { useState } from "react";

const prioriteStyle = {
  Haute: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  Moyenne: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  Basse: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
};

const prioriteDot = {
  Haute: "bg-red-500",
  Moyenne: "bg-amber-500",
  Basse: "bg-emerald-500",
};

const conformiteStyle = {
  Conforme: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  "Non conforme": "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400",
};

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="w-36 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
        {value}
      </span>
    </div>
  );
}

export default function EmailDetail({ email, onClose, traites, onTraiter }) {
  const [confirm, setConfirm] = useState(false);

  if (!email) return null;

  const traite = traites.includes(email.id);

  function handleTraiter() {
    setConfirm(false);
    onTraiter(email.id);
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-gray-800 dark:text-white">
              Détail de l'e-mail
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${prioriteStyle[email.priorite]}`}>
              <span className={`w-2 h-2 rounded-full ${prioriteDot[email.priorite]}`} />
              Priorité {email.priorite}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${conformiteStyle[email.conformite]}`}>
              {email.conformite}
            </span>
            {traite && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-400">
                <CheckCircle size={12} />
                Traité
              </span>
            )}
          </div>

          {/* Infos */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4">
            <InfoRow label="Expéditeur" value={email.expediteur} />
            <InfoRow label="Profil" value={email.profil} />
            <InfoRow label="Sujet" value={email.sujet} />
            <InfoRow label="Catégorie" value={email.categorie.replace(/_/g, " ")} />
            <InfoRow label="Sous-catégorie" value={email.sous_categorie.replace(/_/g, " ")} />
            <InfoRow label="Date" value={email.date} />
          </div>

          {/* Corps du message */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={14} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Corps du message
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {email.corps}
              </p>
            </div>
          </div>

          {/* Résumé IA */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-indigo-500" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Résumé IA
              </span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {email.resume}
              </p>
            </div>
          </div>

          {/* Bouton traiter */}
          {!traite ? (
            <button
              onClick={() => setConfirm(true)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              Marquer comme traité
            </button>
          ) : (
            <div className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm font-semibold text-center">
              ✓ E-mail marqué comme traité
            </div>
          )}

        </div>
      </div>

      {/* Confirmation */}
      {confirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setConfirm(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">
              Confirmer l'action
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Voulez-vous marquer cet e-mail comme traité ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleTraiter}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}