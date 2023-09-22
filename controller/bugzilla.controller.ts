import { Response, Request } from 'express'
import { logger } from '../shared/logger'
import BugzillaBugService from '../services/bugzilla.service'
import TrudeskService from '../services/trudesk.service'


const BugService = new BugzillaBugService()
const Trudesk = new TrudeskService()


class BugsController {
  async createBug(req: Request, res: Response) {
    console.log('process.env.', process.env.SELECTED_ISSUE_CRM)
    let data
    if (process.env.SELECTED_ISSUE_CRM=='trudesk') {
      data = await Trudesk.createBug(req, res)
      logger.info('POST Trudesk Endpoint hit with: ' + req.body)
    }else{
      data = await BugService.createBug(req, res)
      logger.info('POST Bugzilla Endpoint hit with: ' + req.body)
    }
    
    return data
  }

  async getAllBug(req: Request, res: Response) {
    let data
    if (process.env.SELECTED_ISSUE_CRM=='trudesk') {
      data = await Trudesk.getBug(req, res)
      logger.info('POST Trudesk Endpoint hit with: ' + req.body)
    }else{
      data = await BugService.getBug(req, res)
    logger.info('POST Bugzilla Endpoint hit with: ' + req.body)
    }
    return data
  }

  async updateBug(req: Request, res: Response) {
    let data
    if (process.env.SELECTED_ISSUE_CRM=='trudesk') {
      data = await Trudesk.updateBug(req, res)
      logger.info('POST Trudesk Endpoint hit with: ' + req.body)
    }else{
      data = await BugService.updateBug(req, res)
      logger.info('Put Bugzilla Endpoint hit with: ' + JSON.stringify(req.body))
    }
    return data
  }

}

export default BugsController
