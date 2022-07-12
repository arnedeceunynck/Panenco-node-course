import { UserStore } from './user.store';
import { NextFunction, Request, Response } from 'express';

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const user = UserStore.get(req.body.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const updated = UserStore.update(req.body.id, req.body);
  res.json(updated);
};