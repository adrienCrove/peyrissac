import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Page, { Titre, Defilement } from "../components/Page";
import { useContenu } from "../contenu";

export default function Interviews() {
  const { interviews } = useContenu();
  return (
    <Page>
      <div className="entete-espace" />
      <Defilement>
      <motion.table className="tableau cap petit" initial="initial" animate="animate">
        <colgroup><col /><col /><col /><col /><col /></colgroup>
        <thead>
          <tr><th>Prénom Nom</th><th>Pratique</th><th>Discipline</th><th>Spécialité</th><th>Year</th></tr>
        </thead>
        <tbody>
          {interviews.map((it, i) => (
            <motion.tr
              key={it.slug}
              variants={{ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.035, duration: 0.5 } } }}
            >
              <td><Link to={`/interviews/${it.slug}`}>{it.nom}</Link></td>
              <td>{it.pratique}</td><td>{it.discipline}</td><td>{it.specialite}</td><td>{it.annee}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
      </Defilement>
      <Titre>Interviews</Titre>
    </Page>
  );
}
