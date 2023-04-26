import { IComponents } from '../interfaces/Bugs'
import { logger } from '../shared/logger'
import HttpRequest from '../utils/HttpRequest'

class ComponentService {

  constructor() {
    this.createComponent = this.createComponent.bind(this)
  }

  async createComponent(componentData: IComponents) {
    try {
      const createComponentInstance = new HttpRequest({
        url: '/rest/component',
        method: 'post',
        headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
        data: componentData,
      })

      const response = await createComponentInstance.send()
      
      return response
    } catch (error: any) {
      logger.error(error)
      return error
    }
  }
}
export default ComponentService