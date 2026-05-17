import apiClient from './apiClient';
import { Lead, LeadFilters, LeadFormData, PaginatedResponse, ApiResponse, LeadStats } from '@/types';

export const leadService = {
  getLeads: async (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort)   params.set('sort',   filters.sort);

    const { data } = await apiClient.get<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
    return data;
  },

  getLead: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data;
  },

  createLead: async (payload: LeadFormData) => {
    const { data } = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
    return data;
  },

  updateLead: async (id: string, payload: Partial<LeadFormData>) => {
    const { data } = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return data;
  },

  deleteLead: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse>(`/leads/${id}`);
    return data;
  },

  getStats: async () => {
    const { data } = await apiClient.get<ApiResponse<LeadStats>>('/leads/stats');
    return data;
  },

  exportCSV: async (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);

    const response = await apiClient.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
