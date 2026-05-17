import { Response } from 'express';
import { leadService } from './lead.service';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { AuthRequest } from '../../types';
import { CreateLeadInput, UpdateLeadInput, LeadQueryInput } from './lead.schemas';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const query = req.query as unknown as LeadQueryInput;
  const result = await leadService.getLeads(query, req.user!);
  sendPaginated(res, result.message, result.data, result.pagination);
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await leadService.getLead(req.params.id, req.user!);
  sendSuccess(res, 'Lead fetched successfully', lead);
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await leadService.createLead(req.body as CreateLeadInput, req.user!);
  sendSuccess(res, 'Lead created successfully', lead, 201);
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await leadService.updateLead(req.params.id, req.body as UpdateLeadInput, req.user!);
  sendSuccess(res, 'Lead updated successfully', lead);
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  await leadService.deleteLead(req.params.id);
  sendSuccess(res, 'Lead deleted successfully');
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  const query = req.query as unknown as Partial<LeadQueryInput>;
  const csvContent = await leadService.exportCSV(query, req.user!);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.status(200).send(csvContent);
};

export const getLeadStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const stats = await leadService.getStats(req.user!);
  sendSuccess(res, 'Stats fetched successfully', stats);
};
