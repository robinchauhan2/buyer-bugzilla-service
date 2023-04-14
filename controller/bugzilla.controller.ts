
import { Response, Request } from 'express'
import { logger } from '../shared/logger'
import CreateBugService from '../services/bugzilla.service'

const create = new CreateBugService()

class CreateBugController {


        async createBug(req: Request, res: Response) {

                const data = await create.createBug(req, res)
                logger.info("POST Bugzilla Endpoint hit with: " + req.body)
                return data
        }

        async getAllBug(req: Request, res: Response) {

                const data = await create.getBug(req, res)
                logger.info("POST Bugzilla Endpoint hit with: " + req.body)
                return data
        }
        async updateBug(req: Request, res: Response) {

                const data = await create.updateBug(req, res)
                logger.info("POST Bugzilla Endpoint hit with: " + req.body)
                return data
        }

    
}


export default CreateBugController