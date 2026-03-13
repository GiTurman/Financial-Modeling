// lib/calculations.ts

import {
  FinancialEntry,
  IncomeStatement,
  BalanceSheet,
  CashFlow,
  Category,
} from '@/types/financial'

/**
 * Calculates the sum of amounts for a specific category from a list of entries.
 * @param entries - Array of financial entries.
 * @param category - The category to sum.
 * @returns The total amount for the given category.
 */
const sumByCategory = (entries: FinancialEntry[], category: Category): number => {
  return entries
    .filter((e) => e.category === category)
    .reduce((sum, current) => sum + current.amount, 0)
}

/**
 * Calculates the Income Statement for a given period based on financial entries.
 * @param entries - Array of financial entries for the period.
 * @returns A calculated IncomeStatement object.
 */
export const calculateIncomeStatement = (entries: FinancialEntry[]): IncomeStatement => {
  const revenue = sumByCategory(entries, Category.REVENUE)
  const cogs = sumByCategory(entries, Category.COGS)
  const opex = sumByCategory(entries, Category.OPEX)
  const da = sumByCategory(entries, Category.DA)
  const interest = sumByCategory(entries, Category.INTEREST)
  const tax = sumByCategory(entries, Category.TAX)

  const grossProfit = revenue - cogs
  const ebitda = grossProfit - opex
  const ebit = ebitda - da
  const ebt = ebit - interest
  const netIncome = ebt - tax

  return { revenue, cogs, grossProfit, opex, ebitda, da, ebit, interest, ebt, tax, netIncome }
}

/**
 * Calculates the Balance Sheet at a specific point in time.
 * NOTE: This is a simplified placeholder. A real balance sheet is a snapshot
 * and requires accumulating values over time, not just summing current period entries.
 * @param entries - Array of all financial entries up to a point in time.
 * @returns A calculated BalanceSheet object.
 */
export const calculateBalanceSheet = (entries: FinancialEntry[]): BalanceSheet => {
  // This is a highly simplified example.
  const totalAssets = sumByCategory(entries, Category.ASSET)
  const totalLiabilities = sumByCategory(entries, Category.LIABILITY)
  const totalEquity = sumByCategory(entries, Category.EQUITY)
  const balanceCheck = totalAssets - (totalLiabilities + totalEquity)

  return {
    cash: 10000, // Placeholder
    accountsReceivable: 5000, // Placeholder
    inventory: 8000, // Placeholder
    totalCurrentAssets: 23000, // Placeholder
    propertyPlantEquipment: 50000, // Placeholder
    totalAssets,
    accountsPayable: 6000, // Placeholder
    shortTermDebt: 4000, // Placeholder
    totalCurrentLiabilities: 10000, // Placeholder
    longTermDebt: 20000, // Placeholder
    totalLiabilities,
    commonStock: 15000, // Placeholder
    retainedEarnings: 10000, // Placeholder
    totalEquity,
    balanceCheck,
  }
}

/**
 * Calculates the Cash Flow Statement for a given period.
 * @param is - The IncomeStatement for the current period.
 * @param bs - The BalanceSheet for the current period.
 * @param prevBs - The BalanceSheet for the previous period.
 * @returns A calculated CashFlow object.
 */
export const calculateCashFlow = (
  is: IncomeStatement,
  bs: BalanceSheet,
  prevBs: BalanceSheet
): CashFlow => {
  // This is a simplified example.
  const changeInWorkingCapital = 0 // (prevBs.AR - bs.AR) - (prevBs.AP - bs.AP) etc.
  const operatingCF = is.netIncome + is.da + changeInWorkingCapital

  const capex = -sumByCategory([], Category.CAPEX) // Placeholder for entries
  const investingCF = capex

  const changeInDebt = 0 // bs.longTermDebt - prevBs.longTermDebt
  const changeInEquity = 0 // bs.commonStock - prevBs.commonStock
  const financingCF = changeInDebt + changeInEquity

  const netCashFlow = operatingCF + investingCF + financingCF
  const beginningCash = prevBs.cash
  const endingCash = beginningCash + netCashFlow

  return {
    netIncome: is.netIncome,
    da: is.da,
    changeInWorkingCapital,
    operatingCF,
    capex,
    investingCF,
    changeInDebt,
    changeInEquity,
    financingCF,
    netCashFlow,
    beginningCash,
    endingCash,
  }
}
