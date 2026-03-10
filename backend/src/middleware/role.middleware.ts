// Restricts access based on the User Role.

import { Request, Response, NextFunction } from 'express';

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};