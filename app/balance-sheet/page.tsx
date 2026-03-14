// app/balance-sheet/page.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { useFinancialStore } from '@/store/financialStore'
import { formatCurrency, cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Download } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import { exportToXLSX } from '@/lib/export'

// Helper component for balance sheet rows
const BalanceSheetRow = ({
  label,
  value,
  isTotal = false,
  indent = false,
  className,
  locale,
  currency,
}: {
  label: string
  value: number
  isTotal?: boolean
  indent?: boolean
  className?: string
  locale: string
  currency: string
}) => (
  <div
    className={cn(`flex justify-between py-2 ${
      isTotal ? 'border-t font-semibold' : ''
    } ${indent ? 'pl-4' : ''}`, className)}
  >
    <span>{label}</span>
    <span className="font-mono">{formatCurrency(value, locale, currency)}</span>
  </div>
)

export default function BalanceSheetPage() {
  const { t, i18n } = useTranslation()

  const { getBalanceSheet, currency, selectedPeriod } = useFinancialStore()
  const bs = getBalanceSheet()

  const handleExport = () => {
    const data = [
      { [t('category')]: t('cash'), [t('amount')]: bs.cash },
      { [t('category')]: t('accounts_receivable'), [t('amount')]: bs.accountsReceivable },
      { [t('category')]: t('inventory'), [t('amount')]: bs.inventory },
      { [t('category')]: t('total_current_assets'), [t('amount')]: bs.totalCurrentAssets },
      { [t('category')]: t('property_plant_equipment'), [t('amount')]: bs.propertyPlantEquipment },
      { [t('category')]: t('total_assets'), [t('amount')]: bs.totalAssets },
      { [t('category')]: t('accounts_payable'), [t('amount')]: bs.accountsPayable },
      { [t('category')]: t('short_term_debt'), [t('amount')]: bs.shortTermDebt },
      { [t('category')]: t('total_current_liabilities'), [t('amount')]: bs.totalCurrentLiabilities },
      { [t('category')]: t('long_term_debt'), [t('amount')]: bs.longTermDebt },
      { [t('category')]: t('total_liabilities'), [t('amount')]: bs.totalLiabilities },
      { [t('category')]: t('common_stock'), [t('amount')]: bs.commonStock },
      { [t('category')]: t('retained_earnings'), [t('amount')]: bs.retainedEarnings },
      { [t('category')]: t('total_equity'), [t('amount')]: bs.totalEquity },
      { [t('category')]: t('total_liabilities_equity'), [t('amount')]: bs.totalLiabilities + bs.totalEquity },
    ]
    exportToXLSX(data, `Balance_Sheet_${selectedPeriod}`, 'Balance Sheet')
  }

  const isBalanced = Math.abs(bs.balanceCheck) < 0.01

  const assetData = [
    { name: t('cash'), value: bs.cash },
    { name: t('accounts_receivable'), value: bs.accountsReceivable },
    { name: t('inventory'), value: bs.inventory },
    { name: t('property_plant_equipment'), value: bs.propertyPlantEquipment },
  ]
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{t('balanceSheet')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-slate-600 border-slate-200">{selectedPeriod}</Button>
          <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download className="mr-2 h-4 w-4" />
            {t('export_xlsx')}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="grid grid-cols-1 gap-x-12 gap-y-8 p-8 md:grid-cols-2">
              {/* ASSETS */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('assets')}</h3>
                <BalanceSheetRow label={t('cash_equivalents')} value={bs.cash} indent locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('accounts_receivable')} value={bs.accountsReceivable} indent locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('inventory')} value={bs.inventory} indent locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('total_current_assets')} value={bs.totalCurrentAssets} isTotal locale={i18n.language} currency={currency} />
                
                <BalanceSheetRow label={t('property_plant_equipment')} value={bs.propertyPlantEquipment} indent className="pt-4" locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('total_non_current_assets')} value={bs.propertyPlantEquipment} isTotal locale={i18n.language} currency={currency} />
                
                <div className="flex justify-between border-t border-slate-300 pt-3 mt-4 font-medium text-lg text-slate-900">
                  <span>{t('total_assets')}</span>
                  <span className="font-mono">{formatCurrency(bs.totalAssets, i18n.language, currency)}</span>
                </div>
              </div>

              {/* LIABILITIES & EQUITY */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('liabilities')}</h3>
                <BalanceSheetRow label={t('accounts_payable')} value={bs.accountsPayable} indent locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('short_term_debt')} value={bs.shortTermDebt} indent locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('total_current_liabilities')} value={bs.totalCurrentLiabilities} isTotal locale={i18n.language} currency={currency} />
                
                <BalanceSheetRow label={t('long_term_debt')} value={bs.longTermDebt} indent className="pt-4" locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('total_non_current_liabilities')} value={bs.longTermDebt} isTotal locale={i18n.language} currency={currency} />

                <h3 className="text-lg font-semibold pt-4">{t('equity')}</h3>
                <BalanceSheetRow label={t('common_stock')} value={bs.commonStock} indent locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('retained_earnings')} value={bs.retainedEarnings} indent locale={i18n.language} currency={currency} />
                <BalanceSheetRow label={t('total_equity')} value={bs.totalEquity} isTotal locale={i18n.language} currency={currency} />

                <div className="flex justify-between border-t border-slate-300 pt-3 mt-4 font-medium text-lg text-slate-900">
                  <span>{t('total_liabilities_equity')}</span>
                  <span className="font-mono">{formatCurrency(bs.totalLiabilities + bs.totalEquity, i18n.language, currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg font-medium text-slate-800">{t('balance_check')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isBalanced ? (
                <Badge variant="default" className="w-full justify-center bg-green-600 py-2 text-base hover:bg-green-700">
                  <CheckCircle2 className="mr-2 h-5 w-5" /> {t('balanced')}
                </Badge>
              ) : (
                <Badge variant="destructive" className="w-full justify-center py-2 text-base">
                  <XCircle className="mr-2 h-5 w-5" /> {t('out_of_balance_by')} {formatCurrency(bs.balanceCheck, i18n.language, currency)}
                </Badge>
              )}
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Assets = Liabilities + Equity
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg font-medium text-slate-800">{t('asset_breakdown')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={60} // This makes it a donut chart
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value), i18n.language, currency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}