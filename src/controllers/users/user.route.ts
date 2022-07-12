// user.route.js
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Router, Request, Response } from 'express';
import { UserBody } from '../../contracts/user.body';
import { UserView } from '../../contracts/user.view';
import { create } from './handlers/create.handler';
import { getList } from './handlers/getList.handler';
import { update } from './handlers/update.handler';

export class UserRoute {
  router: Router
  path: String
  constructor() {
    this.router = Router();
    this.router.patch(
      '/:id',
      // first transform and validate
      patchValidationMiddleware,
      // handle actual logic
      update,
      // finally transform the output
      representationMiddleware
    );
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
const patchValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const transformed = plainToInstance(UserBody, req.body, {
    // undefined properties not taken into account
    exposeUnsetFields: false,
  });
  const validationErrors = await validate(transformed, {
    // missing properties not validated -> we wouldn't want this when creating an entity for example
    skipMissingProperties: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  if (validationErrors.length) {
    return next(validationErrors);
  }
  req.body = transformed;
  next();
};

const representationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const transformed = plainToInstance(UserView, res.locals.body); // Note the use of res.locals here. Locals is a way to transport data from one middleware to another.
  res.json(transformed);
};