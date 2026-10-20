import type { Metadata } from 'next'
import Informations from '@/site/pages/Informations'

export const metadata: Metadata = { title: 'Informations — Peyrissac' }

export default function Page() {
  return <Informations />
}
