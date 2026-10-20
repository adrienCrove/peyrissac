import type { GlobalConfig } from 'payload'

export const Informations: GlobalConfig = {
  slug: 'informations',
  label: 'Informations',
  admin: { group: 'Contenu' },
  access: { read: () => true },
  fields: [
    { name: 'horaires', label: 'Horaires', type: 'text', required: true, defaultValue: 'Lundi au samedi de 8h30 à 18h' },
    { name: 'adresse', label: 'Adresse', type: 'textarea', required: true, defaultValue: 'Abidjan Plateau\nAv. du Commerce & R. Jean Millier' },
    {
      type: 'row',
      fields: [
        { name: 'telephone', label: 'Téléphone', type: 'text', required: true, defaultValue: '(227) 27 20 25 30 00' },
        { name: 'email', label: 'E-mail', type: 'email', required: true, defaultValue: 'info.ci@peyrissac.com' },
      ],
    },
    { name: 'bandeau', label: 'Bandeau défilant (accueil)', type: 'text', required: true, defaultValue: 'Une équipe . Votre maison et vous . Depuis 1911 . Abidjan Plateau' },
    { name: 'texteArchives', label: 'Texte de fin (archives)', type: 'textarea', required: true, defaultValue: "Plus d'un siècle de commerce à Abidjan.\nLes archives s'enrichissent au fil des dons et des retrouvailles." },
  ],
}
