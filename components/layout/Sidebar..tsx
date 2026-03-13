// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, PlusCircle, TrendingUp, Scale, ArrowLeftRight,
  Settings2, GitBranch, Sparkles, Receipt, ChevronLeft, BarChart2
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/', icon: LayoutDashboard, labelKey: 'navigation.dashboard' },
  { href: '/input', icon: PlusCircle, labelKey: 'navigation.data_input' },
  { href: '/income-statement', icon: TrendingUp, labelKey: 'navigation.income_statement' },
  { href: '/balance-sheet', icon: Scale, labelKey: 'navigation.balance_sheet' },
  { href: '/cash-flow', icon: ArrowLeftRight, labelKey: 'navigation.cash_flow' },
  { href: '/assumptions', icon: Settings2, labelKey: 'navigation.assumptions' },
  { href: '/scenarios', icon: GitBranch, labelKey: 'navigation.scenarios' },
  { href: '/ai-analysis', icon: Sparkles, labelKey: 'navigation.ai_analysis' },
  { href: '/tax-rates', icon: Receipt, labelKey: 'navigation.tax_rates' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const storedState = localStorage.getItem('sidebar-collapsed')
    if (storedState) {
      setIsCollapsed(JSON.parse(storedState))
    }
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(!isCollapsed))
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 sm:flex',
        isCollapsed ? 'w-[64px]' : 'w-[240px]'
      )}
    >
      <div className="flex h-[64px] items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold overflow-hidden">
          <BarChart2 className="h-6 w-6 text-primary flex-shrink-0" />
          <span className={cn('transition-opacity', isCollapsed && 'opacity-0 w-0')}>FinModel AI</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-2 flex-grow">
        {navItems.map((item) => (
          <motion.div key={item.href} whileHover={{ x: 4 }}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname === item.href && 'bg-muted text-primary',
                isCollapsed && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={cn('transition-opacity', isCollapsed && 'opacity-0 w-0')}>{t(item.labelKey)}</span>
            </Link>
          </motion.div>
        ))}
      </nav>
      <div className="mt-auto p-2 border-t">
        <div className={cn('flex items-center justify-between p-3', isCollapsed && 'justify-center')}>
           <Badge variant="outline" className={cn(isCollapsed && 'hidden')}>v1.0.0</Badge>
           <Button variant="ghost" size="icon" onClick={toggleCollapse}>
             <ChevronLeft className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')} />
           </Button>
        </div>
      </div>
    </aside>
  )
}