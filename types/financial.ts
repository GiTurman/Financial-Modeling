// types/financial.ts

/**
 * Defines the categories for financial entries.
 * This helps in filtering and aggregating data for different financial statements.
 */
export enum Category {
  REVENUE = 'REVENUE',
  COGS = 'COGS', // Cost of Goods Sold
  OPEX = 'OPEX', // Operating Expenses
  SALARY = 'SALARY', // Salaries and Wages
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  CAPEX = 'CAPEX', // Capital Expenditures
  DA = 'D&A', // Depreciation & Amortization
  INTEREST = 'INTEREST',
  TAX = 'TAX',
}

export interface GlobalSettings {
  vatRate: number;
  salaryTaxRate: number;
  pensionRate: number;
  corporateTaxRate: number;
  dso: number; // Days Sales Outstanding
  dpo: number; // Days Payable Outstanding
  exchangeRate: number;
}

/**
 * Represents a single financial transaction or entry.
 * This is the base unit of data for all calculations.
 */
export interface FinancialEntry {
  id: string; // Unique identifier (e.g., UUID)
  date: string; // ISO 8601 format date string (e.g., "2024-03-31")
  category: Category;
  subcategory?: string; // e.g., "Salaries", "Software Licenses"
  amount: number; // Can be positive or negative
  description?: string;
}

/**
 * Structure for the Income Statement.
 * All values are calculated for a specific period.
 */
export interface IncomeStatement {
  revenue: number;
  cogs: number;
  grossProfit: number;
  opex: number;
  ebitda: number;
  da: number; // Depreciation & Amortization
  ebit: number;
  interest: number;
  ebt: number;
  tax: number;
  netIncome: number;
}

/**
 * Structure for the Balance Sheet.
 * Represents the company's financial position at a specific point in time.
 */
export interface BalanceSheet {
  // Assets
  cash: number;
  accountsReceivable: number;
  inventory: number;
  totalCurrentAssets: number;
  propertyPlantEquipment: number;
  totalAssets: number;

  // Liabilities
  accountsPayable: number;
  shortTermDebt: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;

  // Equity
  commonStock: number;
  retainedEarnings: number;
  totalEquity: number;

  // Verification
  balanceCheck: number; // Should be close to 0
}

/**
 * Structure for the Cash Flow Statement.
 * Shows how cash moves in and out of the company.
 */
export interface CashFlow {
  // Operating Activities
  netIncome: number;
  da: number;
  changeInWorkingCapital: number;
  operatingCF: number;

  // Investing Activities
  capex: number;
  investingCF: number;

  // Financing Activities
  changeInDebt: number;
  changeInEquity: number;
  financingCF: number;

  // Summary
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

/**
 * Defines the possible financial modeling scenarios.
 */
export type ScenarioType = 'base' | 'bull' | 'bear';

/**
 * Supported languages for the application.
 */
export enum Language {
  EN = 'en',
  KA = 'ka',
  RU = 'ru',
}
