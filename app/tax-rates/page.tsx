// app/tax-rates/page.tsx
'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

// --- DATA ---
type CountryTaxData = {
  country: string
  flag: string
  region: 'Europe' | 'Asia' | 'Americas' | 'CIS/Post-Soviet'
  vat: string
  corporate: string
  personal: string
  dividend: string
  capitalGains: string
}

const taxData: CountryTaxData[] = [
    { country: 'Georgia', flag: '🇬🇪', region: 'CIS/Post-Soviet', vat: '18%', corporate: '15%*', personal: '20%', dividend: '5%', capitalGains: '5-20%' },
    { country: 'USA', flag: '🇺🇸', region: 'Americas', vat: '0-10%**', corporate: '21%', personal: '10-37%', dividend: '0-20%', capitalGains: '0-20%' },
    { country: 'UK', flag: '🇬🇧', region: 'Europe', vat: '20%', corporate: '25%', personal: '20-45%', dividend: '8.75-39%', capitalGains: '10-20%' },
    { country: 'Germany', flag: '🇩🇪', region: 'Europe', vat: '19%', corporate: '15%+', personal: '14-45%', dividend: '25%', capitalGains: '25%' },
    { country: 'France', flag: '🇫🇷', region: 'Europe', vat: '20%', corporate: '25%', personal: '11-45%', dividend: '30%', capitalGains: '30%' },
    { country: 'Italy', flag: '🇮🇹', region: 'Europe', vat: '22%', corporate: '24%', personal: '23-43%', dividend: '26%', capitalGains: '26%' },
    { country: 'Spain', flag: '🇪🇸', region: 'Europe', vat: '21%', corporate: '25%', personal: '19-47%', dividend: '19-23%', capitalGains: '19-23%' },
    { country: 'Netherlands', flag: '🇳🇱', region: 'Europe', vat: '21%', corporate: '19-25.8%', personal: '36.97-49.5%', dividend: '15%', capitalGains: 'Box 3' },
    { country: 'UAE', flag: '🇦🇪', region: 'Asia', vat: '5%', corporate: '9%', personal: '0%', dividend: '0%', capitalGains: '0%' },
    { country: 'Singapore', flag: '🇸🇬', region: 'Asia', vat: '9%', corporate: '17%', personal: '0-22%', dividend: '0%', capitalGains: '0%' },
    { country: 'Hong Kong', flag: '🇭🇰', region: 'Asia', vat: '0%', corporate: '16.5%', personal: '2-17%', dividend: '0%', capitalGains: '0%' },
    { country: 'Switzerland', flag: '🇨🇭', region: 'Europe', vat: '8.1%', corporate: '8.5-24%', personal: '0-11.5%+', dividend: '35%', capitalGains: '0%' },
    { country: 'Latvia', flag: '🇱🇻', region: 'Europe', vat: '21%', corporate: '20%*', personal: '20%', dividend: '20%', capitalGains: '20%' },
    { country: 'Estonia', flag: '🇪🇪', region: 'Europe', vat: '22%', corporate: '20%*', personal: '20%', dividend: '20%', capitalGains: '20%' },
    { country: 'Poland', flag: '🇵🇱', region: 'Europe', vat: '23%', corporate: '19%', personal: '12-32%', dividend: '19%', capitalGains: '19%' },
    { country: 'Russia', flag: '🇷🇺', region: 'CIS/Post-Soviet', vat: '20%', corporate: '25%', personal: '13-15%', dividend: '13-15%', capitalGains: '13-15%' },
    { country: 'Ukraine', flag: '🇺🇦', region: 'CIS/Post-Soviet', vat: '20%', corporate: '18%', personal: '18%', dividend: '5-9%', capitalGains: '18%' },
    { country: 'Armenia', flag: '🇦🇲', region: 'CIS/Post-Soviet', vat: '20%', corporate: '18%', personal: '20%', dividend: '5%', capitalGains: '10%' },
    { country: 'Azerbaijan', flag: '🇦🇿', region: 'CIS/Post-Soviet', vat: '18%', corporate: '20%', personal: '14%', dividend: '10%', capitalGains: '0%' },
    { country: 'China', flag: '🇨🇳', region: 'Asia', vat: '13%', corporate: '25%', personal: '3-45%', dividend: '20%', capitalGains: '20%' },
    { country: 'India', flag: '🇮🇳', region: 'Asia', vat: '5-28%', corporate: '22-30%', personal: '5-30%', dividend: '10%', capitalGains: '10-20%' },
    { country: 'Japan', flag: '🇯🇵', region: 'Asia', vat: '10%', corporate: '23.2%', personal: '5-45%', dividend: '20.315%', capitalGains: '20.315%' },
    { country: 'Saudi Arabia', flag: '🇸🇦', region: 'Asia', vat: '15%', corporate: '20%', personal: '0%', dividend: '5%', capitalGains: '0%' },
    { country: 'Israel', flag: '🇮🇱', region: 'Asia', vat: '17%', corporate: '23%', personal: '10-47%', dividend: '25%', capitalGains: '25%' },
    { country: 'Cyprus', flag: '🇨🇾', region: 'Europe', vat: '19%', corporate: '12.5%', personal: '20-35%', dividend: '0%', capitalGains: '0%' },
];

const georgiaTaxes = [
    { type: 'VAT (დღგ)', rate: '18%', notes: 'Standard rate, threshold 100k GEL' },
    { type: 'Corporate Income Tax (მოგება)', rate: '15%', notes: 'Estonian model (on distribution)' },
    { type: 'Personal Income Tax (PIT)', rate: '20%', notes: 'Flat rate on salary' },
    { type: 'Dividend Tax', rate: '5%', notes: 'Withholding tax' },
    { type: 'Interest Income Tax', rate: '5%', notes: 'Withholding tax' },
    { type: 'Property Tax (ქონება)', rate: 'Up to 1%', notes: 'Depends on municipality' },
    { type: 'Social Security (სოც.უზ.)', rate: '2% + 2%', notes: 'Employee + Employer (Pension)' },
    { type: 'Capital Gains', rate: '5-20%', notes: 'Depends on asset type' },
    { type: 'Royalties', rate: '5%', notes: 'Withholding' },
    { type: 'Virtual Zone Company', rate: '0%', notes: 'IT companies, special status' },
    { type: 'Free Industrial Zone', rate: '0%', notes: 'FIZ companies' },
    { type: 'Small Business Status', rate: '1%', notes: 'Turnover < 500k GEL' },
    { type: 'Micro Business Status', rate: '0%', notes: 'Turnover < 30k GEL' },
];

export default function TaxRatesPage() {
  // Mock translation function
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CountryTaxData; direction: 'asc' | 'desc' } | null>(null);

  const filteredData = useMemo(() => {
    let data = taxData.filter(item =>
      (selectedRegion === 'All' || item.region === selectedRegion) &&
      (item.country.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (sortConfig !== null) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [searchQuery, selectedRegion, sortConfig]);

  const requestSort = (key: keyof CountryTaxData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">🌍 {t('tax_rates.title')}</h1>
          <p className="text-slate-500 mt-1">{t('tax_rates.subtitle')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder={t('tax_rates.search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Tabs value={selectedRegion} onValueChange={setSelectedRegion}>
          <TabsList>
            <TabsTrigger value="All">{t('tax_rates.region_all')}</TabsTrigger>
            <TabsTrigger value="Europe">{t('tax_rates.region_europe')}</TabsTrigger>
            <TabsTrigger value="Asia">{t('tax_rates.region_asia')}</TabsTrigger>
            <TabsTrigger value="Americas">{t('tax_rates.region_americas')}</TabsTrigger>
            <TabsTrigger value="CIS/Post-Soviet">{t('tax_rates.region_cis')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Section 1: Georgia */}
      <Card className="border-amber-200 shadow-sm bg-amber-50/30 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-amber-100 bg-amber-50/50 pb-4">
          <CardTitle className="text-lg font-medium text-amber-900">{t('tax_rates.featured_georgia')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tax_rates.headers.tax_type')}</TableHead>
                <TableHead>{t('tax_rates.headers.rate')}</TableHead>
                <TableHead>{t('tax_rates.headers.notes')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {georgiaTaxes.map((tax) => (
                <TableRow key={tax.type}>
                  <TableCell className="font-medium">{tax.type}</TableCell>
                  <TableCell className="font-mono">{tax.rate}</TableCell>
                  <TableCell>{tax.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-muted-foreground">Estonian model (on distribution only)</p>
        </CardContent>
      </Card>

      {/* Section 2: Comparison Table */}
      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
          <CardTitle className="text-lg font-medium text-slate-800">{t('tax_rates.comparison_table_title')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(taxData[0]).filter(k => k !== 'region').map((key) => (
                    <TableHead key={key}>
                      <Button variant="ghost" onClick={() => requestSort(key as keyof CountryTaxData)}>
                        {t(`tax_rates.headers.${key}`)}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((country) => (
                  <TableRow key={country.country}>
                    <TableCell className="font-medium">{country.flag} {country.country}</TableCell>
                    <TableCell className="font-mono">{country.vat}</TableCell>
                    <TableCell className="font-mono">{country.corporate}</TableCell>
                    <TableCell className="font-mono">{country.personal}</TableCell>
                    <TableCell className="font-mono">{country.dividend}</TableCell>
                    <TableCell className="font-mono">{country.capitalGains}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">* Estonian CIT model (tax on distribution only)</p>
          <p className="text-xs text-muted-foreground">** USA has no federal VAT, state-level sales tax only</p>
        </CardContent>
      </Card>

      {/* Section 3: Deep Dive */}
      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4"><CardTitle className="text-lg font-medium text-slate-800">{t('tax_rates.deep_dive_title')}</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Deep dive content coming soon.</p>
        </CardContent>
      </Card>

      {/* Section 4: Calculator - Placeholder */}
      <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4"><CardTitle className="text-lg font-medium text-slate-800">{t('tax_rates.calculator_title')}</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Interactive calculator coming soon.</p>
        </CardContent>
      </Card>

      {/* Section 5: Disclaimer */}
      <p className="text-center text-sm text-muted-foreground">{t('tax_rates.disclaimer')}</p>
    </div>
  )
}