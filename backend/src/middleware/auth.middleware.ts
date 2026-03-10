// Verifies the JWT from cookies and attaches the user to the request

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    (req as any).user = decoded; // Attach { userId, role } to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Session expired, please login again" });
  }
};