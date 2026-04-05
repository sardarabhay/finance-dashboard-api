import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/dashboard/summary:
 *   get:
 *     summary: Get total income, expenses and net balance
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Financial summary
 *
 * /api/v1/dashboard/recent:
 *   get:
 *     summary: Get 5 most recent financial records
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Recent activity
 *
 * /api/v1/dashboard/categories:
 *   get:
 *     summary: Get totals grouped by category (ANALYST, ADMIN)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Category breakdown
 *       403:
 *         description: Forbidden
 *
 * /api/v1/dashboard/trends:
 *   get:
 *     summary: Get monthly income and expense trends (ANALYST, ADMIN)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Monthly trends for last 6 months
 *       403:
 *         description: Forbidden
 */
router.get('/summary', authorize('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getSummary);
router.get('/recent', authorize('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getRecentActivity);
router.get('/categories', authorize('ANALYST', 'ADMIN'), dashboardController.getCategoryBreakdown);
router.get('/trends', authorize('ANALYST', 'ADMIN'), dashboardController.getMonthlyTrends);

export default router;