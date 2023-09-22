import { Request, Response } from 'express'
import axios from 'axios';
import { logger } from '../shared/logger'
import GetHttpRequest from '../utils/HttpRequest'


class TrudeskService {
  constructor() {
    this.createBug = this.createBug.bind(this)
    this.updateBug = this.updateBug.bind(this)
  }

  async addAttachments({ ticketId, data }: { ticketId: string; data: string }) {
    
    const fileData:any = await axios({
      url: data,
      method:'get'
    })
    const attachmentRequest = new GetHttpRequest({
      url: `/tickets/uploadattachment`,
      method: 'post',
      headers: {'CSRF-TOKEN': 'UbM2T5wy-4A1KH4zpFXqUqeXkJWSe6uPOSvo'},
      data: {
        ticketId:ticketId,
        attachment: fileData.data
    }})

    const attachmentResponse = await attachmentRequest.send()
    return attachmentResponse
  }

  async createBug(req: Request, res: Response) {
    console.log('req.body======================', JSON.stringify(req.body))
    try {
      // To fetch owner Id
      const ownerApi = new GetHttpRequest({
        url: '/api/v1/login',
        method: 'post',
        data: {
          username: process.env.TRUDESK_USERNAME,
          password: process.env.TRUDESK_PASSWORD
        },
      })
      const owner = await ownerApi.send()

      // To fetch group Id
      const fetchGroup = new GetHttpRequest({
        url: '/api/v1/groups/all',
        method: 'get',
        headers: {
          "accesstoken": owner?.data?.accessToken
        }
      })
      const group = await fetchGroup.send()
  
      // To fetch type and priority Id
      const fetchType = new GetHttpRequest({
        url: '/api/v1/tickets/types',
        method: 'get',
        headers: {
          "accesstoken": owner?.data?.accessToken
        }
      })
      const type = await fetchType.send()
  
      const createTicket = new GetHttpRequest({
          url: '/api/v1/tickets/create',
          method: 'post',
          data: {
              subject: req.body.product,
              issue: req.body.summary,
              owner: owner?.data?.user._id,
              group: group?.data?.groups[0]._id,
              type: type.data[0]?._id,
              priority: type.data[0]?.priorities[0]?._id,
              transaction_id: req.body.alias
          },
          headers: {
              "accesstoken": owner?.data?.accessToken
            }
        })
      const response = await createTicket.send()
      // console.log('req.body.attachments[0]', req.body.attachments[0])  
      // if (req.body.attachments && req.body.attachments?.length !== 0) {
      //   await this.addAttachments({
      //     ticketId: response?.data?._id,
      //     data: req.body.attachments[0],
      //   })
      // }

      const complaint_actions_merged = [...req.body.action.complainant_actions]

      const comment = `\nComplainant-Action: ${complaint_actions_merged[0].complainant_action}\nComplainant-Action-Description:  ${complaint_actions_merged[0].short_desc}\nAction Taken By: Complainant\nComplainant-Name: ${complaint_actions_merged[0].updated_by.person.name}\nAction Taken At:  ${complaint_actions_merged[0].updated_at}`

      await this.addComments({ _id: response.data.ticket._id, data: comment , accesstoken: owner?.data?.accessToken})  

      return res.status(201).json({ success: true, data: response.data, alias: response.data.transaction_id })
    } catch (error: any) {
      logger.error(error)
      return res.status(500).json({ error: true, message: error || 'Something went wrong' })
    }
  }


  sortByDate(array: any) {
    return array.sort((a: any, b: any) => {
      const dateA: any = new Date(a.updated_at)
      const dateB: any = new Date(b.updated_at)
      return dateA - dateB
    })
  }

  async addComments({ _id, data, accesstoken }: { _id: string; data: any, accesstoken: string }) {
    const addComment = new GetHttpRequest({
      url: `/api/v1/tickets/addcomment`,
      method: 'post',
      headers: {  "Content-Type": "application/json", 'accesstoken': accesstoken },
      data: {
        _id,
        comment: data,
        note:false,
        ticketid:false
      },
    })

    const commentResponse = await addComment.send()
    return commentResponse?.data
  }


  async getBug(req: Request, res: Response) {
    try {
      const ownerApi = new GetHttpRequest({
        url: '/api/v1/login',
        method: 'post',
        data: {
          username: process.env.TRUDESK_USERNAME,
          password: process.env.TRUDESK_PASSWORD
        },
      })
      const owner = await ownerApi.send()

      const getInstance = new GetHttpRequest({
        url: `/api/v1/ticketDetails/${req.params.id}`,
        method: 'get',
        headers: {  "Content-Type": "application/json", 'accesstoken': owner?.data?.accessToken },
      })

      const response = await getInstance.send()
      return res.status(200).json({ success: true, ticket: response?.data })
    } catch (error: any) {
      logger.error(error)
      return res.status(500).json({ error: true, message: error?.message || 'Something went wrong' })
    }
  }

  async updateBug(req: Request, res: Response) {
    const complaint_actions_merged = [...req.body.action.respondent_actions]

    try {
      // To fetch owner Id
        const ownerApi = new GetHttpRequest({
          url: '/api/v1/login',
          method: 'post',
          data: {
            username: process.env.TRUDESK_USERNAME,
            password: process.env.TRUDESK_PASSWORD
          },
        })
        const owner = await ownerApi.send()

        
      const getInstance = new GetHttpRequest({
        url: `/api/v1/ticketDetails/${req.params.id}`,
        method: 'get',
        headers: {  "Content-Type": "application/json", 'accesstoken': owner?.data?.accessToken },
      })

      const ticketDetails = await getInstance.send()

      const comment = `Respondent-Action: ${complaint_actions_merged[0].respondent_action}\nRespondent-Action-Description:  ${complaint_actions_merged[0].short_desc}\nAction Taken By: Respondent\nRespondent-Name: ${complaint_actions_merged[0].updated_by.person.name}\nAction Taken At:  ${complaint_actions_merged[0].updated_at}`

      const response = await this.addComments({ _id: ticketDetails.data.ticket._id, data: comment, accesstoken: owner?.data?.accessToken  })
      // const getInstance = new GetHttpRequest({
      //   url: `/rest/bug/${req.params.id}`,
      //   method: 'put',
      //   data: this.getStatus(req.body.status, latestCommit),
      //   headers: { 'X-BUGZILLA-API-KEY': process.env.BUGZILLA_API_KEY },
      // })

      // const response = await getInstance.send()

      return res.status(200).json({ success: true, data: response?.data })
    } catch (error: any) {
      logger.error(`error : ${error.message}`)
      return res.status(500).json({ error: true, message: error?.message || 'Something went wrong' })
    }
  }

  getStatus(status: string, comments: string) {
    switch (status) {
      case 'RESOLVED':
        return {
          status: 'RESOLVED',
          resolution: 'FIXED',
          comment: {
            body: comments,
          },
        }
      default:
        return {
          status: status,
          comment: {
            body: comments,
          },
        }
    }
  }
}

export default TrudeskService