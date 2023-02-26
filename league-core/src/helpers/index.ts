export const toMs = (seconds: number) => seconds * 1000
export const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, toMs(s)))
export const isEntity = (s: any): s is any => Boolean(s?.type)
export const toId = (e: any): number => {
  if (!isEntity(e)) throw new Error('Invalid type of parameter ' + e)

  return e.id
}

export const rand = (max: number): number => Math.floor(Math.random() * Math.floor(max))
export const env = typeof mp?.game !== 'undefined' ? Core.Enviroment.client : Core.Enviroment.server