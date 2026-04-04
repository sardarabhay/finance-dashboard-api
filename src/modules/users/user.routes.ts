import { Router } from 'express';
import * as userController from './user.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { updateUserSchema } from './user.schema';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getMe);

router.get('/', authorize('ADMIN'), userController.getAllUsers);
router.get('/:id', authorize('ADMIN'), userController.getUserById);
router.patch('/:id', authorize('ADMIN'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authorize('ADMIN'), userController.deleteUser);

export default router;