import { Request, Response, NextFunction } from 'express';
import { Role } from '../../generated/prisma/client';
import { ApiError } from '../utils/ApiError';


export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' is not permitted to perform this action`
        )
      );
    }

    next();
  };
};