import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Bandeau from "../components/Bandeau";
import Page, { apparition } from "../components/Page";
import { useContenu } from "../contenu";

const CLE = "peyrissac-carte-vue";

function Carte({ onFin }) {
  return (
    <motion.section
      className="carte"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      onClick={onFin}
    >
      <div>
        <motion.h1 className="carte__marque" {...apparition(0.2)}>Peyrissac</motion.h1>
        <motion.p className="carte__ligne cap petit" {...apparition(0.7)}>
          Abidjan Plateau<br />Av. du Commerce &amp; R. Jean Millier
        </motion.p>
        <motion.div className="carte__bas cap petit" {...apparition(1.1)}>
          <span>Depuis 1911</span>
          <span>peyrissac.com</span>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function Accueil() {
  const { informations } = useContenu();
  const [carte, setCarte] = useState(() => {
    try { return !sessionStorage.getItem(CLE); } catch { return true; }
  });
  useEffect(() => {
    if (!carte) return;
    const t = setTimeout(() => setCarte(false), 3200);
    return () => clearTimeout(t);
  }, [carte]);
  useEffect(() => {
    if (!carte) { try { sessionStorage.setItem(CLE, "1"); } catch { /* vide */ } }
  }, [carte]);

  return (
    <AnimatePresence mode="wait">
      {carte ? (
        <Carte key="carte" onFin={() => setCarte(false)} />
      ) : (
        <Page key="accueil" className="page--jaune">
          <div className="entete-espace" />
          <div />
          <Bandeau texte={informations.bandeau} />
        </Page>
      )}
    </AnimatePresence>
  );
}
