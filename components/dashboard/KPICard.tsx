// components/dashboard/KPICard.tsx
'use client'

import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange'
  subtitle?: string
  loading?: boolean
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  red: 'bg-rose-50 text-rose-600 ring-rose-100',
  purple: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  orange: 'bg-amber-50 text-amber-600 ring-amber-100',
}

export function KPICard({ title, value, change, icon: Icon, color = 'blue', subtitle, loading }: KPICardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="border-slate-200/60 shadow-sm bg-white overflow-hidden rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
          <div className={cn("p-2 rounded-xl ring-1 ring-inset", colorClasses[color])}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-light tracking-tight text-slate-900 kpi-number mt-2">{value}</div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <div className="mt-3 flex items-center text-xs">
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 font-medium",
                change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              )}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-slate-500 ml-2">vs last period</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}