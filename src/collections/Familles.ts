import type { CollectionConfig } from 'payload'

// Page « Culture et commerce » : une famille = un intitulé + sa liste de marques, rangée dans une colonne.
export const Familles: CollectionConfig = {
  slug: 'familles',
  labels: { singular: 'Famille de marques', plural: 'Familles de marques' },
  admin: { useAsTitle: 'titre', defaultColumns: ['titre', 'colonne', 'ordre'], group: 'Contenu' },
  access: { read: () => true },
  defaultSort: 'ordre',
  fields: [
    { name: 'titre', label: 'Intitulé', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'colonne', label: 'Colonne', type: 'number', required: true, min: 1, max: 12, defaultValue: 1, admin: { description: 'Colonne dans laquelle la famille s’affiche (de gauche à droite).' } },
        { name: 'ordre', label: 'Ordre dans la colonne', type: 'number', required: true, defaultValue: 0 },
      ],
    },
    {
      name: 'marques',
      label: 'Marques',
      type: 'array',
      labels: { singular: 'Marque', plural: 'Marques' },
      fields: [{ name: 'nom', label: 'Nom', type: 'text', required: true }],
    },
  ],
}
