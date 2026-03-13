// app/scenarios/page.tsx
'use client'

import { useFinancialStore } from '@/store/financialStore'
import { ScenarioType } from '@/types/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

const scenarioConfig = {
  bear: { icon: '📉', color: 'border-red-500', title: 'Bear Case' },
  base: { icon: '⚖️', color: 'border-blue-500', title: 'Base Case' },
  bull: { icon: '📈', color: 'border-green-500', title: 'Bull Case' },
}

export default function ScenariosPage() {
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const { activeScenario, setScenario, getIncomeStatement, getCashFlow } = useFinancialStore()

  const scenarios: ScenarioType[] = ['bear', 'base', 'bull']
  const results = scenarios.map(s => ({
    scenario: s,
    incomeStatement: getIncomeStatement(s),
    cashFlow: getCashFlow(s),
  }))

  const baseResults = results.find(r => r.scenario === 'base');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{t('scenario_analysis')}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((s) => (
          <Card key={s} className={cn('border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden transition-all', activeScenario === s && `ring-2 ${scenarioConfig[s].color}`)}>
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
              <CardTitle className="flex items-center justify-between text-lg font-medium text-slate-800">
                <span>{scenarioConfig[s].icon} {scenarioConfig[s].title}</span>
                {activeScenario === s && <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{t('active')}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* TODO: Add editable multipliers here */}
              <p className="text-sm text-muted-foreground">{t('multipliers_go_here')}</p>
              <Button 
                onClick={() => setScenario(s)} 
                disabled={activeScenario === s}
                className="w-full"
              >
                {t('activate_scenario')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
          <CardTitle className="text-lg font-medium text-slate-800">{t('scenario_comparison')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('metric')}</TableHead>
                {results.map(r => <TableHead key={r.scenario} className="text-right">{scenarioConfig[r.scenario].title}</TableHead>)}
                <TableHead className="text-right">{t('variance_bull_vs_base')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { label: t('revenue'), key: 'revenue', source: 'incomeStatement' },
                { label: t('net_income'), key: 'netIncome', source: 'incomeStatement' },
                { label: t('free_cash_flow'), key: 'operatingCF', source: 'cashFlow' }, // Simplified FCF
              ].map(metric => {
                const baseValue = baseResults[metric.source][metric.key];
                const bullValue = results.find(r => r.scenario === 'bull')[metric.source][metric.key];
                const variance = baseValue !== 0 ? ((bullValue - baseValue) / Math.abs(baseValue)) * 100 : 0;
                
                return (
                  <TableRow key={metric.key}>
                    <TableCell className="font-medium">{metric.label}</TableCell>
                    {results.map(r => (
                      <TableCell key={r.scenario} className="text-right font-mono">
                        {formatCurrency(r[metric.source][metric.key])}
                      </TableCell>
                    ))}
                    <TableCell className={cn("text-right font-mono", variance > 0 ? 'text-green-600' : 'text-red-600')}>
                      {variance.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}