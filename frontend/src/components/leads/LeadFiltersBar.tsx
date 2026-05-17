import { Search, X } from 'lucide-react';
import { LeadStatus, LeadSource, LeadFilters } from '@/types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/config/constants';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFilterChange: (updates: Partial<LeadFilters>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function LeadFiltersBar({
  filters,
  onFilterChange,
  searchValue,
  onSearchChange,
}: LeadFiltersBarProps) {
  const hasActiveFilters = Boolean(filters.status || filters.source || filters.search);

  const clearFilters = () => {
    onFilterChange({ status: undefined, source: undefined, page: 1 });
    onSearchChange('');
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          className="input-field pl-9"
          placeholder="Search by name or email…"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search leads"
        />
      </div>

      {/* Status filter */}
      <select
        className="input-field w-auto"
        value={filters.status ?? ''}
        onChange={(e) =>
          onFilterChange({
            status: (e.target.value as LeadStatus) || undefined,
            page: 1,
          })
        }
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Source filter */}
      <select
        className="input-field w-auto"
        value={filters.source ?? ''}
        onChange={(e) =>
          onFilterChange({
            source: (e.target.value as LeadSource) || undefined,
            page: 1,
          })
        }
        aria-label="Filter by source"
      >
        <option value="">All Sources</option>
        {LEAD_SOURCES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        className="input-field w-auto"
        value={filters.sort}
        onChange={(e) =>
          onFilterChange({ sort: e.target.value as 'latest' | 'oldest' })
        }
        aria-label="Sort order"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          className="btn-secondary text-xs gap-1"
          onClick={clearFilters}
          aria-label="Clear all filters"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}
