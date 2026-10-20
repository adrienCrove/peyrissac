// Import unique des contenus écrits en dur dans le site Vite.
// Les données et images sont lues dans src/site/data et public/images.
// Lancement : npm run seed   (ne fait rien si des familles existent déjà)
import 'dotenv/config'
import { getPayload } from 'payload'
import { readFile } from 'fs/promises'
import path from 'path'
import config from './payload.config'

const SITE = process.cwd()
const { familles, colonnes } = await import(path.join(SITE, 'src/site/data/marques.js'))
const { interviews } = await import(path.join(SITE, 'src/site/data/interviews.js'))

const payload = await getPayload({ config })

const deja = await payload.count({ collection: 'familles' })
if (deja.totalDocs > 0) {
  console.log('Des familles existent déjà, import annulé.')
  process.exit(0)
}

const image = async (fichier: string, alt: string) => {
  const chemin = path.join(SITE, 'public/images', fichier)
  const data = await readFile(chemin)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/jpeg', name: fichier, size: data.length },
  })
  return doc.id
}

// Familles : la colonne vient de la position dans `colonnes`, les colonnes de test sont ignorées.
for (const [i, col] of (colonnes as any[]).entries()) {
  for (const [j, f] of col.entries()) {
    if (!familles.includes(f)) continue
    await payload.create({
      collection: 'familles',
      data: { titre: f.titre, colonne: i + 1, ordre: j, marques: f.marques.map((nom: string) => ({ nom })) },
    })
  }
}

const portrait = await image('portrait.jpg', 'Portrait')
for (const [i, it] of (interviews as any[]).entries()) {
  await payload.create({
    collection: 'interviews',
    data: {
      nom: it.nom, slug: it.slug, pratique: it.pratique, discipline: it.discipline, specialite: it.specialite,
      annee: it.annee, publie: true, ordre: i, portrait,
      echanges: it.echanges.map((e: any) => ({ question: e.question, reponse: e.paragraphes.join('\n\n') })),
    },
  })
}

const photos = [
  ['archive-magasin.jpg', 'Ets Ch. Peyrissac et Cie, Abidjan, vitrines de nuit'],
  ['archive-pompes.jpg', 'Pompes Peyrissac, atelier'],
]
for (const [i, [fichier, legende]] of photos.entries()) {
  await payload.create({ collection: 'archives', data: { image: await image(fichier, legende), legende, ordre: i } })
}

await payload.updateGlobal({ slug: 'informations', data: {} as any })

const motDePasse = process.env.ADMIN_PASSWORD
if (motDePasse && (await payload.count({ collection: 'users' })).totalDocs === 0) {
  await payload.create({ collection: 'users', data: { email: process.env.ADMIN_EMAIL || 'admin@peyrissac.com', password: motDePasse } })
  console.log('Compte administrateur créé.')
}
console.log('Import terminé.')
process.exit(0)
