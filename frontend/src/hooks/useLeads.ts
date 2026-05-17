import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/lead.service';
import { LeadFilters, LeadFormData } from '@/types';
import { QUERY_KEYS } from '@/config/constants';
import toast from 'react-hot-toast';

export function useLeads(filters: Partial<LeadFilters>) {
  return useQuery({
    queryKey: [QUERY_KEYS.LEADS, filters],
    queryFn: () => leadService.getLeads(filters),
    placeholderData: (prev) => prev,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.LEAD, id],
    queryFn: () => leadService.getLead(id),
    enabled: !!id,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.STATS],
    queryFn: () => leadService.getStats(),
    staleTime: 60_000,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LeadFormData) => leadService.createLead(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEADS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
      toast.success('Lead created successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create lead');
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<LeadFormData> }) =>
      leadService.updateLead(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEADS] });
      toast.success('Lead updated successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update lead');
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEADS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
      toast.success('Lead deleted successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete lead');
    },
  });
}
