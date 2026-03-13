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
  
  // --- NEW: Assumptions State ---
  assumptions: Assumptions;
  setAssumption: <K extends keyof Assumptions>(key: K, value: Assumptions[K]) => void;

  // --- NEW: Scenarios State ---
  activeScenario: ScenarioType;
  scenarios: Record<ScenarioType, ScenarioMultipliers>;
  setScenario: (scenario: ScenarioType) => void;
  
  // Actions
  addEntry: (entry: Omit<FinancialEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  clearAllEntries: () => void;

  // Computed Selectors
  getIncomeStatement: (scenario?: ScenarioType) => IncomeStatement;
  getBalanceSheet: (scenario?: ScenarioType) => BalanceSheet;
  getCashFlow: (scenario?: ScenarioType) => CashFlow;
}

const defaultAssumptions: Assumptions = {
  revenueGrowth: 10,
  cogsPercentage: 60,
  opexAsPercentageOfRevenue: 20,
  taxRate: 15,
};

export const useFinancialStore = create<FinancialState>((set, get) => ({
  // Initial State
  entries: [],
  selectedPeriod: '2024-Q1',
  language: 'en',
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

  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),
  
  clearAllEntries: () => set({ entries: [] }),

  setAssumption: (key, value) =>
    set((state) => ({
      assumptions: { ...state.assumptions, [key]: value },
    })),

  setScenario: (scenario) => set({ activeScenario: scenario }),

  // Computed Selectors
  getIncomeStatement: (scenario) => {
    const { entries, assumptions, scenarios, activeScenario } = get()
    const targetScenario = scenario || activeScenario
    const multipliers = scenarios[targetScenario]
    
    // IMPORTANT: This is a simplified application of multipliers.
    // A real model would use assumptions to project future entries,
    // then apply scenario multipliers to those projections.
    const modifiedEntries = entries.map(e => {
        if (e.category === Category.REVENUE) return {...e, amount: e.amount * multipliers.revenue}
        if (e.category === Category.COGS) return {...e, amount: e.amount * multipliers.cogs}
        if (e.category === Category.OPEX) return {...e, amount: e.amount * multipliers.opex}
        return e
    })

    return calculateIncomeStatement(modifiedEntries)
  },

  getBalanceSheet: (scenario) => {
    // Balance sheet calculations would also need to be scenario-aware
    const { entries } = get()
    return calculateBalanceSheet(entries)
  },

  getCashFlow: (scenario) => {
    const incomeStatement = get().getIncomeStatement(scenario)
    const balanceSheet = get().getBalanceSheet(scenario)
    // Placeholder for previous period's balance sheet
    const prevBalanceSheet = get().getBalanceSheet(scenario) 
    return calculateCashFlow(incomeStatement, balanceSheet, prevBalanceSheet)
  },
}))