import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import recordRoutes from '../modules/records/record.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

export const rootRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/records', recordRoutes);
rootRouter.use('/dashboard', dashboardRoutes);