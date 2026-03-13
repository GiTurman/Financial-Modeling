// app/assumptions/page.tsx
'use client'

import { useFinancialStore } from '@/store/financialStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

const AssumptionInput = ({ label, tooltip, value, onChange, unit = '', isSlider = false, min = 0, max = 100, step = 1 }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <Label className="flex items-center">
      {label}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent><p>{tooltip}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Label>
    <div className="col-span-2 flex items-center gap-2">
      {isSlider ? (
        <Slider value={value} onValueChange={(val) => onChange(val)} min={min} max={max} step={step} />
      ) : (
        <Input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
      )}
      <span className="font-mono text-sm w-16 text-right">{value.toFixed(1)}{unit}</span>
    </div>
  </div>
)

export default function AssumptionsPage() {
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const { assumptions, setAssumption } = useFinancialStore()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{t('model_assumptions')}</h1>
      </div>
      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <Tabs defaultValue="revenue">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="revenue">{t('revenue')}</TabsTrigger>
              <TabsTrigger value="costs">{t('costs')}</TabsTrigger>
              <TabsTrigger value="capex">{t('capex')}</TabsTrigger>
              <TabsTrigger value="balance_sheet">{t('balance_sheet')}</TabsTrigger>
              <TabsTrigger value="financing">{t('financing')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="pt-6 space-y-6">
              <AssumptionInput label={t('revenue_growth_rate')} tooltip={t('annual_revenue_growth')} value={assumptions.revenueGrowth} onChange={(v) => setAssumption('revenueGrowth', v)} unit="%" isSlider />
              {/* Add other revenue drivers here */}
            </TabsContent>

            <TabsContent value="costs" className="pt-6 space-y-6">
              <AssumptionInput label={t('cogs_as_percent_of_revenue')} tooltip={t('cost_of_goods_sold')} value={assumptions.cogsPercentage} onChange={(v) => setAssumption('cogsPercentage', v)} unit="%" isSlider />
              {/* Add other cost drivers here */}
            </TabsContent>

            <TabsContent value="financing" className="pt-6 space-y-6">
              <AssumptionInput label={t('tax_rate')} tooltip={t('corporate_tax_rate')} value={assumptions.taxRate} onChange={(v) => setAssumption('taxRate', v)} unit="%" isSlider max={50} />
              {/* Add other financing drivers here */}
            </TabsContent>

            {/* TODO: Add content for other tabs */}
            <TabsContent value="capex"><p className="p-6 text-center text-muted-foreground">{t('capex_drivers_coming_soon')}</p></TabsContent>
            <TabsContent value="balance_sheet"><p className="p-6 text-center text-muted-foreground">{t('balance_sheet_drivers_coming_soon')}</p></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}