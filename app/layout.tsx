// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import {
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  Scale,
  ArrowLeftRight,
  Settings2,
  GitBranch,
  Sparkles,
  PanelLeft,
  Receipt, // <-- Import new icon
} from 'lucide-react'

import './globals.css'
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinModel AI',
  description: 'Generate 3 Statement Financial Models with AI assistance',
}

// Mock i18n setup for demonstration
const translations = {
  en: {
    dashboard: 'Dashboard',
    data_input: 'Data Input',
    income_statement: 'Income Statement',
    balance_sheet: 'Balance Sheet',
    cash_flow: 'Cash Flow',
    assumptions: 'Assumptions',
    scenarios: 'Scenarios',
    ai_analysis: 'AI Analysis',
    tax_rates: 'Tax Rates', // <-- Add new key
  },
  ka: {
    dashboard: 'მთავარი',
    data_input: 'მონაცემების შეყვანა',
    income_statement: 'მოგება-ზარალი',
    balance_sheet: 'ბალანსი',
    cash_flow: 'ფულადი ნაკადები',
    assumptions: 'დაშვებები',
    scenarios: 'სცენარები',
    ai_analysis: 'AI ანალიზი',
    tax_rates: 'გადასახადები', // <-- Add new key
  },
  ru: {
    // ... (add russian translations)
    tax_rates: 'Налоговые ставки', // <-- Add new key
  }
}

const navItems = [
  { href: '/', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/input', labelKey: 'data_input', icon: PlusCircle },
  { href: '/income-statement', labelKey: 'income_statement', icon: TrendingUp },
  { href: '/balance-sheet', labelKey: 'balance_sheet', icon: Scale },
  { href: '/cash-flow', labelKey: 'cash_flow', icon: ArrowLeftRight },
  { href: '/assumptions', labelKey: 'assumptions', icon: Settings2 },
  { href: '/scenarios', labelKey: 'scenarios', icon: GitBranch },
  { href: '/ai-analysis', labelKey: 'ai_analysis', icon: Sparkles },
  { href: '/tax-rates', labelKey: 'tax_rates', icon: Receipt }, // <-- Add new nav item
]

import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { I18nProvider } from '@/components/I18nProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen w-full bg-muted/40 font-sans antialiased', inter.className)}>
        <I18nProvider>
          <TooltipProvider>
            <div className="flex min-h-screen w-full flex-row">
              <div className="hidden md:block">
                <Sidebar />
              </div>
              <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 p-4 sm:p-6">{children}</main>
              </div>
            </div>
          </TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  )
}