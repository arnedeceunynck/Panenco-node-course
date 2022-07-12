import express, { Application } from 'express';
import { UserRoute } from './controllers/users/user.route';

export class App {
  static host: Application
  
  constructor() {
    
    // Init server
    this.host = express();
    this.host.use(express.json());
    this.host.get('/', (req, res, next) => {
        res.send('Hello World!');
      });
    const usersRoute = new UserRoute();
    this.host.use((req, res, next) => {
      console.log(req.method, req.url);
      next();
    });
    this.host.use((req, res, next) => {
      res.status(404).send('No Endpoint found');
    });
    this.host.use(`/api/${usersRoute.path}`, usersRoute.router);
    // app.js
    this.host.use((error, req, res, next) => {
      res.status(400).json(error);
    }); 
  }

  listen() {
    this.host.listen(3000, () => {
      console.info(`🚀 http://localhost:3000`);
      console.info(`========================`);
    });
  }
}