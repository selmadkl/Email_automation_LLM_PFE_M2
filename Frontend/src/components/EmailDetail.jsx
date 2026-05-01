import { X, Mail, Brain, CheckCircle, Paperclip, Reply, Download, Eye } from "lucide-react";
import { useState } from "react";
import ReplyModal from "./ReplyModal";

const prioriteStyle = {
  Haute:   "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  Moyenne: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  Basse:   "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
};

const prioriteDot = {
  Haute:   "bg-red-500",
  Moyenne: "bg-amber-500",
  Basse:   "bg-emerald-500",
};

const conformiteStyle = {
  "Certifié ":              "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  "Conforme":               "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  "Identité non certifiée": "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400",
  "Non conforme":           "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400",
};

const s = (val, fallback = "—") =>
  (val || fallback).toString().replace(/_/g, " ");

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="w-36 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
        {value || "—"}
      </span>
    </div>
  );
}

export default function EmailDetail({ email, onClose, traites, onTraiter, repondus, onRepondu }) {
  // ✅ Tous les useState ici à l'intérieur du composant
  const [confirm, setConfirm]     = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  if (!email) return null;

  const priorite   = email.priorite_finale || "Basse";
  const conformite = email.conformite || "Non conforme";
  const traite     = traites.includes(email.message_id);
  const repondu = (repondus || []).includes(email.message_id);
  let pjs = [];
  try {
    pjs = email.attachments ? JSON.parse(email.attachments) : [];
  } catch (e) {
    pjs = [];
  }

  function handleTraiter() {
    setConfirm(false);
    onTraiter(email.message_id);
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
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${prioriteStyle[priorite] || prioriteStyle["Basse"]}`}>
              <span className={`w-2 h-2 rounded-full ${prioriteDot[priorite] || "bg-gray-400"}`} />
              Priorité {priorite}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${conformiteStyle[conformite] || "bg-gray-100 text-gray-500"}`}>
              {conformite}
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
            <InfoRow label="Expéditeur"     value={email.expediteur} />
            <InfoRow label="Profil"         value={s(email.profil)} />
            <InfoRow label="Sujet"          value={s(email.sujet, "Sans objet")} />
            <InfoRow label="Catégorie"      value={s(email.categorie)} />
            <InfoRow label="Sous-catégorie" value={s(email.sous_categorie)} />
            <InfoRow label="Urgence LLM"    value={email.urgence_llm || "—"} />
            <InfoRow label="Date"           value={email.date_classification?.slice(0, 10)} />
          </div>

          {/* Corps du message */}
          {email.corps && (
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
          )}

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
                {email.resume || "Aucun résumé disponible."}
              </p>
            </div>
          </div>

          {/* Pièces jointes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Paperclip size={14} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Pièces jointes {pjs.length > 0 ? `(${pjs.length})` : "(aucune)"}
              </span>
            </div>
            {pjs.length > 0 && (
              <div className="flex flex-col gap-3">
                {pjs.map((pj, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-full"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0">
                      <Paperclip size={16} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {pj.nom}
                      </span>
                      <span className="text-xs text-gray-400">
                        {pj.type?.split("/")[1]?.toUpperCase() || "fichier"}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a
                        href={`http://127.0.0.1:5000/api/attachments/view/${email.message_id}/${pj.attachment_id}/${pj.nom}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        <Eye size={13} />
                        Voir
                      </a>
                      <a
                        href={`http://127.0.0.1:5000/api/attachments/download/${email.message_id}/${pj.attachment_id}/${pj.nom}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 transition-colors"
                      >
                        <Download size={13} />
                        Télécharger
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
              <button
               onClick={() => setReplyOpen(true)}
               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors
               ${repondu
               ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-500"
               : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                }`}
            >
               <Reply size={16} />
               {repondu ? "Répondre à nouveau" : "Répondre"}
              </button>
            {repondu && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400">
               <Reply size={12} />
                Répondu
               </span>
          )}
            {!traite ? (
              <button
                onClick={() => setConfirm(true)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
              >
                Marquer comme traité
              </button>
            ) : (
              <div className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                Traité
              </div>
            )}
          </div>

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

      {/* Reply Modal */}
      {replyOpen && (
        <ReplyModal
          email={email}
          onClose={() => setReplyOpen(false)}
          onRepondu={onRepondu}
        />
      )}
    </div>
  );
}