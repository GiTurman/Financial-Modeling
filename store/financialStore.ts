// store/financialStore.ts
'use client'

import { create } from 'zustand'
import {
  FinancialEntry,
  ScenarioType,
  IncomeStatement,
  BalanceSheet,
  CashFlow,
  Category,
  GlobalSettings,
} from '@/types/financial'
import {
  calculateIncomeStatement,
  calculateBalanceSheet,
  calculateCashFlow,
} from '@/lib/calculations'

// --- Assumptions Interfaces ---
interface Assumptions {
  revenueGrowth: number;
  cogsPercentage: number;
  opexAsPercentageOfRevenue: number;
  taxRate: number;
  // ... add all other assumption fields here
}

// --- Scenarios Interfaces ---
interface ScenarioMultipliers {
  revenue: number; // e.g., 1.0 for base, 1.2 for bull, 0.9 for bear
  cogs: number;
  opex: number;
}

interface FinancialState {
  entries: FinancialEntry[];
  selectedPeriod: string;
  language: 'ka' | 'en' | 'ru';
  currency: 'GEL' | 'USD' | 'EUR';
  modelDuration: number; // in years
  viewMode: 'monthly' | 'quarterly' | 'yearly';
  
  // --- NEW: Global Settings ---
  globalSettings: GlobalSettings;
  setGlobalSetting: <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => void;

  // --- NEW: Assumptions State ---
  assumptions: Assumptions;
  setAssumption: <K extends keyof Assumptions>(key: K, value: Assumptions[K]) => void;

  // --- NEW: Scenarios State ---
  activeScenario: ScenarioType;
  scenarios: Record<ScenarioType, ScenarioMultipliers>;
  setScenario: (scenario: ScenarioType) => void;
  
  // Actions
  addEntry: (entry: Omit<FinancialEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Omit<FinancialEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  clearAllEntries: () => void;
  setLanguage: (lang: 'ka' | 'en' | 'ru') => void;
  setCurrency: (currency: 'GEL' | 'USD' | 'EUR') => void;
  setModelDuration: (duration: number) => void;
  setViewMode: (mode: 'monthly' | 'quarterly' | 'yearly') => void;
  setSelectedPeriod: (period: string) => void;

  // Computed Selectors
  getIncomeStatement: (scenario?: ScenarioType) => IncomeStatement;
  getBalanceSheet: (scenario?: ScenarioType) => BalanceSheet;
  getCashFlow: (scenario?: ScenarioType) => CashFlow;
}

const defaultGlobalSettings: GlobalSettings = {
  vatRate: 18,
  salaryTaxRate: 20,
  pensionRate: 4, // 2% employee + 2% employer
  corporateTaxRate: 15,
  dso: 30,
  dpo: 30,
  exchangeRate: 1.0,
};

const defaultAssumptions: Assumptions = {
  revenueGrowth: 10,
  cogsPercentage: 60,
  opexAsPercentageOfRevenue: 20,
  taxRate: 15,
};

export const useFinancialStore = create<FinancialState>((set, get) => {
  const getModifiedEntries = (scenario?: ScenarioType) => {
    const { entries, scenarios, activeScenario, selectedPeriod, viewMode } = get()
    const targetScenario = scenario || activeScenario
    const multipliers = scenarios[targetScenario]
    
    const getPeriodFromDate = (dateStr: string, mode: 'monthly' | 'quarterly' | 'yearly'): string => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      if (mode === 'yearly') return `${year}-FY`;
      if (mode === 'monthly') {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
      }
      if (mode === 'quarterly') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `${year}-Q${quarter}`;
      }
      return '';
    };

    return entries
      .filter(e => getPeriodFromDate(e.date, viewMode) === selectedPeriod)
      .map(e => {
        if (e.category === Category.REVENUE) return {...e, amount: e.amount * multipliers.revenue}
        if (e.category === Category.COGS) return {...e, amount: e.amount * multipliers.cogs}
        if (e.category === Category.OPEX) return {...e, amount: e.amount * multipliers.opex}
        if (e.category === Category.SALARY) return {...e, amount: e.amount * multipliers.opex}
        return e
      })
  }

  return {
    // Initial State
    entries: [],
    selectedPeriod: '2026-Q1',
    language: 'ka',
    currency: 'GEL',
    modelDuration: 1,
    viewMode: 'quarterly',
    globalSettings: defaultGlobalSettings,
    assumptions: defaultAssumptions,
    activeScenario: 'base',
    scenarios: {
      base: { revenue: 1.0, cogs: 1.0, opex: 1.0 },
      bull: { revenue: 1.25, cogs: 0.95, opex: 1.1 },
      bear: { revenue: 0.85, cogs: 1.05, opex: 0.9 },
    },

    // Actions
    addEntry: (entry) =>
      set((state) => ({
        entries: [...state.entries, { ...entry, id: new Date().toISOString() }],
      })),

    updateEntry: (id, entry) =>
      set((state) => ({
        entries: state.entries.map((e) => (e.id === id ? { ...entry, id } : e)),
      })),

    removeEntry: (id) =>
      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
      })),
    
    clearAllEntries: () => set({ entries: [] }),

    setGlobalSetting: (key, value) =>
      set((state) => ({
        globalSettings: { ...state.globalSettings, [key]: value },
      })),

    setAssumption: (key, value) =>
      set((state) => ({
        assumptions: { ...state.assumptions, [key]: value },
      })),

    setScenario: (scenario) => set({ activeScenario: scenario }),

    setLanguage: (lang) => set({ language: lang }),
    setCurrency: (currency) => set({ currency }),
    setModelDuration: (duration) => set({ modelDuration: duration }),
    setViewMode: (mode) => set((state) => {
      const startYear = 2026;
      let newPeriod = state.selectedPeriod;
      if (mode === 'monthly') newPeriod = `${startYear}-01`;
      else if (mode === 'quarterly') newPeriod = `${startYear}-Q1`;
      else if (mode === 'yearly') newPeriod = `${startYear}-FY`;
      
      return { viewMode: mode, selectedPeriod: newPeriod };
    }),
    setSelectedPeriod: (period) => set({ selectedPeriod: period }),

    // Computed Selectors
    getIncomeStatement: (scenario) => {
      const { globalSettings } = get()
      const modifiedEntries = getModifiedEntries(scenario)
      return calculateIncomeStatement(modifiedEntries, globalSettings)
    },

    getBalanceSheet: (scenario) => {
      const { globalSettings } = get()
      const modifiedEntries = getModifiedEntries(scenario)
      return calculateBalanceSheet(modifiedEntries, globalSettings)
    },

    getCashFlow: (scenario) => {
      const { globalSettings } = get()
      const modifiedEntries = getModifiedEntries(scenario)
      const incomeStatement = get().getIncomeStatement(scenario)
      const balanceSheet = get().getBalanceSheet(scenario)
      // For now, we don't have a previous period in the store, so we pass null
      return calculateCashFlow(modifiedEntries, incomeStatement, balanceSheet, null, globalSettings)
    },
  }
})