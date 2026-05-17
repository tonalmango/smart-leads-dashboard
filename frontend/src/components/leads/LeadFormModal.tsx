import Modal from '@/components/ui/Modal';
import LeadForm from './LeadForm';
import { Lead, LeadFormData } from '@/types';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading: boolean;
  defaultValues?: Partial<Lead>;
  title: string;
  submitLabel: string;
}

export default function LeadFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  defaultValues,
  title,
  submitLabel,
}: LeadFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {isOpen && (
        <LeadForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          defaultValues={defaultValues}
          submitLabel={submitLabel}
        />
      )}
    </Modal>
  );
}
