"use client";
import { motion } from "motion/react";
import Page, { Titre, Defilement } from "../components/Page";
import { useContenu } from "../contenu";

export default function Culture() {
  const { colonnes } = useContenu();
  return (
    <Page>
      <div className="entete-espace" />
      <Defilement>
      <section className="marques cap petit">
        {colonnes.map((col, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {col.map((f) => (
              <div key={f.titre}>
                <h3>{f.titre}</h3>
                <ul>{f.marques.map((m) => <li key={m}>{m}</li>)}</ul>
              </div>
            ))}
          </motion.div>
        ))}
      </section>
      </Defilement>
      <Titre long>Culture et Commerce</Titre>
    </Page>
  );
}
