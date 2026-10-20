import type { Metadata } from 'next'
import Interviews from '@/site/pages/Interviews'

export const metadata: Metadata = { title: 'Interviews — Peyrissac' }

export default function Page() {
  return <Interviews />
}
