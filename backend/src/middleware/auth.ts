import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Add user info to request object
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string }
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number; username: string };
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};