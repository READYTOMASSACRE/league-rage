export type ctor<T = {}> = new (...args: any[]) => T;
export type callable = (...args: any[]) => any
export enum Enviroment {
  client = 'client',
  server = 'server'
}