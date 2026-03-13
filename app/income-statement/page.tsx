// app/income-statement/page.tsx
'use client'

import { useFinancialStore } from '@/store/financialStore'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Helper component for table rows
const StatementRow = ({
  label,
  value,
  isSubtotal = false,
  isNegative = false,
  indent = false,
  margin,
}: {
  label: string
  value: number
  isSubtotal?: boolean
  isNegative?: boolean
  indent?: boolean
  margin?: { name: string; value: number }
}) => (
  <div
    className={`flex items-center justify-between border-b border-slate-100 py-3 ${
      isSubtotal ? 'font-medium text-slate-900 bg-slate-50/50 px-2 rounded-md mt-2 mb-1' : 'text-slate-600'
    } ${indent ? 'pl-6' : ''}`}
  >
    <span>{label}</span>
    <div className="flex items-center gap-4">
      {margin && (
        <span className="text-xs font-normal text-slate-400">
          [{margin.name}: {margin.value.toFixed(2)}%]
        </span>
      )}
      <span className={`font-mono text-sm ${isNegative ? 'text-rose-600' : 'text-slate-900'}`}>
        {isNegative ? `(${formatCurrency(Math.abs(value))})` : formatCurrency(value)}
      </span>
    </div>
  </div>
)

export default function IncomeStatementPage() {
  // TODO: Replace with useTranslation hook
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const { getIncomeStatement } = useFinancialStore()
  const is = getIncomeStatement()

  const grossMargin = is.revenue ? (is.grossProfit / is.revenue) * 100 : 0
  const ebitdaMargin = is.revenue ? (is.ebitda / is.revenue) * 100 : 0
  const netMargin = is.revenue ? (is.netIncome / is.revenue) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{t('income_statement')}</h1>
        <div className="flex items-center gap-2">
          {/* TODO: Period Selector Logic */}
          <Button variant="outline" className="text-slate-600 border-slate-200">{t('period_q1_2024')}</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">{t('export_to_excel')}</Button>
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
          <CardTitle className="text-lg font-medium text-slate-800">{t('company_inc_financial_summary')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <StatementRow label={t('revenue')} value={is.revenue} />
          <StatementRow label={t('cogs')} value={is.cogs} isNegative indent />
          <StatementRow
            label={t('gross_profit')}
            value={is.grossProfit}
            isSubtotal
            margin={{ name: 'GM', value: grossMargin }}
          />
          <StatementRow label={t('operating_expenses')} value={is.opex} isNegative indent />
          <StatementRow
            label={t('ebitda')}
            value={is.ebitda}
            isSubtotal
            margin={{ name: 'EBITDA %', value: ebitdaMargin }}
          />
          <StatementRow label={t('depreciation_amortization')} value={is.da} isNegative indent />
          <StatementRow label={t('ebit')} value={is.ebit} isSubtotal />
          <StatementRow label={t('interest_expense')} value={is.interest} isNegative indent />
          <StatementRow label={t('earnings_before_tax')} value={is.ebt} isSubtotal />
          <StatementRow label={t('tax')} value={is.tax} isNegative indent />
          <StatementRow
            label={t('net_income')}
            value={is.netIncome}
            isSubtotal
            margin={{ name: 'Net %', value: netMargin }}
            isNegative={is.netIncome < 0}
          />
        </CardContent>
      </Card>
    </div>
  )
}