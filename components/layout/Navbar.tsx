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
import { cn } from '@/lib/utils'
// import { ThemeToggle } from './ThemeToggle' // Assuming you create this component

export function Navbar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { entries, activeScenario, selectedPeriod } = useFinancialStore()

  const pageTitle = pathname.split('/').pop() || 'dashboard'
  const titleKey = `navigation.${pageTitle.replace('-', '_')}`

  const scenarioColors = {
    base: 'bg-blue-500',
    bull: 'bg-green-500',
    bear: 'bg-red-500',
  }

  return (
    <header className="sticky top-0 z-30 flex h-[64px] items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          {/* Mobile Sidebar content would be rendered here */}
        </SheetContent>
      </Sheet>

      <h1 className="text-xl font-semibold hidden md:block">{t(titleKey)}</h1>

      <div className="flex items-center gap-4 ml-auto">
        <Select defaultValue={selectedPeriod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-Q1">2024-Q1</SelectItem>
            <SelectItem value="2024-Q2">2024-Q2</SelectItem>
            <SelectItem value="2024-Q3">2024-Q3</SelectItem>
            <SelectItem value="2024-Q4">2024-Q4</SelectItem>
            <SelectItem value="2024-FY">2024-Full Year</SelectItem>
          </SelectContent>
        </Select>

        <Badge className={cn(scenarioColors[activeScenario], 'text-white')}>
          {activeScenario.toUpperCase()}
        </Badge>
        
        <span className="text-sm text-muted-foreground hidden lg:block">
          {entries.length} entries loaded
        </span>

        <LanguageSwitcher />
        {/* <ThemeToggle /> */}
      </div>
    </header>
  )
}