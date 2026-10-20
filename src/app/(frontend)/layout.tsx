import React from 'react'
import type { Metadata } from 'next'
import './styles.css'
import Entete from '@/site/components/Entete'
import { ContenuProvider } from '@/site/contenu'

export const metadata: Metadata = {
  title: 'Peyrissac — depuis 1911',
  description: 'Peyrissac, Abidjan Plateau, depuis 1911.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ContenuProvider>
          <Entete />
          {children}
        </ContenuProvider>
      </body>
    </html>
  )
}
