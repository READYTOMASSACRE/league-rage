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
export const randRange = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min
export const decorate = (arg: any): string => {
  try {
    if (typeof arg === 'boolean') return arg ? 'true' : 'false'
    if (typeof arg === 'undefined') return 'undefined'
    if (isEntity(arg)) return `${arg.type}_${arg.id}`
    if (typeof arg === 'object') return JSON.stringify(arg)
  
    return arg
  } catch (err) {
    mp.console.logError(err.stack)
  }
}
export const hexregex = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi
export const rgabregex = /^(?:rgba?)?[\s]?[\(]?[\s+]?(\d+)[(\s)|(,)]+[\s+]?(\d+)[(\s)|(,)]+[\s+]?(\d+)[(\s)|(,)]+[\s+]?([0-1]?(?:\.\d+)?)$/
export const deepclone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
export const toColor = (color: any, defaultColor: string = 'white') => (
  typeof color === 'string' && (
    color.match(hexregex) || color.match(rgabregex)
  ) ?
    color :
    defaultColor
)
export const hex2rgba = (hex: string, alpha = 255): [number, number, number, number] => {
  const matched = hex.match(/\w\w/g)
  if (!matched) throw new Error("Invalid hex")

  const [r, g, b] = matched.map(x => parseInt(x, 16))

  return [r, g, b, alpha]
}

/**
 * Calculate the gradient by fadeFraction range [0...1]
 */
export const colorGradient = (fadeFraction: number, color1: [number, number, number], color2: [number, number, number]) => {
  const diffRed   = color2[0] - color1[0]
  const diffGreen = color2[1] - color1[1]
  const diffBlue  = color2[2] - color1[2]

  return [
    Math.floor(color1[0] + (diffRed * fadeFraction)),
    Math.floor(color1[1] + (diffGreen * fadeFraction)),
    Math.floor(color1[2] + (diffBlue * fadeFraction)),
  ]
}

export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export { throttle }