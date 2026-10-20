import type { CollectionConfig } from 'payload'

const slugifier = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const Interviews: CollectionConfig = {
  slug: 'interviews',
  labels: { singular: 'Interview', plural: 'Interviews' },
  admin: { useAsTitle: 'nom', defaultColumns: ['nom', 'pratique', 'annee', 'publie'], group: 'Contenu' },
  // Le site public ne voit que les interviews publiées ; un compte connecté voit tout.
  access: { read: ({ req }) => (req.user ? true : { publie: { equals: true } }) },
  defaultSort: 'ordre',
  fields: [
    { name: 'nom', label: 'Prénom Nom', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Adresse (slug)',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Généré depuis le nom si laissé vide.' },
      hooks: { beforeValidate: [({ value, data }) => value || (data?.nom ? slugifier(data.nom) : value)] },
    },
    { name: 'publie', label: 'Publiée', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'ordre', label: 'Ordre', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      type: 'row',
      fields: [
        { name: 'pratique', label: 'Pratique', type: 'text', required: true },
        { name: 'discipline', label: 'Discipline', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'specialite', label: 'Spécialité', type: 'text', required: true },
        { name: 'annee', label: 'Année', type: 'number', required: true },
      ],
    },
    { name: 'portrait', label: 'Portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'echanges',
      label: 'Questions / réponses',
      type: 'array',
      labels: { singular: 'Échange', plural: 'Échanges' },
      fields: [
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'reponse', label: 'Réponse', type: 'textarea', required: true, admin: { description: 'Une ligne vide sépare les paragraphes.' } },
      ],
    },
  ],
}
