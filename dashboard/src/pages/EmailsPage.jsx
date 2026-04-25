import { useState } from "react";
import Sidebar from "../components/Sidebar";
import EmailsTable from "../components/EmailsTable";
import EmailDetail from "../components/EmailDetail";

export default function EmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [traites, setTraites] = useState([]);

  function handleTraiter(id) {
    setTraites((prev) => [...prev, id]);
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />
      <main className="ml-52 flex-1 p-7">

        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            E-mails
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Liste des e-mails classifiés par l'IA
          </p>
        </div>

        <EmailsTable
          onSelect={setSelectedEmail}
          traites={traites}
        />

      </main>

      <EmailDetail
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        traites={traites}
        onTraiter={handleTraiter}
      />
    </div>
  );
}