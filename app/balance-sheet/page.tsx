// app/balance-sheet/page.tsx
'use client'

import { useFinancialStore } from '@/store/financialStore'
import { formatCurrency, cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// Helper component for balance sheet rows
const BalanceSheetRow = ({
  label,
  value,
  isTotal = false,
  indent = false,
  className,
}: {
  label: string
  value: number
  isTotal?: boolean
  indent?: boolean
  className?: string
}) => (
  <div
    className={cn(`flex justify-between py-2 ${
      isTotal ? 'border-t font-semibold' : ''
    } ${indent ? 'pl-4' : ''}`, className)}
  >
    <span>{label}</span>
    <span className="font-mono">{formatCurrency(value)}</span>
  </div>
)

const assetData = [
  { name: 'Cash', value: 400 },
  { name: 'A/R', value: 300 },
  { name: 'Inventory', value: 300 },
  { name: 'PPE', value: 200 },
]
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function BalanceSheetPage() {
  // TODO: Replace with useTranslation hook
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const { getBalanceSheet } = useFinancialStore()
  const bs = getBalanceSheet()
  const isBalanced = Math.abs(bs.balanceCheck) < 0.01

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{t('balance_sheet')}</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="grid grid-cols-1 gap-x-12 gap-y-8 p-8 md:grid-cols-2">
              {/* ASSETS */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('assets')}</h3>
                <BalanceSheetRow label={t('cash_equivalents')} value={bs.cash} indent />
                <BalanceSheetRow label={t('accounts_receivable')} value={bs.accountsReceivable} indent />
                <BalanceSheetRow label={t('inventory')} value={bs.inventory} indent />
                <BalanceSheetRow label={t('total_current_assets')} value={bs.totalCurrentAssets} isTotal />
                
                <BalanceSheetRow label={t('property_plant_equipment')} value={bs.propertyPlantEquipment} indent className="pt-4" />
                <BalanceSheetRow label={t('total_non_current_assets')} value={0} isTotal />
                
                <div className="flex justify-between border-t border-slate-300 pt-3 mt-4 font-medium text-lg text-slate-900">
                  <span>{t('total_assets')}</span>
                  <span className="font-mono">{formatCurrency(bs.totalAssets)}</span>
                </div>
              </div>

              {/* LIABILITIES & EQUITY */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('liabilities')}</h3>
                <BalanceSheetRow label={t('accounts_payable')} value={bs.accountsPayable} indent />
                <BalanceSheetRow label={t('short_term_debt')} value={bs.shortTermDebt} indent />
                <BalanceSheetRow label={t('total_current_liabilities')} value={bs.totalCurrentLiabilities} isTotal />
                
                <BalanceSheetRow label={t('long_term_debt')} value={bs.longTermDebt} indent className="pt-4" />
                <BalanceSheetRow label={t('total_non_current_liabilities')} value={bs.longTermDebt} isTotal />

                <h3 className="text-lg font-semibold pt-4">{t('equity')}</h3>
                <BalanceSheetRow label={t('common_stock')} value={bs.commonStock} indent />
                <BalanceSheetRow label={t('retained_earnings')} value={bs.retainedEarnings} indent />
                <BalanceSheetRow label={t('total_equity')} value={bs.totalEquity} isTotal />

                <div className="flex justify-between border-t border-slate-300 pt-3 mt-4 font-medium text-lg text-slate-900">
                  <span>{t('total_liabilities_equity')}</span>
                  <span className="font-mono">{formatCurrency(bs.totalLiabilities + bs.totalEquity)}</span>
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
                  <XCircle className="mr-2 h-5 w-5" /> {t('out_of_balance_by')} {formatCurrency(bs.balanceCheck)}
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
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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