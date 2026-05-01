const BASE = "http://127.0.0.1:5000/api";

const safeFetch = (url) =>
  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .catch(err => {
      console.error("Erreur API:", url, err);
      return null;
    });
export const fetchStats       = () => safeFetch(`${BASE}/stats`);
export const fetchEmails      = () => safeFetch(`${BASE}/emails`);
export const fetchEmail       = (id) => safeFetch(`${BASE}/emails/${id}`);
export const fetchRecurrents  = () => safeFetch(`${BASE}/recurrents`);
export const fetchExpediteurs = () => safeFetch(`${BASE}/expediteurs`);