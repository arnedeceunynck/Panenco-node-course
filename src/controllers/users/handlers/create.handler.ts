import { UserStore } from './user.store';
import { NextFunction, Request, Response } from 'express';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name) {
    // Set the status of the response and send the error message
    return res.status(400).json({
      error: 'name is required',
    });
    // We don't want to continue if the name is missing. So we return here.
  }
  const user = UserStore.add(req.body);
  res.json(user);
};