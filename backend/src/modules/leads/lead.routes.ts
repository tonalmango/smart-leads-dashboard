import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from './lead.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createLeadSchema,
  updateLeadSchema,
  leadIdParamSchema,
  leadQuerySchema,
} from './lead.schemas';
import { asyncHandler } from '../../utils/asyncHandler';
import { UserRole } from '../../types';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', validate(leadQuerySchema, 'query'), asyncHandler(getLeads));
router.get('/stats', asyncHandler(getLeadStats));
// Admin-only: export CSV
router.get('/export', authorize(UserRole.Admin), asyncHandler(exportLeadsCSV));
router.get('/:id', validate(leadIdParamSchema, 'params'), asyncHandler(getLead));
router.post('/', validate(createLeadSchema), asyncHandler(createLead));
router.put(
  '/:id',
  validate(leadIdParamSchema, 'params'),
  validate(updateLeadSchema),
  asyncHandler(updateLead)
);
// Admin-only: delete lead
router.delete('/:id', authorize(UserRole.Admin), asyncHandler(deleteLead));

export default router;
