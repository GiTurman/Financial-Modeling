// lib/calculations.ts

import {
  FinancialEntry,
  IncomeStatement,
  BalanceSheet,
  CashFlow,
  Category,
  GlobalSettings,
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
 * @param settings - Global settings including tax rates.
 * @returns A calculated IncomeStatement object.
 */
export const calculateIncomeStatement = (entries: FinancialEntry[], settings: GlobalSettings): IncomeStatement => {
  // Revenue is input as Gross, so we extract VAT
  const grossRevenue = sumByCategory(entries, Category.REVENUE)
  const revenue = grossRevenue / (1 + settings.vatRate / 100)

  // COGS and OPEX are input as Gross, so we extract VAT
  const grossCogs = sumByCategory(entries, Category.COGS)
  const cogs = grossCogs / (1 + settings.vatRate / 100)
  
  const grossOpex = sumByCategory(entries, Category.OPEX)
  const opexWithoutSalary = grossOpex / (1 + settings.vatRate / 100)

  // Salary is input as Net, so we gross it up
  const netSalary = sumByCategory(entries, Category.SALARY)
  const salaryGrossUpFactor = 1 - (settings.salaryTaxRate / 100) - (settings.pensionRate / 100)
  const grossSalary = netSalary / (salaryGrossUpFactor > 0 ? salaryGrossUpFactor : 1)
  
  const opex = opexWithoutSalary + grossSalary

  const da = sumByCategory(entries, Category.DA)
  const interest = sumByCategory(entries, Category.INTEREST)

  const grossProfit = revenue - cogs
  const ebitda = grossProfit - opex
  const ebit = ebitda - da
  const ebt = ebit - interest
  
  // Corporate tax calculation
  const calculatedTax = ebt > 0 ? ebt * (settings.corporateTaxRate / 100) : 0
  const manualTax = sumByCategory(entries, Category.TAX)
  const tax = manualTax > 0 ? manualTax : calculatedTax

  const netIncome = ebt - tax

  return { revenue, cogs, grossProfit, opex, ebitda, da, ebit, interest, ebt, tax, netIncome }
}

/**
 * Calculates the Balance Sheet at a specific point in time.
 * @param entries - Array of all financial entries up to a point in time.
 * @param settings - Global settings.
 * @returns A calculated BalanceSheet object.
 */
export const calculateBalanceSheet = (entries: FinancialEntry[], settings: GlobalSettings): BalanceSheet => {
  const totalAssets = sumByCategory(entries, Category.ASSET)
  const totalLiabilities = sumByCategory(entries, Category.LIABILITY)
  const totalEquity = sumByCategory(entries, Category.EQUITY)
  
  // Estimate AR based on DSO and Gross Revenue
  const grossRevenue = sumByCategory(entries, Category.REVENUE)
  const accountsReceivable = (grossRevenue / 365) * settings.dso

  // Estimate AP based on DPO and Gross Expenses
  const grossExpenses = sumByCategory(entries, Category.COGS) + sumByCategory(entries, Category.OPEX)
  const accountsPayable = (grossExpenses / 365) * settings.dpo

  // We need to calculate retained earnings from net income of all periods
  // For now, we assume net income is part of equity entries or calculated elsewhere
  // A better way is to sum all net incomes up to this point.
  
  const cash = 10000 // This should ideally be the ending cash from Cash Flow
  const inventory = 8000 // Placeholder or derived from entries
  const ppe = 50000 // Placeholder or derived from entries

  const currentAssets = cash + accountsReceivable + inventory
  const currentLiabilities = accountsPayable + 4000 // 4000 is placeholder for short term debt

  const balanceCheck = totalAssets - (totalLiabilities + totalEquity)

  return {
    cash,
    accountsReceivable,
    inventory,
    totalCurrentAssets: currentAssets,
    propertyPlantEquipment: ppe,
    totalAssets: totalAssets > 0 ? totalAssets : (currentAssets + ppe),
    accountsPayable,
    shortTermDebt: 4000,
    totalCurrentLiabilities: currentLiabilities,
    longTermDebt: 20000,
    totalLiabilities: totalLiabilities > 0 ? totalLiabilities : (currentLiabilities + 20000),
    commonStock: 15000,
    retainedEarnings: 10000,
    totalEquity: totalEquity > 0 ? totalEquity : (15000 + 10000),
    balanceCheck,
  }
}

/**
 * Calculates the Cash Flow Statement for a given period.
 */
export const calculateCashFlow = (
  entries: FinancialEntry[],
  is: IncomeStatement,
  bs: BalanceSheet,
  prevBs: BalanceSheet | null,
  settings: GlobalSettings
): CashFlow => {
  const previousBs = prevBs || {
    cash: 0,
    accountsReceivable: 0,
    inventory: 0,
    totalCurrentAssets: 0,
    propertyPlantEquipment: 0,
    totalAssets: 0,
    accountsPayable: 0,
    shortTermDebt: 0,
    totalCurrentLiabilities: 0,
    longTermDebt: 0,
    totalLiabilities: 0,
    commonStock: 0,
    retainedEarnings: 0,
    totalEquity: 0,
    balanceCheck: 0
  }

  // Cash flow uses full amounts (including VAT)
  const grossRevenue = sumByCategory(entries, Category.REVENUE)
  const grossCogs = sumByCategory(entries, Category.COGS)
  const grossOpex = sumByCategory(entries, Category.OPEX)
  
  const netSalary = sumByCategory(entries, Category.SALARY)
  const salaryGrossUpFactor = 1 - (settings.salaryTaxRate / 100) - (settings.pensionRate / 100)
  const grossSalary = netSalary / (salaryGrossUpFactor > 0 ? salaryGrossUpFactor : 1)

  // Direct Method Approximation
  const cashReceivedFromCustomers = grossRevenue - (bs.accountsReceivable - previousBs.accountsReceivable)
  const cashPaidToSuppliersAndEmployees = grossCogs + grossOpex + grossSalary - (bs.accountsPayable - previousBs.accountsPayable)
  const interestPaid = sumByCategory(entries, Category.INTEREST)
  const taxesPaid = is.tax

  const operatingCF = cashReceivedFromCustomers - cashPaidToSuppliersAndEmployees - interestPaid - taxesPaid

  const capex = -sumByCategory(entries, Category.CAPEX)
  const investingCF = capex

  const changeInDebt = bs.longTermDebt - previousBs.longTermDebt
  const changeInEquity = bs.commonStock - previousBs.commonStock
  const financingCF = changeInDebt + changeInEquity

  const netCashFlow = operatingCF + investingCF + financingCF
  const beginningCash = previousBs.cash
  const endingCash = beginningCash + netCashFlow

  const changeInAR = bs.accountsReceivable - previousBs.accountsReceivable
  const changeInAP = bs.accountsPayable - previousBs.accountsPayable
  const changeInWorkingCapital = changeInAP - changeInAR

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
