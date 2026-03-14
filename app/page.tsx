'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, BarChart2, Activity } from 'lucide-react';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency } from '@/lib/utils';
import { KPICard } from '@/components/dashboard/KPICard';
import { FinancialChart } from '@/components/dashboard/FinancialChart';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { activeScenario, getIncomeStatement, getBalanceSheet, currency } = useFinancialStore();
  
  const incomeStatement = getIncomeStatement();
  const balanceSheet = getBalanceSheet();

  // Mock historical data for charts
  const chartData = [
    { name: 'Jan', revenue: incomeStatement.revenue * 0.8, netIncome: incomeStatement.netIncome * 0.7 },
    { name: 'Feb', revenue: incomeStatement.revenue * 0.85, netIncome: incomeStatement.netIncome * 0.75 },
    { name: 'Mar', revenue: incomeStatement.revenue * 0.9, netIncome: incomeStatement.netIncome * 0.85 },
    { name: 'Apr', revenue: incomeStatement.revenue * 0.95, netIncome: incomeStatement.netIncome * 0.9 },
    { name: 'May', revenue: incomeStatement.revenue, netIncome: incomeStatement.netIncome },
  ];

  const currentRatio = balanceSheet.totalCurrentLiabilities > 0 
    ? balanceSheet.totalCurrentAssets / balanceSheet.totalCurrentLiabilities 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-slate-900">{t('dashboard')}</h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            {t('scenario')}: <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 uppercase">{activeScenario}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={t('revenue')}
          value={formatCurrency(incomeStatement.revenue, i18n.language, currency)}
          change={12}
          icon={TrendingUp}
          color="purple"
        />
        <KPICard
          title={t('netIncome')}
          value={formatCurrency(incomeStatement.netIncome, i18n.language, currency)}
          change={8}
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title={t('ebitda')}
          value={formatCurrency(incomeStatement.ebitda, i18n.language, currency)}
          change={15}
          icon={BarChart2}
          color="orange"
        />
        <KPICard
          title={t('currentRatio')}
          value={currentRatio.toFixed(2)}
          icon={Activity}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FinancialChart
          type="line"
          data={chartData}
          title={`${t('revenue')} Trend`}
          locale={i18n.language}
          currency={currency}
        />
        <FinancialChart
          type="bar"
          data={chartData}
          title={`${t('netIncome')} Performance`}
          locale={i18n.language}
          currency={currency}
        />
      </div>
    </div>
  );
};

export default Dashboard;
