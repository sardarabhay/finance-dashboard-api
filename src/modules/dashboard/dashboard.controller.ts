import { Request, Response, NextFunction } from 'express';
import * as dashboardService from './dashboard.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const getSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getSummary();
    res.json(ApiResponse.ok(data));
  } catch (err) {
    next(err);
  }
};

export const getCategoryBreakdown = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    res.json(ApiResponse.ok(data));
  } catch (err) {
    next(err);
  }
};

export const getMonthlyTrends = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getMonthlyTrends();
    res.json(ApiResponse.ok(data));
  } catch (err) {
    next(err);
  }
};

export const getRecentActivity = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getRecentActivity();
    res.json(ApiResponse.ok(data));
  } catch (err) {
    next(err);
  }
};