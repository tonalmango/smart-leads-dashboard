import { useState } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Lead } from '@/types';
import { Badge } from '@/components/ui';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete?: (id: string) => void;
}

export default function LeadTable({ leads, onEdit, onDelete }: LeadTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {leads.map((lead) => (
            <>
              <tr
                key={lead._id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <td className="px-4 py-3">
                  <button
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                    onClick={() =>
                      setExpandedId(expandedId === lead._id ? null : lead._id)
                    }
                  >
                    {lead.name}
                    {expandedId === lead._id ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {lead.email}
                </td>
                <td className="px-4 py-3">
                  <Badge label={lead.status} variant="status" value={lead.status} />
                </td>
                <td className="px-4 py-3">
                  <Badge label={lead.source} variant="source" value={lead.source} />
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      aria-label="Edit lead"
                      title="Edit lead"
                    >
                      <Pencil size={14} />
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(lead._id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Delete lead"
                        title="Delete lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {expandedId === lead._id && (
                <tr
                  key={`${lead._id}-expanded`}
                  className="bg-blue-50/50 dark:bg-blue-900/10"
                >
                  <td colSpan={6} className="px-4 py-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Notes: </span>
                      {lead.notes ?? (
                        <span className="text-gray-400 italic">No notes</span>
                      )}
                    </p>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
