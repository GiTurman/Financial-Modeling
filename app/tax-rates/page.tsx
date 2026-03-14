'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt } from 'lucide-react'

export default function TaxRatesPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-50 rounded-2xl ring-1 ring-inset ring-indigo-100">
          <Receipt className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">{t('tax_rates.title')}</h1>
          <p className="text-slate-500 mt-1">{t('tax_rates.subtitle')}</p>
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
          <CardTitle className="text-lg font-medium text-slate-800">{t('tax_rates.comparison_table_title')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-slate-600">{t('tax_rates.disclaimer')}</p>
          {/* Add table or content here */}
        </CardContent>
      </Card>
    </div>
  )
}
