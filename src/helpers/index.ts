export const env = typeof (mp as any).game !== 'undefined' ? Enviroment.client : Enviroment.server
export const toMs = (seconds: number) => seconds * 1000
export const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, toMs(s)))