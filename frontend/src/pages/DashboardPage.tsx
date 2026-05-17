import { useLeadStats } from '@/hooks/useLeads';
import { LeadStatus, LeadSource } from '@/types';
import { LoadingState, ErrorState } from '@/components/ui';
import { SOURCE_BAR_COLORS, STATUS_PANEL_COLORS, LEAD_STATUSES, LEAD_SOURCES } from '@/config/constants';
import StatsCards from '@/components/leads/StatsCards';

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useLeadStats();

  if (isLoading) return <LoadingState message="Loading dashboard..." />;
  if (isError || !data?.data) {
    return <ErrorState message="Failed to load dashboard stats." onRetry={() => void refetch()} />;
  }

  const stats = data.data;
  const total = stats.total;

  const sourceBreakdown = LEAD_SOURCES.map((src) => ({
    source: src,
    count: stats.bySource[src] ?? 0,
    pct: total > 0 ? Math.round(((stats.bySource[src] ?? 0) / total) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Overview of your lead pipeline
        </p>
      </div>

      <StatsCards stats={stats} />

      {/* Source breakdown */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Leads by Source
        </h2>
        <div className="space-y-3">
          {sourceBreakdown.map(({ source, count, pct }) => (
            <div key={source}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{source}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {count} ({pct}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`${SOURCE_BAR_COLORS[source as LeadSource]} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Pipeline Status
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {LEAD_STATUSES.map((status) => {
            const count = stats.byStatus[status] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div
                key={status}
                className={`rounded-lg p-4 text-center ${STATUS_PANEL_COLORS[status as LeadStatus]}`}
              >
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm font-medium mt-0.5">{status}</p>
                <p className="text-xs opacity-70 mt-0.5">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
