const questions = [
  "What should we be reading?",
  "What should we be listening to?",
  "What should we be collecting?",
  "What should we be cooking?",
];
const reponse = [
  "At ompl. Tampritam prorumus bonstrit, quam morum in tella re in visses? Ictus contem tatiam utus horbit, adet reni is, es! Serce co morunclarbis fic omnerum enatum tendium periptere tem inum tio.",
  "Berrovit omnis experror min ex et faccullor magnia is experem facepellabo. Esequi aut is solorem fugiatquis est ex eost, nisquia vendis et expe et poratis dest optam, veliatur, coriae dolutem veriam dus.",
];
const base = [
  ["Aissa Dione", "Tissage", "Textile", "Pagne tissé", 2024],
  ["Aboubacar Fofana", "Teinture", "Indigo", "Bogolan", 2024],
  ["Ines Bressand", "Vannerie", "Objet", "Fibres", 2023],
  ["Sarah Lavoine", "Architecture", "Intérieur", "Couleur", 2023],
  ["Mathilde Martin", "Céramique", "Arts de la table", "Grès", 2023],
  ["Lisa Corti", "Impression", "Textile", "Block print", 2022],
  ["Ryoko", "Bijou", "Objet", "Laiton", 2022],
  ["Olga etc", "Édition", "Décoration", "Papier", 2022],
  ["Cire Trudon", "Parfum", "Bougie", "Cire", 2021],
  ["Tensira", "Tissage", "Textile", "Coton", 2021],
  ["Saint d'Ici", "Sellerie", "Cuir", "Maroquinerie", 2021],
  ["Malaika Linens", "Broderie", "Linge", "Lin", 2020],
  ["Sadika", "Céramique", "Arts de la table", "Faïence", 2020],
  ["Caravane", "Décoration", "Linge", "Voyage", 2020],
  ["Serax", "Design", "Arts de la table", "Porcelaine", 2019],
  ["Giobagnara", "Maroquinerie", "Objet", "Cuir", 2019],
  ["Maison de Vacances", "Teinture", "Linge", "Lin lavé", 2019],
  ["Revol", "Céramique", "Arts de la table", "Porcelaine", 2018],
  ["Ferm Living", "Design", "Décoration", "Scandinave", 2018],
  ["Hay", "Design", "Mobilier", "Objet", 2018],
];
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const interviews = base.map(([nom, pratique, discipline, specialite, annee]) => ({
  slug: slug(nom), nom, pratique, discipline, specialite, annee,
  photo: "/images/portrait.jpg",
  echanges: questions.map((q, i) => ({ question: q, paragraphes: i % 2 ? [reponse[0], reponse[1].slice(0, 120) + ".", reponse[1]] : reponse })),
}));
