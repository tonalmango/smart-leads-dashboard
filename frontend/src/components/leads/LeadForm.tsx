import { useForm } from 'react-hook-form';
import { LeadFormData, LeadStatus, LeadSource, Lead } from '@/types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/config/constants';
import { Spinner } from '@/components/ui';

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void | Promise<void>;
  isLoading: boolean;
  defaultValues?: Partial<Lead>;
  submitLabel?: string;
}

export default function LeadForm({
  onSubmit,
  isLoading,
  defaultValues,
  submitLabel = 'Save Lead',
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    defaultValues: {
      name:   defaultValues?.name   ?? '',
      email:  defaultValues?.email  ?? '',
      status: defaultValues?.status ?? LeadStatus.New,
      source: defaultValues?.source ?? LeadSource.Website,
      notes:  defaultValues?.notes  ?? '',
    },
  });

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4" noValidate>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Jane Smith"
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="input-field"
          placeholder="jane@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
          })}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Status & Source */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select className="input-field" {...register('status')}>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source <span className="text-red-500">*</span>
          </label>
          <select
            className="input-field"
            {...register('source', { required: 'Source is required' })}
          >
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.source && (
            <p className="mt-1 text-xs text-red-500">{errors.source.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Optional notes about this lead…"
          {...register('notes', {
            maxLength: { value: 500, message: 'Notes cannot exceed 500 characters' },
          })}
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary w-full justify-center"
        disabled={isLoading}
      >
        {isLoading && <Spinner className="w-4 h-4" />}
        {submitLabel}
      </button>
    </form>
  );
}
