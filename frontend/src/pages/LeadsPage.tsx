import { useState, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import { Lead, LeadFilters, LeadFormData } from '@/types';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { leadService } from '@/services/lead.service';
import LeadFiltersBar from '@/components/leads/LeadFiltersBar';
import LeadTable from '@/components/leads/LeadTable';
import Pagination from '@/components/leads/Pagination';
import LeadFormModal from '@/components/leads/LeadFormModal';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { PAGINATION } from '@/config/constants';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: LeadFilters = {
  page: PAGINATION.DEFAULT_PAGE,
  limit: PAGINATION.DEFAULT_LIMIT,
  search: '',
  sort: 'latest',
};

export default function LeadsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.Admin;

  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);
  const effectiveFilters: LeadFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError, refetch } = useLeads(effectiveFilters);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const leads = data?.data ?? [];
  const pagination = data?.pagination;

  const handleFilterChange = useCallback((updates: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, page: PAGINATION.DEFAULT_PAGE }));
  }, []);

  const handleCreate = async (formData: LeadFormData) => {
    await createMutation.mutateAsync(formData);
    setIsCreateOpen(false);
  };

  const handleUpdate = async (formData: LeadFormData) => {
    if (!editingLead) return;
    await updateMutation.mutateAsync({ id: editingLead._id, payload: formData });
    setEditingLead(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadService.exportCSV(effectiveFilters);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const hasActiveFilters = Boolean(filters.status || filters.source || debouncedSearch);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pagination ? `${pagination.total} total leads` : 'Manage your leads'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* CSV export — Admin only */}
          {isAdmin && (
            <button
              onClick={() => void handleExport()}
              disabled={isExporting}
              className="btn-secondary"
            >
              <Download size={16} />
              {isExporting ? 'Exporting…' : 'Export CSV'}
            </button>
          )}
          <button onClick={() => setIsCreateOpen(true)} className="btn-primary">
            <Plus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <LeadFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <LoadingState message="Loading leads…" />
        ) : isError ? (
          <ErrorState
            message="Failed to load leads. Please try again."
            onRetry={() => void refetch()}
          />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={
              hasActiveFilters
                ? 'Try adjusting your filters.'
                : 'Get started by adding your first lead.'
            }
            action={
              !hasActiveFilters ? (
                <button onClick={() => setIsCreateOpen(true)} className="btn-primary text-sm">
                  <Plus size={14} />
                  Add your first lead
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="p-4 space-y-4">
            <LeadTable
              leads={leads}
              onEdit={(lead) => setEditingLead(lead)}
              onDelete={isAdmin ? handleDelete : undefined}
            />
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                onPageChange={(page) => handleFilterChange({ page })}
              />
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <LeadFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        title="Add New Lead"
        submitLabel="Create Lead"
      />

      {/* Edit Modal */}
      <LeadFormModal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
        defaultValues={editingLead ?? undefined}
        title="Edit Lead"
        submitLabel="Save Changes"
      />
    </div>
  );
}
