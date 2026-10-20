import { createContext, useContext, useEffect, useState } from "react";
import { colonnes as colonnesLocales } from "./data/marques";
import { interviews as interviewsLocales } from "./data/interviews";

// Contenu du site : lu depuis l'administration (/api, Payload CMS), avec les données
// écrites en dur comme valeur de secours tant que la réponse n'est pas arrivée ou si l'API est injoignable.
const secours = {
  colonnes: colonnesLocales,
  interviews: interviewsLocales,
  archives: [
    { src: "/images/archive-magasin1.jpg", legende: "Ets Ch. Peyrissac et Cie, Abidjan, vitrines de nuit" },
    { src: "/images/archive-pompes.jpg", legende: "Pompes Peyrissac, atelier" },
  ],
  informations: {
    horaires: "Lundi au samedi de 8h30 à 18h",
    adresse: "Abidjan Plateau\nAv. du Commerce & R. Jean Millier",
    telephone: "(227) 27 20 25 30 00",
    email: "info.ci@peyrissac.com",
    bandeau: "Une équipe . Votre maison et vous . Depuis 1911 . Abidjan Plateau",
    texteArchives: "Plus d'un siècle de commerce à Abidjan.\nLes archives s'enrichissent au fil des dons et des retrouvailles.",
  },
};

const api = async (chemin) => {
  const r = await fetch(`/api/${chemin}`, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`${chemin} : ${r.status}`);
  return r.json();
};
const url = (media) => (media && typeof media === "object" ? media.sizes?.grande?.url || media.url : null);
const paragraphes = (t) => String(t || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

async function charger() {
  const [familles, interviews, archives, informations] = await Promise.all([
    api("familles?limit=200&sort=ordre&depth=0"),
    api("interviews?limit=200&sort=ordre&depth=1"),
    api("archives?limit=100&sort=ordre&depth=1"),
    api("globals/informations"),
  ]);
  const colonnes = [];
  for (const f of familles.docs) {
    const i = Math.max(0, (f.colonne || 1) - 1);
    (colonnes[i] ||= []).push({ titre: f.titre, marques: (f.marques || []).map((m) => m.nom) });
  }
  return {
    colonnes: colonnes.filter(Boolean),
    interviews: interviews.docs.map((it) => ({
      slug: it.slug, nom: it.nom, pratique: it.pratique, discipline: it.discipline, specialite: it.specialite, annee: it.annee,
      photo: url(it.portrait) || "/images/portrait.jpg",
      echanges: (it.echanges || []).map((e) => ({ question: e.question, paragraphes: paragraphes(e.reponse) })),
    })),
    archives: archives.docs
      .filter((a) => a.image && typeof a.image === "object")
      .map((a) => ({ src: url(a.image), legende: a.legende })),
    informations: { ...secours.informations, ...informations },
  };
}

const Contexte = createContext(secours);

export function ContenuProvider({ children }) {
  const [contenu, setContenu] = useState(secours);
  useEffect(() => {
    charger().then(setContenu).catch((e) => console.warn("Contenu de secours utilisé :", e.message));
  }, []);
  return <Contexte.Provider value={contenu}>{children}</Contexte.Provider>;
}

export const useContenu = () => useContext(Contexte);
