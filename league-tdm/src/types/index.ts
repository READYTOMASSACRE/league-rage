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

export type VoteConfig = {
  timer: NodeJS.Timeout
  players: number[]
  result: Record<string, number>
}