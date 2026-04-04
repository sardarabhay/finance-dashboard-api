import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/summary', authorize('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getSummary);
router.get('/recent', authorize('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getRecentActivity);
router.get('/categories', authorize('ANALYST', 'ADMIN'), dashboardController.getCategoryBreakdown);
router.get('/trends', authorize('ANALYST', 'ADMIN'), dashboardController.getMonthlyTrends);

export default router;