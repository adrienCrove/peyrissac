import { useState } from "react";
import { motion } from "motion/react";
import Page, { Titre, apparition } from "../components/Page";

const champs = [
  ["nom", "Nom", "text"],
  ["prenom", "Prénom", "text"],
  ["telephone", "Numéro de téléphone", "tel"],
  ["email", "Email", "email"],
];

export default function Listes() {
  const [cagnotte, setCagnotte] = useState("publique");
  const [photo, setPhoto] = useState(null);
  const [etat, setEtat] = useState("");

  const envoyer = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const corps = [
      `Nom : ${d.get("nom")}`, `Prénom : ${d.get("prenom")}`,
      `Téléphone : ${d.get("telephone")}`, `Email : ${d.get("email")}`,
      `Cagnotte : ${cagnotte}`,
    ].join("\n");
    window.location.href = `mailto:info.ci@peyrissac.com?subject=${encodeURIComponent("Ouverture d'une liste")}&body=${encodeURIComponent(corps)}`;
    setEtat("Votre demande est prête à l'envoi. Nous vous rappelons sous 48 h pour composer la liste ensemble.");
  };

  return (
    <Page>
      <div className="entete-espace" />
      <motion.form className="listes" onSubmit={envoyer} {...apparition(0.35)} style={{ alignSelf: "end", margin: "3em 0 clamp(40px, 6vw, 110px)" }}>
        <div>
          <p className="cap petit" style={{ margin: "0 0 1.2em", fontWeight: 500 }}>Ouvrir une liste</p>
          <div className="formulaire">
            {champs.map(([n, l, t]) => (
              <label key={n} className="champ">
                <span className="sr-only" style={{ position: "absolute", left: -9999 }}>{l}</span>
                <input name={n} type={t} placeholder={l} required autoComplete={n === "email" ? "email" : n === "telephone" ? "tel" : n === "nom" ? "family-name" : "given-name"} />
              </label>
            ))}
            <div className="champ cagnotte cap petit">
              <span className="cagnotte__libelle">Cagnotte</span>
              {["publique", "privée"].map((c) => (
                <button key={c} type="button" className="cagnotte__choix cap" aria-pressed={cagnotte === c} onClick={() => setCagnotte(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="envoyer cap petit">Envoyer</button>
          {etat && <p className="message petit" style={{ letterSpacing: "0.08em" }}>{etat}</p>}
        </div>
        <label className="photo-depot cap petit">
          {photo ? <img src={photo} alt="Photo choisie" /> : <span>Photo</span>}
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPhoto(URL.createObjectURL(f));
          }} />
        </label>
      </motion.form>
      <Titre>Listes</Titre>
    </Page>
  );
}
