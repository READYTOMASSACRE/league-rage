import { Enviroment } from "../types"

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

export const env = typeof (mp as any)?.game !== 'undefined' ? Enviroment.client : Enviroment.server