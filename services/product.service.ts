import { IRegisterPRoduct } from '../interfaces/Bugs'
import { logger } from '../shared/logger'
import HttpRequest from '../utils/HttpRequest'

class ProductService {
  constructor() {
    this.registerProduct = this.registerProduct.bind(this)
    this.getProduct = this.getProduct.bind(this)
  }
  async registerProduct(registerData: IRegisterPRoduct) {
    try {
      const postInstance = new HttpRequest({
        url: '/rest/product',
        method: 'post',
        headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
        data: registerData,
      })

      const response = await postInstance.send()

      return response
    } catch (error: any) {
      logger.error(error)
      return error
    }
  }

  async getProduct({ productId }: { productId: string }) {
    try {
      const postInstance = new HttpRequest({
        url: `/rest/product/${productId}`,
        method: 'get',
        headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
      })
      const response = await postInstance.send()

      return response
    } catch (error: any) {
      logger.error(error)
      return error
    }
  }
}

export default ProductService
