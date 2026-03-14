'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Layers, 
  BrainCircuit,
  Wallet,
  Settings
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/input', icon: Database, label: t('input') },
    { href: '/income-statement', icon: FileText, label: t('incomeStatement') },
    { href: '/balance-sheet', icon: Wallet, label: t('balanceSheet') },
    { href: '/cash-flow', icon: BarChart3, label: t('cashFlow') },
    { href: '/assumptions', icon: TrendingUp, label: t('assumptions') },
    { href: '/scenarios', icon: Layers, label: t('scenarios') },
    { href: '/settings', icon: Settings, label: t('settings') },
    { href: '/ai-analysis', icon: BrainCircuit, label: t('aiAnalysis') },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">FinModel AI</h1>
      </div>
      <nav className="mt-2 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
