import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.registerUser(name, email, password, role);
    res.status(201).json(ApiResponse.ok(user, 'User registered successfully'));
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(ApiResponse.ok(result, 'Login successful'));
  } catch (err) {
    next(err);
  }
};