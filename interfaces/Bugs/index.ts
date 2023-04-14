
export type priority = "Enhancement" | "Normal" | "Minor" | "Major" | "Blocker" | "Critical" | "Trival"


export interface ICreateBug {
  product: string,
  component: string,
  version: string,
  summary: string,
  alias: string,
  op_sys: string,
  rep_platform: string
}
