'use client'
import dynamic from 'next/dynamic'

const EmailVerification = dynamic(
  () => import('./EmailVerificationClient'),
  { ssr: false }
)

export default function Page() {
  return <EmailVerification />
}
