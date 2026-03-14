'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useFinancialStore } from '@/store/financialStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'ka', label: 'KA', flag: '🇬🇪' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const { setLanguage } = useFinancialStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    setLanguage(code as any)
    localStorage.setItem('finmodel_lang', code)
  }

  if (!mounted) return <Button variant="ghost" size="sm">KA</Button>

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span>{currentLang.flag}</span>
          <span>{currentLang.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="gap-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
