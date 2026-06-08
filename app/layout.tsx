import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from './theme-provider'

export const metadata: Metadata = {
  title: 'ClientRadar — B2B Opportunity Intelligence',
  description: 'AI-powered client intelligence that turns their moves into your opportunities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}