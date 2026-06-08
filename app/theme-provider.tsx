'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    setTheme(saved)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="radar-bg min-h-screen">
        <div className="scanline" />

        {/* Theme toggle — fixed top right */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 p-2.5 rounded border font-mono text-xs flex items-center gap-2 transition-all"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--dim)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--dim)'
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={12} />
              <span>LIGHT</span>
            </>
          ) : (
            <>
              <Moon size={12} />
              <span>DARK</span>
            </>
          )}
        </button>

        {children}
      </div>
    </ThemeContext.Provider>
  )
}