import { UserStore } from './user.store';
import { NextFunction, Request, Response } from 'express';

export const getList = async (req: Request, res: Response, next: NextFunction) => {
  const users = UserStore; // This should return the userlist
  res.json(users);
};

