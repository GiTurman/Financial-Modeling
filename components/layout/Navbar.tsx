// components/layout/Navbar.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'
import { PanelLeft } from 'lucide-react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useFinancialStore } from '@/store/financialStore'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CurrencySwitcher } from './CurrencySwitcher'
import { cn } from '@/lib/utils'

import { Sidebar } from './Sidebar'

export function Navbar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { 
    entries, 
    activeScenario, 
    selectedPeriod, 
    setSelectedPeriod,
    viewMode,
    setViewMode,
    modelDuration,
    setModelDuration
  } = useFinancialStore()

  const pageTitle = pathname.split('/').pop() || 'dashboard'
  const titleKey = `navigation.${pageTitle.replace('-', '_')}`

  const scenarioColors = {
    base: 'bg-blue-500',
    bull: 'bg-green-500',
    bear: 'bg-red-500',
  }

  // Generate periods dynamically
  const generatePeriods = () => {
    const periods: string[] = []
    const startYear = 2024
    
    for (let y = 0; y < modelDuration; y++) {
      const year = startYear + y
      if (viewMode === 'monthly') {
        for (let m = 1; m <= 12; m++) {
          periods.push(`${year}-${m.toString().padStart(2, '0')}`)
        }
      } else if (viewMode === 'quarterly') {
        for (let q = 1; q <= 4; q++) {
          periods.push(`${year}-Q${q}`)
        }
      } else {
        periods.push(`${year}-FY`)
      }
    }
    return periods
  }

  const periods = generatePeriods()

  return (
    <header className="sticky top-0 z-30 flex h-[64px] items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <h1 className="text-xl font-semibold hidden md:block">{t(titleKey)}</h1>

      <div className="flex items-center gap-4 ml-auto">
        {/* Model Duration */}
        <Select value={modelDuration.toString()} onValueChange={(v) => setModelDuration(parseInt(v))}>
          <SelectTrigger className="w-[100px] hidden lg:flex">
            <SelectValue placeholder={t('model_duration')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 {t('yearly').toLowerCase()}</SelectItem>
            <SelectItem value="3">3 {t('yearly').toLowerCase()}</SelectItem>
            <SelectItem value="5">5 {t('yearly').toLowerCase()}</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode */}
        <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <SelectTrigger className="w-[120px] hidden lg:flex">
            <SelectValue placeholder={t('view_mode')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">{t('monthly')}</SelectItem>
            <SelectItem value="quarterly">{t('quarterly')}</SelectItem>
            <SelectItem value="yearly">{t('yearly')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Period Selector */}
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('select_period')} />
          </SelectTrigger>
          <SelectContent>
            {periods.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge className={cn(scenarioColors[activeScenario], 'text-white')}>
          {activeScenario.toUpperCase()}
        </Badge>
        
        <CurrencySwitcher />
        <LanguageSwitcher />
      </div>
    </header>
  )
}