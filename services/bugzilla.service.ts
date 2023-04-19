import { Request, Response } from 'express'
import { ICreateBug } from '../interfaces/Bugs'
// import { CreateBugSchemaValidator } from '../utils/validator'
import { logger } from '../shared/logger'
import GetHttpRequest from '../utils/HttpRequest'
import ProductService from './product.service'
import UserService from './user.service'
import ComponentService from './component.service'

const productService = new ProductService()
const userService = new UserService()
const componentService = new ComponentService()

class BugzillaBugService {
  constructor() {
    this.createBug = this.createBug.bind(this)
    this.updateBug = this.updateBug.bind(this)
  }

  async createBug(req: Request, res: Response) {
    let isProductExist: boolean = false

    const data: ICreateBug = {
      product: req.body.product,
      component: req.body.component,
      version: 'unspecified',
      summary: req.body.summary,
      alias: req.body.alias,
      op_sys: 'ALL',
      rep_platform: 'ALL',
      bpp_id: req.body.bpp_id,
      bpp_name: req.body.bpp_name,
    }

    try {
      //   const error = CreateBugSchemaValidator(data)

      //   if (error) throw new Error(`Invalid payload:${error}`)
      //   logger.info('Hitting')

      userService.getUser({ userId: data.bpp_id }).then(async (value) => {
        console.log('🚀 ~ file: bugzilla.service.ts:42 ~ BugzillaBugService ~ userService.getUser ~ value:', value)

        if (!value?.data?.users[0]) {
          console.log('inside if')
          const finalReg = await userService.createUser({
            email: `${data.bpp_name.trim().toLowerCase().replace(/\s/g, '')}@example.com`,
            full_name: data.bpp_name,
            login: data.bpp_id,
          })
          console.log(
            '🚀 ~ file: bugzilla.service.ts:50 ~ BugzillaBugService ~ userService.getUser ~ finalReg:',
            finalReg,
          )
        }
      })

      const serviceRes = await productService.getProduct({
        productId: `${data.product.toLowerCase().replace(/\s/g, '')}`,
      })

      if (serviceRes?.data?.products[0]?.id) {
        isProductExist = true
      }

      if (!isProductExist) {
        console.log('into isProductExist', !isProductExist)

        productService
          .registerProduct({
            name: data.product.replace(/\s/g, '').toLowerCase(),
            description: data.summary,
            is_open: true,
            has_unconfirmed: true,
            version: 'Unspecified',
            component: data.bpp_id,
          })
          .then(async (value: any) => {
            console.log('🚀 ~ file: bugzilla.service.ts:78 ~ BugzillaBugService ~ .then ~ value:', value)
            componentService
              .createComponent({
                default_assignee: data.bpp_id,
                description: 'Contact details',
                name: data.bpp_id,
                product: data.product.replace(/\s/g, '').toLowerCase(),
              })
              .then((component) => {
                console.log('🚀 ~ file: bugzilla.service.ts:86 ~ BugzillaBugService ~ .then ~ component:', component)
              })
          })
      }

      componentService
        .createComponent({
          default_assignee: data.bpp_id,
          description: 'Contact details',
          name: data.bpp_id,
          product: data.product.replace(/\s/g, '').toLowerCase(),
        })
        .then((component) => {
          console.log('🚀 ~ file: bugzilla.service.ts:86 ~ BugzillaBugService ~ .then ~ component:', component)
        })

      const createBug = new GetHttpRequest({
        url: '/rest/bug',
        method: 'post',
        headers: { 'X-BUGZILLA-API-KEY': process.env.API_KEY },
        data: {
          product: data.product.toLowerCase().replace(/\s/g, ''),
          description: data.summary,
          classification: 'Unclassified',
          summary: data.summary,
          component: data.bpp_id,
          version: 'unspecified',
          op_sys: data.op_sys,
          rep_platform: data.rep_platform,
          alias: data.alias,
        },
      })

      const response: any = await setTimeout(() => {
        createBug.send()
      }, 1000)

      return res.status(201).json({ success: true, data: response?.data, alias: data.alias })
    } catch (error: any) {
      logger.error(error)
      return res.status(500).json({ error: true, message: error || 'Something went wrong' })
    }
  }

  async getBug(req: Request, res: Response) {
    try {
      const getInstance = new GetHttpRequest({
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
    try {
      const getInstance = new GetHttpRequest({
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

export default BugzillaBugService
