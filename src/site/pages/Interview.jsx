"use client";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import Page, { Titre, apparition } from "../components/Page";
import { useContenu } from "../contenu";

export default function Interview() {
  const { slug } = useParams();
  const { interviews } = useContenu();
  const it = interviews.find((i) => i.slug === slug);
  const ref = useRef(null);
  const router = useRouter();
  useEffect(() => { if (!it) router.replace("/interviews"); }, [it, router]);
  if (!it) return null;
  const molette = (e) => {
    if (!ref.current || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    if (ref.current.scrollWidth <= ref.current.clientWidth) return;
    ref.current.scrollLeft += e.deltaY;
    e.preventDefault();
  };
  return (
    <Page>
      <div className="entete-espace" />
      <div className="fiche" ref={ref} onWheel={molette} style={{ margin: "3em 0" }}>
        <motion.aside className="fiche__identite cap petit" {...apparition(0.3)}>
          <dl><dt>Nom :</dt><dd>{it.nom}</dd><dt>Pratique :</dt><dd>{it.pratique}</dd></dl>
          <img src={it.photo} alt={`Portrait de ${it.nom}`} />
          <dl><dt>Discipline :</dt><dd>{it.discipline}</dd><dt>Spécialité :</dt><dd>{it.specialite}</dd></dl>
        </motion.aside>
        {it.echanges.map((e, i) => (
          <motion.article key={i} className="fiche__colonne" {...apparition(0.45 + i * 0.12)}>
            <h2 className="fiche__question cap petit" style={{ margin: 0, fontSize: "inherit" }}>{e.question}</h2>
            <div className="fiche__reponse">{e.paragraphes.map((p, j) => <p key={j}>{p}</p>)}</div>
            <p className="fiche__question cap petit" style={{ margin: 0 }} aria-hidden="true">{e.question}</p>
          </motion.article>
        ))}
      </div>
      <Titre>Interviews</Titre>
    </Page>
  );
}
