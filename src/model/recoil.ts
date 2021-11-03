import jwt_decode from 'jwt-decode'
import { atom } from 'recoil'

export type JWT = {
  userId: string
  iat: number
  exp: number
}

const jwt = globalThis.sessionStorage?.getItem('jwt')

export const currentUserIdAtom = atom({
  key: 'currentUserIdAtom',
  default: jwt ? jwt_decode<JWT>(jwt).userId : '',
})
