import { X, Paperclip, Send, Trash2, Reply } from "lucide-react";
import { useState, useRef } from "react";

export default function ReplyModal({ email, onClose, onRepondu }) {
  const [corps, setCorps]     = useState("");
  const [files, setFiles]     = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");
  const fileInputRef          = useRef(null);

  if (!email) return null;

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

      const res  = await fetch("http://127.0.0.1:5000/api/reply", {
        method: "POST",
        body:   formData,
      });
      const data = await res.json();

      if (data.success) {
        setSent(true);
        onRepondu(email.message_id);
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch (e) {
      setError("Impossible de joindre le serveur");
    }
    setSending(false);
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Reply size={16} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-gray-800 dark:text-white">
              Répondre
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Infos destinataire */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-10">À</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{email.expediteur}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-10">Sujet</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">Re: {email.sujet || "Sans objet"}</span>
            </div>
          </div>

          {/* Zone de texte */}
          {!sent ? (
            <textarea
              value={corps}
              onChange={e => setCorps(e.target.value)}
              placeholder="Écrire votre réponse..."
              rows={7}
              className="w-full px-4 py-3 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Send size={20} className="text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                Réponse envoyée avec succès !
              </p>
              <button
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Fermer
              </button>
            </div>
          )}

          {/* Pièces jointes */}
          {!sent && files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300"
                >
                  <Paperclip size={11} />
                  <span className="max-w-[140px] truncate">{f.name}</span>
                  <button onClick={() => removeFile(i)}>
                    <Trash2 size={11} className="text-red-400 hover:text-red-600 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Erreur */}
          {error && (
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          )}

          {/* Actions */}
          {!sent && (
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 font-semibold transition-colors"
              >
                <Paperclip size={14} />
                Joindre un fichier
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files)])}
              />
              <button
                onClick={handleSend}
                disabled={sending || !corps.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                <Send size={14} />
                {sending ? "Envoi en cours..." : "Envoyer"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}