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
  idle = 'idle',
  alive = 'alive',
  dead = 'dead',
  spectate = 'spectate',
  select = 'select',
}

export type Point2d = [number,number]
export type Point3d = [number,number,number]

export type ArenaConfig = {
  id: number
  code: string
  area: Point2d[]
  [Team.attackers]: Point3d[]
  [Team.defenders]: Point3d[]
  [Team.spectators]: Point3d[]
}