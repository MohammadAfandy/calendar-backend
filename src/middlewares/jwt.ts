import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../configs/config';
import { UnauthorizedError } from '../configs/error';

export default async function (req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedError();
    const decoded = await jwt.verify(token, config.appSecret) as Record<any, Record<any, string>>;
    req.token = {
      token,
      _userId: decoded.user._id,
      username: decoded.user.username,
      fullname: decoded.user.fullname,
      email: decoded.user.email,
    };
    next();
  } catch(error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError(error.message));
    } else {
      next(error);
    }
  }
}
