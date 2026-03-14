'use client'

import { Button } from '@/components/ui/button'
import { useFinancialStore } from '@/store/financialStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const currencies = [
  { code: 'GEL', symbol: '₾' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
]

export function CurrencySwitcher() {
  const { currency, setCurrency } = useFinancialStore()

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span>{currentCurrency.symbol}</span>
          <span>{currentCurrency.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code as any)}
            className="gap-2"
          >
            <span>{c.symbol}</span>
            <span>{c.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
