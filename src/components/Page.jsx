import { useEffect, useRef } from "react";
import { motion } from "motion/react";

const variantes = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.35, ease: "easeIn" } },
};

export default function Page({ className = "", children }) {
  return (
    <motion.main className={`page ${className}`} variants={variantes} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.main>
  );
}

export const apparition = (delai = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: delai, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
});

export function Titre({ children, delai = 0.3, long = false }) {
  return (
    <motion.h1 className={`titre-page pied${long ? " titre-page--long" : ""}`} {...apparition(delai)}>
      {children}
    </motion.h1>
  );
}

// Zone qui défile horizontalement, en entrant par la droite (molette verticale convertie).
export function Defilement({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    // Molette verticale partout sur la page -> défilement horizontal (écouteur non passif pour bloquer le défilement vertical).
    const molette = (e) => {
      if (!el || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const avant = el.scrollLeft;
      el.scrollLeft = Math.min(max, Math.max(0, avant + e.deltaY));
      if (el.scrollLeft !== avant) e.preventDefault();
    };
    const clavier = (e) => {
      if (!el || /input|textarea/i.test(e.target.tagName)) return;
      const pas = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (pas) el.scrollBy({ left: pas * el.clientWidth * 0.4, behavior: "smooth" });
    };
    window.addEventListener("wheel", molette, { passive: false });
    window.addEventListener("keydown", clavier);
    return () => { window.removeEventListener("wheel", molette); window.removeEventListener("keydown", clavier); };
  }, []);
  return (
    <div className={`defilement ${className}`} ref={ref}>
      <div className="defilement__piste">{children}</div>
    </div>
  );
}
