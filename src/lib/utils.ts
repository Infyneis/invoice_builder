import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting
const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  CHF: "CHF",
  CAD: "$",
};

export function formatCurrency(amount: number, currency: string = "EUR"): string {
  const symbol = currencySymbols[currency] || currency;
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (currency === "USD" || currency === "GBP" || currency === "CAD") {
    return `${symbol}${formatted}`;
  }
  return `${formatted} ${symbol}`;
}

// Date formatting
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

// Invoice status helpers
const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyée",
  PAID: "Payée",
  OVERDUE: "En retard",
  CANCELLED: "Annulée",
};

const statusColors: Record<string, string> = {
  DRAFT: "default",
  SENT: "primary",
  PAID: "success",
  OVERDUE: "danger",
  CANCELLED: "secondary",
};

export function getStatusLabel(status: string): string {
  return statusLabels[status] || status;
}

export function getStatusColor(status: string): string {
  return statusColors[status] || "default";
}

// Invoice calculation
interface InvoiceItemForCalc {
  quantity: number;
  unitPrice: number;
}

interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export function calculateInvoiceTotals(
  items: InvoiceItemForCalc[],
  taxRate: number,
  discount: number = 0
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const afterDiscount = subtotal - discount;
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;

  return {
    subtotal,
    taxAmount,
    total,
  };
}

// Invoice number generation
export function generateInvoiceNumber(prefix: string, num: number): string {
  const paddedNum = String(num).padStart(4, "0");
  return `${prefix}-${paddedNum}`;
}
