import { useState } from "react";
import { motion } from "motion/react";
import Page, { apparition } from "../components/Page";
import { useContenu } from "../contenu";

export default function Informations() {
  const [etat, setEtat] = useState("");
  const { informations: inf } = useContenu();
  const lignes = (t) => t.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>);
  const envoyer = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    window.location.href = `mailto:info.ci@peyrissac.com?subject=${encodeURIComponent("Inscription newsletter")}&body=${encodeURIComponent(`Merci d'inscrire ${email} à la newsletter.`)}`;
    setEtat("Merci, votre inscription est en route.");
  };
  return (
    <Page>
      <div className="entete-espace" />
      <div />
      <motion.section className="infos cap petit" {...apparition(0.35)}>
        <p>Horaires :<br />{lignes(inf.horaires)}</p>
        <p>Adresse :<br />{lignes(inf.adresse)}</p>
        <p>Contact :<br /><a href={`tel:${inf.telephone.replace(/[^\d+]/g, "")}`}>{inf.telephone}</a><br /><a href={`mailto:${inf.email}`}>{inf.email}</a></p>
        <form className="newsletter" onSubmit={envoyer}>
          <label htmlFor="nl" style={{ fontWeight: 500 }}>Inscription newsletter :</label>
          <input id="nl" name="email" type="email" required placeholder="Entrez votre adresse mail" className="cap petit" />
          <button type="submit" className="envoyer cap petit">Envoyer</button>
          {etat && <span className="message petit" style={{ margin: 0 }}>{etat}</span>}
        </form>
      </motion.section>
    </Page>
  );
}
