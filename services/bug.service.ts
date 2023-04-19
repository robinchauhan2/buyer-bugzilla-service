import { ICreateBug } from 'interfaces/Bugs'
import { logger } from 'shared/logger'
import { CreateBugSchemaValidator } from 'utils/validator'
import HttpRequest from '../utils/HttpRequest'
import { Request, Response } from 'express'

class CreateBugService {
  async createBug(req: Request, res: Response) {
    const data: ICreateBug = {
      productName: req.body.product,
      component: 'Components',
      version: '1',
      summary: req.body.bugSummary,
      alias: req.body.alias,
      op_sys: 'Windows 10',
      rep_platform: 'Windows',
      bpp_id: req.body.bpp_id,
      bpp_name: req.body.bpp_name,
    }

    try {
      const error = CreateBugSchemaValidator(data)

      if (error) throw new Error(`Invalid payload:${error}`)
      logger.info('Hitting')

      const postInstance = new HttpRequest({
        url: '/rest/bug',
        method: 'post',
        headers: { 'X-BUGZILLA-API-KEY': process.env.API_KEY },
        data: data,
      })

      const response = await postInstance.send()

      return res.status(201).json({ success: true, data: response?.data })
    } catch (error: any) {
      console.log(error)
      logger.error(error)
      return res.status(500).json({ error: true, message: error || 'Something went wrong' })
    }
  }

  async getBug(req: Request, res: Response) {
    try {
      const getInstance = new HttpRequest({
        url: `/rest/bug?id=${req.params.id}`,
        method: 'get',
        headers: { 'X-BUGZILLA-API-KEY': process.env.API_KEY },
      })

      const response = await getInstance.send()

      return res.status(200).json({ success: true, data: response?.data })
    } catch (error: any) {
      logger.error(error)
      return res.status(500).json({ error: true, message: error?.message || 'Something went wrong' })
    }
  }

  async updateBug(req: Request, res: Response) {
    const data: ICreateBug = {
      productName: req.body.product,
      component: req.body.component,
      version: req.body.version,
      summary: req.body.summary,
      alias: req.body.alias,
      op_sys: req.body.op_sys,
      rep_platform: req.body.rep_platform,
      bpp_id: req.body.bpp_id,
      bpp_name: req.body.bpp_name,
    }
    try {
      console.log('datadatadatadatadatadata', data, req.params.id)

      const getInstance = new HttpRequest({
        url: `/rest/bug/${req.params.id}`,
        method: 'put',
        data: { status: req.body.status },
        headers: { 'X-BUGZILLA-API-KEY': process.env.API_KEY },
      })

      const response = await getInstance.send()

      return res.status(200).json({ success: true, data: response?.data })
    } catch (error: any) {
      logger.error(error)
      return res.status(500).json({ error: true, message: error?.message || 'Something went wrong' })
    }
  }
}

export default CreateBugService
