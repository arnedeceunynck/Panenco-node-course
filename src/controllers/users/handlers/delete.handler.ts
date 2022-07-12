import { UserStore } from './user.store';
import { NextFunction, Request, Response } from 'express';


export const deleteUser = async (req: Request, res: Response, next:) => {
  const user = UserStore.get(req.params.id);
  
  // Duplicated in multiple places for now. This will be refactored later.
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  UserStore.delete(req.params.id);
  res.status(204);
};
