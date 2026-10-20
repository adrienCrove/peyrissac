import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: { group: 'Médias' },
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [{ name: 'grande', width: 2400, withoutEnlargement: true }],
  },
  fields: [{ name: 'alt', label: 'Texte alternatif', type: 'text', required: true }],
}
