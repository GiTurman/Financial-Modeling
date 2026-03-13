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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const lang = 'en' // This would come from i18n context
  const t = (key: string) => translations[lang][key] || key

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={cn('min-h-screen w-full bg-slate-50 font-sans antialiased', inter.className)}>
        <TooltipProvider>
          <div className="flex min-h-screen w-full flex-col">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-[240px] flex-col border-r border-slate-200 bg-white sm:flex">
              <div className="flex h-16 items-center border-b border-slate-100 px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
                  <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="tracking-tight">FinModel AI</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-indigo-600"
                  >
                    <item.icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </Link>
                ))}
              </nav>
            </aside>

            <div className="flex flex-col sm:pl-[240px]">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
                {/* ... rest of the header code ... */}
              </header>
              <main className="flex-1 p-4 sm:p-6">{children}</main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  )
}