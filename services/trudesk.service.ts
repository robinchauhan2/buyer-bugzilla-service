import { Request, Response } from 'express'
import { logger } from '../shared/logger'
import GetHttpRequest from '../utils/HttpRequest'
import axios from 'axios'


class TrudeskService {
  constructor() {
    this.createBug = this.createBug.bind(this)
    this.updateBug = this.updateBug.bind(this)
  }

  async addAttachments({ ticketId, data, ownerId }: { ticketId: string; data: string, ownerId: string }) {

    const attachmentRequest = new GetHttpRequest({
      url: `/tickets/attachment`,
      method: 'post',
      data: {
        ticketId,
        ownerId,
        attachment: data
    }})
    console.log('attachmentRequest', attachmentRequest)

    const attachmentResponse = await attachmentRequest.send()
    console.log('first================', attachmentResponse)
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

      // To save the issue 
      const { issues } = req.body
      console.log('issues==>', issues)
      const saveIssue = new GetHttpRequest({
          url: '/api/v1/issue/save',
          method: 'post',
          data: {
            ...issues
          },
          headers: {
            "accesstoken": owner?.data?.accessToken
          }
      })
      const saveIssues = await saveIssue.send()
      console.log('saveIssues', saveIssues)

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
              subject: `${req.body.product} || ${req.body.issue_desc}`,
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
      if (req.body.attachments && req.body.attachments?.length !== 0) {
        console.log('req.body.attachments[0]', req.body.attachments)  
        req.body.attachments.map(async (element:any,index:number)=>{
          console.log('element', element)
          console.log('index', index)
          await this.addAttachments({
            ownerId: owner?.data?.user._id,
            ticketId: response?.data?.ticket?._id,
            data: req.body.attachments[index],
          })
        })
        
      }

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
    console.log('updateBug')
    let complaint_actions_merged
   if(req.body.action.respondent_actions){
    complaint_actions_merged = [...req.body.action.respondent_actions]
   }else{
    complaint_actions_merged = [...req.body.action.complainant_actions]
   }
     
    console.log('complaint_actions_merged', JSON.stringify(complaint_actions_merged))
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
      const commentsArr = ticketDetails.data.ticket.comments.map( (elem: any) => elem.comment ).filter((elem:any) => elem.includes('Action Taken At'))
      console.log('commentArr------', commentsArr)
      const lastComment = commentsArr[commentsArr.length-1].replace('<p>', '').replace('</p>', '').split('<br>')
      const updateAt = lastComment[lastComment.length-1].split(":").slice(1).join(":").trim()
      console.log('updateAt================', updateAt)

      const latestIssueAction = complaint_actions_merged.reduce((last, current) => {
      if (current.updated_at > last.updated_at) {
        return current
      }
      return last
    })
    console.log('latestIssueAction', latestIssueAction.updated_at)
    const comment = this.generateTheCommentFromObject(latestIssueAction)
    let response
    if(updateAt !== latestIssueAction.updated_at){
       response = await this.addComments({ _id: ticketDetails.data.ticket._id, data: comment, accesstoken: owner?.data?.accessToken  })
    }
    const ticketId = ticketDetails.data.ticket._id

    

    if(latestIssueAction?.complainant_action === "ESCALATE"){
       // To fetch types
       const fetchType = new GetHttpRequest({
        url: '/api/v1/tickets/types',
        method: 'get',
        headers: {
          "accesstoken": owner?.data?.accessToken
        }
      })
      const type = await fetchType.send()
      console.log('type?.data============', type?.data)
      const grievanceTypeid = type?.data.filter((ele:any)=> ele.name === "Grievance")
      console.log('grievanceTypeid', grievanceTypeid[0]?._id)
      const grievedata = await axios({
        baseURL:`http://trudesk-dev-service:8118/api/v1/tickets/tickettype/${ticketId}`,
        method: 'put',
        data: {"type": grievanceTypeid[0]?._id},
        headers: { 'accesstoken': owner?.data?.accessToken },
      })
     // const grievedata = await getInstance.send();  
      console.log('grievedata', grievedata.data)
    }

    if(latestIssueAction.complainant_action === "CLOSE"){
      // To fetch statuses
      const fetchStatus = new GetHttpRequest({
        url: '/api/v1/tickets/status',
        method: 'get',
        headers: {
          "accesstoken": owner?.data?.accessToken
        }
      })
      const status = await fetchStatus.send()
      console.log('first', status)
      const closedStatusid = status?.data?.status.filter((ele:any) => ele.name === "Closed")

      console.log('closedStatusid===========', closedStatusid[0]?._id)
      const closed = await axios({
      baseURL:`http://trudesk-dev-service:8118/api/v1/tickets/${ticketId}`,
      method: 'put',
      data: {"status": closedStatusid[0]?._id},
      headers: { 'accesstoken': owner?.data?.accessToken },
    })
    console.log('closed', closed)
  }

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

  generateTheCommentFromObject(item: any) {
    const keys = Object.keys(item)
    if(keys.includes('complainant_action')){
      return `\nComplainant-Action: ${item.complainant_action}\nComplainant-Action-Description:  ${item.short_desc}\nAction Taken By: Complainant\nComplainant-Name: ${item.updated_by.person.name}\nAction Taken At:  ${item.updated_at}`
    }
    else if(keys.includes('respondent_action'))
    {
      return `\nRespondent-Action: ${item.respondent_action}\nRespondent-Action-Description:  ${item.short_desc}\nAction Taken By: Respondent\nRespondent-Name: ${item.updated_by.person.name}\nAction Taken At:  ${item.updated_at}`
    }
    else {
      return '';
    }
  }

}

export default TrudeskService
