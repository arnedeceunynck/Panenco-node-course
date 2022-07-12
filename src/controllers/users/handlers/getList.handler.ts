import { UserStore } from './user.store';
import { NextFunction, Request, Response } from 'express';

export const getList = async (req: Request, res: Response, next: NextFunction) => {
  const users = UserStore.find(req.query.search);
  res.json(users);
};

