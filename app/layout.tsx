import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClientRadar — B2B Opportunity Intelligence',
  description: 'AI-powered client intelligence that turns their moves into your opportunities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="radar-bg min-h-screen">
        <div className="scanline" />
        {children}
      </body>
    </html>
  )
}