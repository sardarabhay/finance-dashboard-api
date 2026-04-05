import { Router } from 'express';
import * as recordController from './record.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema } from './record.schema';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/records:
 *   get:
 *     summary: List financial records with optional filters
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of records
 *       401:
 *         description: Unauthorized
 */
router.get('/', authorize('VIEWER', 'ANALYST', 'ADMIN'), recordController.getRecords);

/**
 * @swagger
 * /api/v1/records/{id}:
 *   get:
 *     summary: Get a single record by ID
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record found
 *       404:
 *         description: Record not found
 */
router.get('/:id', authorize('VIEWER', 'ANALYST', 'ADMIN'), recordController.getRecordById);

/**
 * @swagger
 * /api/v1/records:
 *   post:
 *     summary: Create a new financial record (ADMIN only)
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-01T00:00:00.000Z"
 *               notes:
 *                 type: string
 *                 example: January salary
 *     responses:
 *       201:
 *         description: Record created
 *       403:
 *         description: Forbidden
 */
router.post('/', authorize('ADMIN'), validate(createRecordSchema), recordController.createRecord);

/**
 * @swagger
 * /api/v1/records/{id}:
 *   patch:
 *     summary: Update a record (ADMIN only)
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.patch('/:id', authorize('ADMIN'), validate(updateRecordSchema), recordController.updateRecord);

/**
 * @swagger
 * /api/v1/records/{id}:
 *   delete:
 *     summary: Soft delete a record (ADMIN only)
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.delete('/:id', authorize('ADMIN'), recordController.deleteRecord);

export default router;