// components/dashboard/FinancialChart.tsx
'use client'

import { useRef } from 'react'
import { toPng } from 'html-to-image'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

interface FinancialChartProps {
  type: 'bar' | 'line' | 'donut'
  data: any[]
  title: string
  height?: number
  colors?: string[]
  loading?: boolean
  locale?: string
  currency?: string
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b']

export function FinancialChart({ type, data, title, height = 300, colors = DEFAULT_COLORS, loading, locale = 'en-US', currency = 'USD' }: FinancialChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  const handleExport = () => {
    if (chartRef.current === null) return
    toPng(chartRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => console.error(err))
  }

  const renderChart = () => {
    if (data.length === 0) {
      return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
    }
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => formatCurrency(v, locale, currency).split('.')[0]} />
            <Tooltip formatter={(v) => formatCurrency(Number(v), locale, currency)} />
            <Legend />
            <Bar dataKey="revenue" fill={colors[0]} />
            <Bar dataKey="expenses" fill={colors[1]} />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => formatCurrency(v, locale, currency).split('.')[0]} />
            <Tooltip formatter={(v) => formatCurrency(Number(v), locale, currency)} />
            <Legend />
            <Line type="monotone" dataKey="netIncome" stroke={colors[0]} />
          </LineChart>
        )
      case 'donut':
        return (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill={colors[0]}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => formatCurrency(Number(v), locale, currency)} />
            <Legend />
          </PieChart>
        )
      default:
        return null
    }
  }

  return (
    <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/50 pb-4 bg-slate-50/50">
        <CardTitle className="text-base font-medium text-slate-700">{title}</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleExport} className="h-8 w-8 text-slate-400 hover:text-slate-600">
          <Download className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent ref={chartRef} className="pt-6">
        {loading ? (
          <Skeleton className="w-full" style={{ height }} />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}