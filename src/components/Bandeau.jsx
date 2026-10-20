import { motion, useReducedMotion } from "motion/react";

export default function Bandeau({ texte, duree = 28 }) {
  const reduit = useReducedMotion();
  const bloc = `${texte} . `;
  return (
    <div className="bandeau pied" aria-label={texte}>
      <motion.div
        className="bandeau__piste"
        animate={reduit ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: duree, ease: "linear", repeat: Infinity }}
      >
        <span className="bandeau__texte">{bloc}{bloc}</span>
        <span className="bandeau__texte" aria-hidden="true">{bloc}{bloc}</span>
      </motion.div>
    </div>
  );
}
