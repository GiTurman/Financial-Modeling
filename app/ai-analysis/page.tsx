// app/ai-analysis/page.tsx
'use client'

import { useState } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Sparkles, CheckCircle, AlertTriangle, Lightbulb, Terminal } from 'lucide-react'

type AnalysisResult = {
  score: number;
  summary: string;
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export default function AiAnalysisPage() {
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const { getIncomeStatement, getBalanceSheet, getCashFlow, language } = useFinancialStore()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    const financialData = {
      incomeStatement: getIncomeStatement(),
      balanceSheet: getBalanceSheet(),
      cashFlow: getCashFlow(),
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financialData, language }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'An unknown error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4 ring-1 ring-inset ring-indigo-100">
          <Sparkles className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-light tracking-tight text-slate-900">{t('ai_financial_analyst')}</h1>
        <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">{t('get_instant_insights_from_your_data')}</p>
      </div>

      {!result && !loading && (
        <div className="text-center pb-12">
          <Button size="lg" onClick={handleAnalyze} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-12 text-base shadow-sm">
            <Sparkles className="mr-2 h-5 w-5" />
            {t('analyze_my_financials')}
          </Button>
        </div>
      )}

      {loading && (
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{t('analysis_failed')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden md:col-span-2">
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4"><CardTitle className="text-lg font-medium text-slate-800">{t('executive_summary')}</CardTitle></CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 rounded-xl p-4 min-w-[120px] ring-1 ring-inset ring-indigo-100">
                  <span className="text-3xl font-light">{result.score}</span>
                  <span className="text-xs font-medium uppercase tracking-wider mt-1">Health Score</span>
                </div>
                <p className="text-slate-600 leading-relaxed flex-1">{result.summary}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4"><CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-800"><CheckCircle className="text-emerald-500 h-5 w-5" /> {t('key_strengths')}</CardTitle></CardHeader>
            <CardContent className="pt-6"><ul className="space-y-3">{result.strengths.map((s, i) => <li key={i} className="flex items-start gap-2 text-slate-600"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /><span>{s}</span></li>)}</ul></CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4"><CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-800"><AlertTriangle className="text-rose-500 h-5 w-5" /> {t('risk_factors')}</CardTitle></CardHeader>
            <CardContent className="pt-6"><ul className="space-y-3">{result.risks.map((r, i) => <li key={i} className="flex items-start gap-2 text-slate-600"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" /><span>{r}</span></li>)}</ul></CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden md:col-span-2">
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4"><CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-800"><Lightbulb className="text-amber-500 h-5 w-5" /> {t('strategic_recommendations')}</CardTitle></CardHeader>
            <CardContent className="pt-6"><ol className="space-y-4">{result.recommendations.map((rec, i) => <li key={i} className="flex items-start gap-3 text-slate-600"><div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold shrink-0">{i + 1}</div><span className="pt-0.5">{rec}</span></li>)}</ol></CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}