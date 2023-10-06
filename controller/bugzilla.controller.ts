import {  NextFunction } from 'express'
import MainService from '../services/main.service'

const mainservice = new MainService();

class BugsController {
  async createBug(req: any, res: any,next: NextFunction) {
    console.log('res', res)
    mainservice
    .createIssue(req , res)
    .then((response:any) => {
      res.json(response);
    })
    .catch((err:any) => {
      next(err);
    });
    
  }

  async getAllBug(req: any, res: any,next:NextFunction) {
    mainservice
    .getIssue(req , res)
    .then((response:any) => {
      res.json(response);
    })
    .catch((err:any) => {
      next(err);
    });
  }

  async updateBug(req: any, res: any, next:NextFunction) {
    mainservice
    .updateIssue(req , res)
    .then((response:any) => {
      res.json(response);
    })
    .catch((err:any) => {
      next(err);
    });
  }

}

export default BugsController
