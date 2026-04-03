import { Router } from 'express';
import * as recordController from './record.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema } from './record.schema';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize('VIEWER', 'ANALYST', 'ADMIN'),
  recordController.getRecords
);

router.get(
  '/:id',
  authorize('VIEWER', 'ANALYST', 'ADMIN'),
  recordController.getRecordById
);

router.post(
  '/',
  authorize('ADMIN'),
  validate(createRecordSchema),
  recordController.createRecord
);

router.patch(
  '/:id',
  authorize('ADMIN'),
  validate(updateRecordSchema),
  recordController.updateRecord
);

router.delete(
  '/:id',
  authorize('ADMIN'),
  recordController.deleteRecord
);

export default router;