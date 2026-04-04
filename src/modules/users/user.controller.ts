import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.json(ApiResponse.ok(users));
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(ApiResponse.ok(user));
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUser = req.user!;
    const user = await userService.getUserById(authUser.id);
    res.json(ApiResponse.ok(user));
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(ApiResponse.ok(user, 'User updated'));
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUser = req.user!;
    if (req.params.id === authUser.id) {
      throw new Error('Cannot deactivate your own account');
    }
    await userService.deleteUser(req.params.id);
    res.json(ApiResponse.ok(null, 'User deactivated'));
  } catch (err) {
    next(err);
  }
};