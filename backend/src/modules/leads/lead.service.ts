import { FilterQuery } from 'mongoose';
import Lead, { ILeadDocument } from '../../models/Lead';
import { ForbiddenError, NotFoundError } from '../../utils/AppError';
import { UserPayload, UserRole, PaginatedResponse } from '../../types';
import { CreateLeadInput, UpdateLeadInput, LeadQueryInput } from './lead.schemas';
import { env } from '../../config/env';

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const leadService = {
  async getLeads(
    query: LeadQueryInput,
    requestingUser: UserPayload
  ): Promise<PaginatedResponse<unknown>> {
    const { page, limit, status, source, search, sort } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ILeadDocument> = {};

    // Sales users can only see their own leads
    if (requestingUser.role === UserRole.Sales) {
      filter.createdBy = requestingUser.id;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'Leads fetched successfully',
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },

  async getLead(id: string, requestingUser: UserPayload) {
    const lead = await Lead.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) throw new NotFoundError('Lead not found');

    if (
      requestingUser.role === UserRole.Sales &&
      lead.createdBy.toString() !== requestingUser.id
    ) {
      throw new ForbiddenError();
    }

    return lead;
  },

  async createLead(input: CreateLeadInput, requestingUser: UserPayload) {
    const lead = await Lead.create({
      ...input,
      createdBy: requestingUser.id,
    });
    await lead.populate('createdBy', 'name email');
    return lead;
  },

  async updateLead(id: string, input: UpdateLeadInput, requestingUser: UserPayload) {
    const lead = await Lead.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');

    if (
      requestingUser.role === UserRole.Sales &&
      lead.createdBy.toString() !== requestingUser.id
    ) {
      throw new ForbiddenError();
    }

    const updated = await Lead.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    return updated;
  },

  async deleteLead(id: string) {
    const lead = await Lead.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');
    await Lead.findByIdAndDelete(id);
  },

  async exportCSV(query: Partial<LeadQueryInput>, requestingUser: UserPayload): Promise<string> {
    const filter: FilterQuery<ILeadDocument> = {};

    if (requestingUser.role === UserRole.Sales) {
      filter.createdBy = requestingUser.id;
    }

    if (query.status) filter.status = query.status;
    if (query.source) filter.source = query.source;
    if (query.search) {
      const regex = new RegExp(query.search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const leads = await Lead.find(filter)
      .populate<{ createdBy: { name: string } }>('createdBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const rows = [
      ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Created At'],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        lead.notes ?? '',
        typeof lead.createdBy === 'object' && lead.createdBy !== null
          ? (lead.createdBy as { name: string }).name
          : '',
        new Date(lead.createdAt).toLocaleDateString(),
      ]),
    ];

    return rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
  },

  async getStats(requestingUser: UserPayload): Promise<LeadStats> {
    const filter: FilterQuery<ILeadDocument> = {};
    if (requestingUser.role === UserRole.Sales) {
      filter.createdBy = requestingUser.id;
    }

    const [statusAgg, sourceAgg, total] = await Promise.all([
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(filter),
    ]);

    const byStatus = Object.fromEntries(
      statusAgg.map((s: { _id: string; count: number }) => [s._id, s.count])
    );
    const bySource = Object.fromEntries(
      sourceAgg.map((s: { _id: string; count: number }) => [s._id, s.count])
    );

    return { total, byStatus, bySource };
  },
};

// Keep env reference to avoid unused import warning
void env.pagination.defaultLimit;
