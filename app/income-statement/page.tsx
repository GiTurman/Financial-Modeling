// app/income-statement/page.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { useFinancialStore } from '@/store/financialStore'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { exportToXLSX } from '@/lib/export'
import { Download } from 'lucide-react'

// Helper component for table rows
const StatementRow = ({
  label,
  value,
  isSubtotal = false,
  isNegative = false,
  indent = false,
  margin,
  locale,
  currency,
}: {
  label: string
  value: number
  isSubtotal?: boolean
  isNegative?: boolean
  indent?: boolean
  margin?: { name: string; value: number }
  locale: string
  currency: string
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
        {isNegative ? `(${formatCurrency(Math.abs(value), locale, currency)})` : formatCurrency(value, locale, currency)}
      </span>
    </div>
  </div>
)

export default function IncomeStatementPage() {
  const { t, i18n } = useTranslation()

  const { getIncomeStatement, currency, selectedPeriod } = useFinancialStore()
  const is = getIncomeStatement()

  const handleExport = () => {
    const data = [
      { [t('category')]: t('revenue'), [t('amount')]: is.revenue },
      { [t('category')]: t('cogs'), [t('amount')]: -is.cogs },
      { [t('category')]: t('grossProfit'), [t('amount')]: is.grossProfit },
      { [t('category')]: t('opex'), [t('amount')]: -is.opex },
      { [t('category')]: t('ebitda'), [t('amount')]: is.ebitda },
      { [t('category')]: t('da'), [t('amount')]: -is.da },
      { [t('category')]: t('ebit'), [t('amount')]: is.ebit },
      { [t('category')]: t('interest'), [t('amount')]: -is.interest },
      { [t('category')]: t('ebt'), [t('amount')]: is.ebt },
      { [t('category')]: t('tax'), [t('amount')]: -is.tax },
      { [t('category')]: t('netIncome'), [t('amount')]: is.netIncome },
    ]
    exportToXLSX(data, `Income_Statement_${selectedPeriod}`, 'Income Statement')
  }

  const grossMargin = is.revenue ? (is.grossProfit / is.revenue) * 100 : 0
  const ebitdaMargin = is.revenue ? (is.ebitda / is.revenue) * 100 : 0
  const netMargin = is.revenue ? (is.netIncome / is.revenue) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{t('incomeStatement')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-slate-600 border-slate-200">{selectedPeriod}</Button>
          <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download className="mr-2 h-4 w-4" />
            {t('export_xlsx')}
          </Button>
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
          <CardTitle className="text-lg font-medium text-slate-800">{t('company_inc_financial_summary')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <StatementRow label={t('revenue')} value={is.revenue} locale={i18n.language} currency={currency} />
          <StatementRow label={t('cogs')} value={is.cogs} isNegative indent locale={i18n.language} currency={currency} />
          <StatementRow
            label={t('grossProfit')}
            value={is.grossProfit}
            isSubtotal
            margin={{ name: 'GM', value: grossMargin }}
            locale={i18n.language}
            currency={currency}
          />
          <StatementRow label={t('opex')} value={is.opex} isNegative indent locale={i18n.language} currency={currency} />
          <StatementRow
            label={t('ebitda')}
            value={is.ebitda}
            isSubtotal
            margin={{ name: 'EBITDA %', value: ebitdaMargin }}
            locale={i18n.language}
            currency={currency}
          />
          <StatementRow label={t('da')} value={is.da} isNegative indent locale={i18n.language} currency={currency} />
          <StatementRow label={t('ebit')} value={is.ebit} isSubtotal locale={i18n.language} currency={currency} />
          <StatementRow label={t('interest')} value={is.interest} isNegative indent locale={i18n.language} currency={currency} />
          <StatementRow label={t('ebt')} value={is.ebt} isSubtotal locale={i18n.language} currency={currency} />
          <StatementRow label={t('tax')} value={is.tax} isNegative indent locale={i18n.language} currency={currency} />
          <StatementRow
            label={t('netIncome')}
            value={is.netIncome}
            isSubtotal
            margin={{ name: 'Net %', value: netMargin }}
            isNegative={is.netIncome < 0}
            locale={i18n.language}
            currency={currency}
          />
        </CardContent>
      </Card>
    </div>
  )
}