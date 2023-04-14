import { IUser } from '../interfaces/Bugs'

export const getUser = (): IUser => {
  return { name: 'Test User', age: 24, gender: 'male' }
}
