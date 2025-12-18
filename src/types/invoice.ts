// ═══════════════════════════════════════════════════════════════════════════
// 📝 Invoice Types
// ═══════════════════════════════════════════════════════════════════════════

export type InvoiceType = "BUSINESS" | "FREELANCER";
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
export type Currency = "EUR" | "USD" | "GBP" | "CHF" | "CAD";

// ═══════════════════════════════════════════════════════════════════════════
// 👤 Profile Types
// ═══════════════════════════════════════════════════════════════════════════

export interface Profile {
  id: string;
  type: InvoiceType;
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  website?: string;

  // Business-specific
  companyName?: string;
  taxId?: string;
  registrationNo?: string;

  // Freelancer-specific
  title?: string;
  hourlyRate?: number;

  // Bank details
  bankName?: string;
  iban?: string;
  bic?: string;

  // Branding
  logo?: string;
  accentColor: string;

  // Settings
  defaultCurrency: Currency;
  defaultTaxRate: number;
  defaultPaymentTerms: number;
  invoicePrefix: string;
  nextInvoiceNum: number;
}

export interface ProfileFormData extends Omit<Profile, "id"> {}

// ═══════════════════════════════════════════════════════════════════════════
// 👥 Client Types
// ═══════════════════════════════════════════════════════════════════════════

export interface Client {
  id: string;
  profileId: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  companyName?: string;
  taxId?: string;
  contactName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientFormData
  extends Omit<Client, "id" | "profileId" | "createdAt" | "updatedAt"> {}

// ═══════════════════════════════════════════════════════════════════════════
// 📝 Invoice Item Types
// ═══════════════════════════════════════════════════════════════════════════

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  unit?: string;
  order: number;
}

export interface InvoiceItemFormData
  extends Omit<InvoiceItem, "id" | "amount"> {}

// ═══════════════════════════════════════════════════════════════════════════
// 🧾 Invoice Types
// ═══════════════════════════════════════════════════════════════════════════

export interface Invoice {
  id: string;
  profileId: string;
  clientId: string;
  number: string;
  type: InvoiceType;
  status: InvoiceStatus;
  currency: Currency;

  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;

  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;

  notes?: string;
  terms?: string;
  footer?: string;

  createdAt: Date;
  updatedAt: Date;

  // Relations
  client?: Client;
  items?: InvoiceItem[];
}

export interface InvoiceFormData {
  clientId: string;
  type: InvoiceType;
  currency: Currency;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  discount: number;
  notes?: string;
  terms?: string;
  footer?: string;
  items: InvoiceItemFormData[];
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 Dashboard Types
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidThisMonth: number;
  invoicesByStatus: Record<InvoiceStatus, number>;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 API Response Types
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
