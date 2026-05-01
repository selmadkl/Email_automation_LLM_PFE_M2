import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import EmailsTable from "../components/EmailsTable";
import EmailDetail from "../components/EmailDetail";
import { fetchEmails } from "../services/api";

export default function EmailsPage() {
  const [emails, setEmails]               = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [total, setTotal]                 = useState(0);
  const [loading, setLoading]             = useState(false);

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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />
      <main className="ml-52 flex-1 p-7">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">
              E-mails
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {total} e-mail{total !== 1 ? "s" : ""} classifiés par l'IA
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50"
          >
            {loading ? "Chargement..." : "↻ Actualiser"}
          </button>
        </div>

        <EmailsTable
          emails={emails}
          onSelect={setSelectedEmail}
          traites={traites}
        />

      </main>

      <EmailDetail
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        traites={traites}
        onTraiter={handleTraiter}
        repondus={repondus}
        onRepondu={handleRepondu}
      />
    </div>
  );
}