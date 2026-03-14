'use client'

import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFinancialStore } from '@/store/financialStore'
import { GlobalSettings } from '@/types/financial'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { globalSettings, setGlobalSetting } = useFinancialStore()

  const handleSettingChange = (key: keyof GlobalSettings, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setGlobalSetting(key, numValue)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
        <p className="text-muted-foreground mt-2">
          Configure global tax rates, exchange rates, and company journal settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tax Rates (%)</CardTitle>
            <CardDescription>Set the applicable tax rates for the financial model.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vatRate">{t('vat_rate')}</Label>
              <Input
                id="vatRate"
                type="number"
                value={globalSettings.vatRate}
                onChange={(e) => handleSettingChange('vatRate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corporateTaxRate">{t('corporate_tax_rate')}</Label>
              <Input
                id="corporateTaxRate"
                type="number"
                value={globalSettings.corporateTaxRate}
                onChange={(e) => handleSettingChange('corporateTaxRate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryTaxRate">{t('salary_tax_rate')}</Label>
              <Input
                id="salaryTaxRate"
                type="number"
                value={globalSettings.salaryTaxRate}
                onChange={(e) => handleSettingChange('salaryTaxRate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pensionRate">{t('pension_rate')}</Label>
              <Input
                id="pensionRate"
                type="number"
                value={globalSettings.pensionRate}
                onChange={(e) => handleSettingChange('pensionRate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('operational_settings')}</CardTitle>
            <CardDescription>{t('operational_settings_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dso">{t('dso_label')}</Label>
              <Input
                id="dso"
                type="number"
                value={globalSettings.dso}
                onChange={(e) => handleSettingChange('dso', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t('dso_desc')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dpo">{t('dpo_label')}</Label>
              <Input
                id="dpo"
                type="number"
                value={globalSettings.dpo}
                onChange={(e) => handleSettingChange('dpo', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t('dpo_desc')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchangeRate">{t('exchange_rate')}</Label>
              <Input
                id="exchangeRate"
                type="number"
                step="0.01"
                value={globalSettings.exchangeRate}
                onChange={(e) => handleSettingChange('exchangeRate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}