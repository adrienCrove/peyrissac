import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Familles } from './collections/Familles'
import { Interviews } from './collections/Interviews'
import { Archives } from './collections/Archives'
import { Informations } from './globals/Informations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3012'

export default buildConfig({
  serverURL,
  cors: [serverURL, 'http://localhost:5173'],
  csrf: [serverURL, 'http://localhost:5173'],
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — Peyrissac' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Familles, Interviews, Archives, Media, Users],
  globals: [Informations],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' } }),
  sharp,
  plugins: [],
})
