import type { CollectionConfig } from 'payload'

export const Archives: CollectionConfig = {
  slug: 'archives',
  labels: { singular: 'Photo d’archive', plural: 'Photos d’archives' },
  admin: { useAsTitle: 'legende', defaultColumns: ['legende', 'ordre'], group: 'Contenu' },
  access: { read: () => true },
  defaultSort: 'ordre',
  fields: [
    { name: 'image', label: 'Photo', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Format conseillé : 1293 × 1015 px (comme la photo du magasin). Les photos sont affichées à cette taille, recadrées si besoin.' } },
    { name: 'legende', label: 'Légende', type: 'text', required: true },
    { name: 'ordre', label: 'Ordre', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Les photos arrivent de la droite dans cet ordre.' } },
  ],
}
