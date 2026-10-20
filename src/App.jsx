import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Entete from "./components/Entete";
import { ContenuProvider } from "./contenu";
import Accueil from "./pages/Accueil";
import Archives from "./pages/Archives";
import Listes from "./pages/Listes";
import Culture from "./pages/Culture";
import Interviews from "./pages/Interviews";
import Interview from "./pages/Interview";
import Informations from "./pages/Informations";

const titres = {
  "/": "Peyrissac — depuis 1911",
  "/archives": "Archives — Peyrissac",
  "/listes": "Listes — Peyrissac",
  "/culture-et-commerce": "Culture et Commerce — Peyrissac",
  "/interviews": "Interviews — Peyrissac",
  "/informations": "Informations — Peyrissac",
};

function Pages() {
  const location = useLocation();
  useEffect(() => {
    document.title = titres[location.pathname] ?? "Peyrissac";
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Accueil />} />
        <Route path="/archives" element={<Archives />} />
        <Route path="/listes" element={<Listes />} />
        <Route path="/culture-et-commerce" element={<Culture />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/interviews/:slug" element={<Interview />} />
        <Route path="/informations" element={<Informations />} />
        <Route path="*" element={<Accueil />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ContenuProvider>
        <Entete />
        <Pages />
      </ContenuProvider>
    </BrowserRouter>
  );
}
