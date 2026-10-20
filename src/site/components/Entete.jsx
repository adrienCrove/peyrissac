"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export const liens = [
  { to: "/archives", libelle: "Archives" },
  { to: "/listes", libelle: "Listes" },
  { to: "/culture-et-commerce", libelle: "Culture et Commerce" },
  { to: "/interviews", libelle: "Interviews" },
  { to: "/informations", libelle: "Informations" },
];

export default function Entete() {
  const pathname = usePathname();
  const clair = pathname === "/archives";
  return (
    <motion.header
      className={`entete${clair ? " entete--clair" : ""}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Link href="/" className="entete__marque" aria-label="Peyrissac, accueil">Peyrissac</Link>
      <nav className="entete__nav cap petit" aria-label="Navigation principale">
        {liens.map((l, i) => (
          <motion.span
            key={l.to}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.5 }}
          >
            <Link href={l.to} aria-current={pathname.startsWith(l.to) ? "page" : undefined}>{l.libelle}</Link>
          </motion.span>
        ))}
      </nav>
      <span className="entete__annee" role="img" aria-label="1911">I9II</span>
    </motion.header>
  );
}
