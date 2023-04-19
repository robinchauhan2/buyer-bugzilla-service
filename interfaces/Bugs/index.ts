export type priority = 'Enhancement' | 'Normal' | 'Minor' | 'Major' | 'Blocker' | 'Critical' | 'Trival'

export interface ICreateBug {
  productName: string
  component: string
  version: string
  summary: string
  alias: string
  op_sys: string
  rep_platform: string
  bpp_id: string
  bpp_name: string
}

export interface ICreateUser {
  email: string
  full_name: string
  login: string
}

export interface IRegisterPRoduct {
  name: string
  description: string
  version: string
}
