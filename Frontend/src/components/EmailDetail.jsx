import { X, Mail, Brain, CheckCircle, Paperclip, Reply, Download, Eye, ChevronDown, ChevronUp, Send, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
  Haute:   "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  Moyenne: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  Basse:   "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
};
const prioriteDot = {
  Haute: "bg-red-500", Moyenne: "bg-amber-500", Basse: "bg-emerald-500",
};
const conformiteStyle = {
  "Certifié ":              "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  "Conforme":               "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  "Identité non certifiée": "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400",
  "Non conforme":           "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400",
};

const s = (val, fallback = "—") => (val || fallback).toString().replace(/_/g, " ");

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="w-28 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 dark:text-gray-200 flex-1 break-words">{value || "—"}</span>
    </div>
  );
}

function ThreadMessage({ msg, isLast, messageId, onReplyClick }) {
  const [open, setOpen] = useState(isLast);

  const initiales = (msg.de || "?")
    .replace(/<.*?>/, "").trim()
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const couleurAvatar = msg.est_moi ? "bg-indigo-500" : "bg-emerald-500";

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all ${msg.est_moi ? "ml-2 sm:ml-4" : ""}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
      >
        <div className={`w-8 h-8 rounded-full ${couleurAvatar} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
          {initiales}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-white truncate">
              {msg.de?.replace(/<.*?>/, "").trim() || "Inconnu"}
            </span>
            <span className="text-xs text-gray-400 shrink-0">{msg.date?.slice(0, 16)}</span>
          </div>
          {!open && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {msg.corps?.slice(0, 80) || "Aucun contenu"}
            </p>
          )}
        </div>
        {open
          ? <ChevronUp size={14} className="text-gray-400 shrink-0" />
          : <ChevronDown size={14} className="text-gray-400 shrink-0" />
        }
      </button>

      {open && (
        <div className="px-3 sm:px-4 pb-4">
          <div className="h-px bg-gray-100 dark:bg-gray-700 mb-3" />
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {msg.corps || "Aucun contenu texte."}
          </p>
          {msg.pjs?.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Paperclip size={12} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Pièces jointes ({msg.pjs.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {msg.pjs.map((pj, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Paperclip size={12} className="text-indigo-500" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{pj.nom}</span>
                    <div className="flex gap-1">
                      <a href={`http://127.0.0.1:5000/api/attachments/view/${msg.id}/${pj.attachment_id}/${pj.nom}`}
                        target="_blank" rel="noreferrer"
                        className="p-1 rounded text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                        <Eye size={11} />
                      </a>
                      <a href={`http://127.0.0.1:5000/api/attachments/download/${msg.id}/${pj.attachment_id}/${pj.nom}`}
                        className="p-1 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Download size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isLast && (
            <button
              onClick={onReplyClick}
              className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 font-semibold transition-colors"
            >
              <Reply size={13} />
              Répondre
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ReplyBox({ email, onRepondu, onClose }) {
  const [corps, setCorps]     = useState("");
  const [files, setFiles]     = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");
  const fileInputRef          = useRef(null);

  async function handleSend() {
    if (!corps.trim()) return;
    setSending(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("destinataire", email.expediteur);
      formData.append("sujet",        email.sujet || "");
      formData.append("corps",        corps);
      formData.append("thread_id",    email.thread_id || "");
      files.forEach(f => formData.append("attachments", f));

      const res  = await fetch("http://127.0.0.1:5000/api/reply", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) { setSent(true); onRepondu(email.message_id); }
      else setError(data.error || "Erreur inconnue");
    } catch {
      setError("Impossible de joindre le serveur");
    }
    setSending(false);
  }

  if (sent) return (
    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
      <CheckCircle size={14} className="text-emerald-500" />
      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">Réponse envoyée !</span>
    </div>
  );

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 truncate">À : {email.expediteur}</span>
        <button onClick={onClose}><X size={13} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      <textarea
        value={corps}
        onChange={e => setCorps(e.target.value)}
        placeholder="Écrire votre réponse..."
        rows={4}
        className="w-full px-4 py-3 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 resize-none focus:outline-none"
      />
      {files.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300">
              <Paperclip size={10} />
              <span className="max-w-[100px] truncate">{f.name}</span>
              <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>
                <Trash2 size={10} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="px-4 py-1 text-xs text-red-500">{error}</p>}
      <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <button onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 font-semibold">
          <Paperclip size={13} />
          Joindre
        </button>
        <input ref={fileInputRef} type="file" multiple className="hidden"
          onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files)])} />
        <button onClick={handleSend} disabled={sending || !corps.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold">
          <Send size={12} />
          {sending ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
}

export default function EmailDetail({ email, onClose, traites, onTraiter, repondus, onRepondu }) {
  const [confirm, setConfirm]           = useState(false);
  const [replyOpen, setReplyOpen]       = useState(false);
  const [thread, setThread]             = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [visible, setVisible]           = useState(false);

  useEffect(() => {
    if (email) {
      setTimeout(() => setVisible(true), 10);
      if (email.thread_id) {
        setThreadLoading(true);
        fetch(`http://127.0.0.1:5000/api/thread/${email.thread_id}`)
          .then(r => r.json())
          .then(data => { setThread(data.messages || []); setThreadLoading(false); })
          .catch(() => setThreadLoading(false));
      }
    } else {
      setVisible(false);
    }
  }, [email]);

  if (!email) return null;

  const priorite  = email.priorite_finale || "Basse";
  const conformite = email.conformite || "Non conforme";
  const traite    = traites.includes(email.message_id);
  const repondu   = (repondus || []).includes(email.message_id);

  function handleTraiter() { setConfirm(false); onTraiter(email.message_id); }
  function handleClose() { setVisible(false); setTimeout(onClose, 300); }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Panel — plein écran sur mobile, large panel sur desktop */}
      <div className={`fixed top-0 right-0 z-50 h-full
        w-full sm:w-[calc(100vw-4rem)] lg:w-[calc(100vw-14rem)]
        bg-white dark:bg-gray-900 shadow-2xl flex flex-col
        transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={handleClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">
              <X size={16} />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                {email.sujet || "Sans objet"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{email.expediteur}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {repondu && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                <Reply size={11} /> Répondu
              </span>
            )}
            {traite && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-400">
                <CheckCircle size={11} /> Traité
              </span>
            )}
          </div>
        </div>

        {/* Contenu : 1 colonne scrollable sur mobile, 2 colonnes sur lg+ */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

          {/* ── COLONNE INFOS (gauche sur lg, section scrollable sur mobile) ── */}
          <div className="lg:w-96 lg:shrink-0 lg:border-r border-gray-100 dark:border-gray-800
            overflow-y-auto px-4 sm:px-5 py-5 space-y-5
            border-b lg:border-b-0 border-gray-100 dark:border-gray-800">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${prioriteStyle[priorite] || prioriteStyle["Basse"]}`}>
                <span className={`w-2 h-2 rounded-full ${prioriteDot[priorite] || "bg-gray-400"}`} />
                Priorité {priorite}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${conformiteStyle[conformite] || "bg-gray-100 text-gray-500"}`}>
                {conformite}
              </span>
              {/* Badges traité/répondu visibles seulement sur mobile dans cette zone */}
              {repondu && (
                <span className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                  <Reply size={11} /> Répondu
                </span>
              )}
              {traite && (
                <span className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-400">
                  <CheckCircle size={11} /> Traité
                </span>
              )}
            </div>

            {/* Infos */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4">
              <InfoRow label="Expéditeur"     value={email.expediteur} />
              <InfoRow label="Profil"         value={s(email.profil)} />
              <InfoRow label="Catégorie"      value={s(email.categorie)} />
              <InfoRow label="Sous-catégorie" value={s(email.sous_categorie)} />
              <InfoRow label="Urgence LLM"    value={email.urgence_llm || "—"} />
              <InfoRow label="Date" value={(() => {
                const d = formatDate(email.date_classification);
                return d ? `${d.dateFormatee} ${d.heure} (${d.relatif})` : "—";
              })()} />
            </div>

            {/* Résumé IA */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain size={14} className="text-indigo-500" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Résumé IA</span>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {email.resume || "Aucun résumé disponible."}
                </p>
              </div>
            </div>

            {/* Bouton Marquer traité */}
            <div className="pt-2">
              {!traite ? (
                <button onClick={() => setConfirm(true)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
                  Marquer comme traité
                </button>
              ) : (
                <div className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm font-semibold text-center flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Traité
                </div>
              )}
            </div>
          </div>

          {/* ── COLONNE CONVERSATION (droite sur lg, section en dessous sur mobile) ── */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail size={14} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Conversation {thread.length > 0 ? `(${thread.length})` : ""}
                </span>
              </div>

              {threadLoading && (
                <div className="flex items-center justify-center py-10">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!threadLoading && thread.length === 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {email.corps || "Aucun contenu."}
                  </p>
                </div>
              )}

              {!threadLoading && thread.length > 0 && (
                <div className="flex flex-col gap-3">
                  {thread.map((msg, i) => (
                    <ThreadMessage
                      key={msg.id}
                      msg={msg}
                      isLast={i === thread.length - 1}
                      messageId={email.message_id}
                      onReplyClick={() => setReplyOpen(true)}
                    />
                  ))}
                </div>
              )}
            </div>

            {replyOpen && (
              <ReplyBox email={email} onRepondu={onRepondu} onClose={() => setReplyOpen(false)} />
            )}

            {!replyOpen && (
              <button
                onClick={() => setReplyOpen(true)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors
                  ${repondu
                    ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
              >
                <Reply size={16} />
                {repondu ? "Répondre à nouveau" : "Répondre"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal confirmation */}
      {confirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4" onClick={() => setConfirm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-gray-800" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Confirmer l'action</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Voulez-vous marquer cet e-mail comme traité ? Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(false)} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Annuler</button>
              <button onClick={handleTraiter} className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}