import clsx from 'clsx';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';
import { STATUS_COLORS, SOURCE_COLORS } from '@/config/constants';
import { LeadStatus, LeadSource } from '@/types';

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  variant: 'status' | 'source';
  value: string;
}

export function Badge({ label, variant, value }: BadgeProps) {
  const colorMap =
    variant === 'status'
      ? STATUS_COLORS
      : SOURCE_COLORS;

  const color =
    (colorMap as Record<string, string>)[value] ?? 'bg-gray-100 text-gray-700';

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        color
      )}
    >
      {label}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return <Loader2 className={clsx('animate-spin', className)} />;
}

// ─── LoadingSpinner ───────────────────────────────────────────────────────────

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className="flex items-center justify-center p-4">
      <Spinner className={clsx(sizeClass, 'text-blue-500')} />
    </div>
  );
}

// ─── LoadingState (full-pane) ─────────────────────────────────────────────────

export function LoadingState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner className="w-8 h-8 text-blue-500" />
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No leads found',
  description = 'Try adjusting your filters or create a new lead.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Inbox className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── ErrorMessage (inline) ────────────────────────────────────────────────────

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({
  message = 'Something went wrong.',
}: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}

// ─── ErrorState (full-pane) ───────────────────────────────────────────────────

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-500" />
      </div>
      <p className="text-sm text-red-600 dark:text-red-400 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary text-xs"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// Re-export for backwards compatibility
export { LeadStatus, LeadSource };
