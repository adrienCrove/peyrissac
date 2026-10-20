import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import { useContenu } from "../contenu";

// Toutes les photos ont la taille de archive-magasin1.jpg (1293 × 1015), à pleine hauteur d'écran.
// Au défilement, chaque photo arrive de la droite et se pose par-dessus la précédente.
const RATIO = 1293 / 1015;

// Dimensions de la fenêtre en pixels : les animations de position ont besoin de valeurs numériques.
function useFenetre() {
  const lire = () => ({ l: window.innerWidth, h: window.innerHeight });
  const [f, setF] = useState(lire);
  useEffect(() => {
    const maj = () => setF(lire());
    window.addEventListener("resize", maj);
    return () => window.removeEventListener("resize", maj);
  }, []);
  return f;
}

function Arrivee({ index, total, progress, depart, children }) {
  const debut = (index - 1) / (total - 1);
  const fin = index / (total - 1);
  const x = useTransform(progress, [debut, fin], [depart, 0], { clamp: true });
  return (
    <motion.div className="archives__arrivee" style={{ x, zIndex: index + 1 }}>
      {children}
    </motion.div>
  );
}

export default function Archives() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Légère inertie : les photos suivent la molette sans à-coups (désactivée si l'utilisateur réduit les animations).
  const lisse = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.5, restDelta: 0.0005 });
  const progress = useReducedMotion() ? scrollYProgress : lisse;
  const { archives: photos, informations } = useContenu();
  const f = useFenetre();
  const largeur = Math.min(f.h * RATIO, f.l);
  const total = photos.length + 1;

  return (
    <Page className="page--pleine">
      <div className="archives" ref={ref} style={{ height: `${total * 100}vh` }}>
        <div className="archives__scene">
          {photos.map((p, i) => {
            // La première photo reste à gauche ; les suivantes se posent en alternance à droite puis à gauche.
            const figure = (
              <figure className="archives__photo" style={{ width: largeur, [i % 2 === 0 ? "left" : "right"]: 0 }}>
                <img src={p.src} alt={p.legende} />
                <figcaption className="archives__legende cap petit">{p.legende}</figcaption>
              </figure>
            );
            return i === 0 ? (
              <motion.div key={p.src} className="archives__arrivee" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }} style={{ zIndex: 1 }}>
                {figure}
              </motion.div>
            ) : (
              <Arrivee key={p.src} index={i} total={total} progress={progress} depart={i === 1 ? Math.max(2 * largeur - f.l, 0) : f.l}>
                {figure}
              </Arrivee>
            );
          })}
          <Arrivee index={photos.length} total={total} progress={progress} depart={f.l}>
            <div className="archives__fin">
              <p className="cap petit" style={{ margin: 0, lineHeight: 1.8 }}>
                {informations.texteArchives.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}
              </p>
              <Link to="/informations" className="cap petit" style={{ textDecoration: "underline", textUnderlineOffset: "0.35em" }}>
                Nous confier un document
              </Link>
            </div>
          </Arrivee>
        </div>
      </div>
    </Page>
  );
}
