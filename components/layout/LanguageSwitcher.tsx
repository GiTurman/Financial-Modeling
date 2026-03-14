'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Language } from '@/types/financial'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const nextLang = i18n.language === Language.EN ? Language.KA : Language.EN
    i18n.changeLanguage(nextLang)
    localStorage.setItem('lang', nextLang)
  }

  if (!mounted) return <Button variant="ghost" size="sm">KA</Button>

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {(i18n.language || 'ka').toUpperCase()}
    </Button>
  )
}
