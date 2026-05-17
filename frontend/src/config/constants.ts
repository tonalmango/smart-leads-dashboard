import { LeadStatus, LeadSource, UserRole } from '@/types';

// ─── API ──────────────────────────────────────────────────────────────────────

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [10, 25, 50],
} as const;

// ─── Roles ────────────────────────────────────────────────────────────────────

export const ROLES = {
  ADMIN: UserRole.Admin,
  SALES: UserRole.Sales,
} as const;

// ─── Lead enums ───────────────────────────────────────────────────────────────

export const LEAD_STATUSES = Object.values(LeadStatus);
export const LEAD_SOURCES = Object.values(LeadSource);

// ─── Badge color maps ─────────────────────────────────────────────────────────

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  [LeadStatus.Contacted]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  [LeadStatus.Qualified]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  [LeadStatus.Lost]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  [LeadSource.Website]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  [LeadSource.Instagram]: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  [LeadSource.Referral]: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};

// ─── Chart colors ─────────────────────────────────────────────────────────────

export const SOURCE_BAR_COLORS: Record<LeadSource, string> = {
  [LeadSource.Website]: 'bg-purple-500',
  [LeadSource.Instagram]: 'bg-pink-500',
  [LeadSource.Referral]: 'bg-teal-500',
};

export const STATUS_PANEL_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  [LeadStatus.Contacted]: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  [LeadStatus.Qualified]: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  [LeadStatus.Lost]: 'text-red-600 bg-red-50 dark:bg-red-900/20',
};

// ─── Query keys ───────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  LEADS: 'leads',
  LEAD: 'lead',
  STATS: 'stats',
} as const;

// ─── Local storage keys ───────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  THEME: 'theme-storage',
} as const;
