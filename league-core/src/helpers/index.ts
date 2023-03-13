import { Enviroment } from "../types"
import throttle from "./throttle"

export const env = typeof (mp as any)?.game !== 'undefined' ? Enviroment.client : Enviroment.server
export const toMs = (seconds: number) => seconds * 1000
export const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, toMs(s)))
export const isEntity = (s: any): s is any => Boolean(s?.type)
export const toId = (e: any): number => {
  if (!isEntity(e)) throw new Error('Invalid type of parameter ' + e)

  return e.id
}

export const rand = (max: number): number => Math.floor(Math.random() * Math.floor(max))
export const decorate = (arg: any): string => {
  if (typeof arg ==='undefined') return 'undefined'
  if (isEntity(arg)) return `${arg.type}_${arg.id}`
  if (typeof arg === 'object') return JSON.stringify(arg)

  return arg
}
export const hexregex = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi
export const rgabregex = /^(?:rgba?)?[\s]?[\(]?[\s+]?(\d+)[(\s)|(,)]+[\s+]?(\d+)[(\s)|(,)]+[\s+]?(\d+)[(\s)|(,)]+[\s+]?([0-1]?(?:\.\d+)?)$/
export const deepclone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

export { throttle }