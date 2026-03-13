// app/cash-flow/page.tsx
'use client'

import { useFinancialStore } from '@/store/financialStore'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Helper for table rows
const CFS_Row = ({ label, value, isTotal = false, indent = 0 }: { label: string, value: number, isTotal?: boolean, indent?: number }) => (
  <div className={`flex justify-between py-2.5 border-b ${isTotal ? 'font-bold' : ''} pl-${indent * 4}`}>
    <span>{label}</span>
    <span className={`font-mono ${value < 0 ? 'text-red-600' : ''}`}>
      {value < 0 ? `(${formatCurrency(Math.abs(value))})` : formatCurrency(value)}
    </span>
  </div>
)

export default function CashFlowPage() {
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const { getCashFlow } = useFinancialStore()
  const cf = getCashFlow()

  const freeCashFlow = cf.operatingCF + cf.investingCF // Simplified: OpCF - CapEx

  const chartData = [
    { name: 'Cash Flow', Operating: cf.operatingCF, Investing: cf.investingCF, Financing: cf.financingCF },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{t('cash_flow_statement')}</h1>
        <Button variant="outline" className="text-slate-600 border-slate-200">{t('quarterly')}</Button>
      </div>

      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
          <CardTitle className="text-lg font-medium text-slate-800">{t('free_cash_flow_fcf')}</CardTitle>
          <CardDescription className="text-slate-500">{t('operating_cash_flow_capex')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-4xl font-light tracking-tight text-slate-900">{formatCurrency(freeCashFlow)}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
            <CardTitle className="text-lg font-medium text-slate-800">{t('statement_details')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Operating Activities */}
            <h3 className="text-lg font-semibold mt-4">{t('operating_activities')}</h3>
            <CFS_Row label={t('net_income')} value={cf.netIncome} indent={1} />
            <CFS_Row label={t('depreciation_amortization')} value={cf.da} indent={1} />
            <CFS_Row label={t('changes_in_working_capital')} value={cf.changeInWorkingCapital} indent={1} />
            <CFS_Row label={t('net_cash_from_operations')} value={cf.operatingCF} isTotal />

            {/* Investing Activities */}
            <h3 className="text-lg font-semibold mt-6">{t('investing_activities')}</h3>
            <CFS_Row label={t('capital_expenditures')} value={cf.capex} indent={1} />
            <CFS_Row label={t('net_cash_from_investing')} value={cf.investingCF} isTotal />

            {/* Financing Activities */}
            <h3 className="text-lg font-semibold mt-6">{t('financing_activities')}</h3>
            <CFS_Row label={t('change_in_debt')} value={cf.changeInDebt} indent={1} />
            <CFS_Row label={t('change_in_equity')} value={cf.changeInEquity} indent={1} />
            <CFS_Row label={t('net_cash_from_financing')} value={cf.financingCF} isTotal />
            
            {/* Summary */}
            <div className="mt-6 border-t-2 pt-4 space-y-3">
              <CFS_Row label={t('net_change_in_cash')} value={cf.netCashFlow} isTotal />
              <CFS_Row label={t('beginning_cash_balance')} value={cf.beginningCash} />
              <div className="flex justify-between py-2.5 border-t-2 border-double border-foreground font-extrabold text-lg">
                <span>{t('ending_cash_balance')}</span>
                <span className="font-mono">{formatCurrency(cf.endingCash)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
            <CardTitle className="text-lg font-medium text-slate-800">{t('cash_flow_waterfall')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={10} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="Operating" stackId="a" fill="#82ca9d" />
                <Bar dataKey="Investing" stackId="a" fill="#8884d8" />
                <Bar dataKey="Financing" stackId="a" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}