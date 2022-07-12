import { UserStore } from './user.store';
import { NextFunction, Request, Response } from 'express';


export const get = async (req: Request, res: Response, next: NextFunction) => {
  const user = UserStore.get(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
};