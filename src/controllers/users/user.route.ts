// user.route.js
import { NextFunction, Router } from 'express';
import { create } from './handlers/create.handler';
import { getList } from './handlers/getList.handler';

export class UserRoute {
  router: Router
  path: String
  constructor() {
    this.router = Router();
    this.path = 'users';

    this.router.get('/', getList);

    // still check if the user is authorized using middleware
    /** 
    const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
      if (req.header("x-auth") !== "api-key") {
        return res.status(401).send("Unauthorized");
      }
      next();
    };
    */
   
    this.router.post("/", create);
  }
}