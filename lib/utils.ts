import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency based on a given locale.
 * @param amount - The number to format.
 * @param locale - The locale string (e.g., 'en-US', 'ka-GE').
 * @returns A formatted currency string.
 */
export const formatCurrency = (amount: number, locale: string = 'en-US'): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD', // This could be dynamic
    minimumFractionDigits: 2,
  }
  return new Intl.NumberFormat(locale, options).format(amount)
}
