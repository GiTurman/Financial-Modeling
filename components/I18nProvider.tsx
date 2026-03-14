'use client'

import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { useEffect, useState } from 'react'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
