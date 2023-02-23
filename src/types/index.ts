export type ctor<T = {}> = new (...args: any[]) => T;
export type callable = (...args: any[]) => any
export enum Enviroment {
  client = 'client',
  server = 'server'
}
export enum Team {
  attackers = 'attackers',
  defenders = 'defenders',
  spectators = 'spectators'
}
export enum State {
  ready = 'ready',
  alive = 'alive',
  dead = 'dead',
  spectate = 'spectate'
}