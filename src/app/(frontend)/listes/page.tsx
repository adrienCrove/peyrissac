import type { Metadata } from 'next'
import Listes from '@/site/pages/Listes'

export const metadata: Metadata = { title: 'Listes — Peyrissac' }

export default function Page() {
  return <Listes />
}
