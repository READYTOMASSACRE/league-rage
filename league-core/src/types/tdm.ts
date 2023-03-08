import { Point2d, Point3d } from "./common"

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

export enum WeaponState {
  idle = 'idle',
  has = 'has',
}

export type Arena = {
  id: number
  code: string
  area: Point2d[]
  [Team.attackers]: Point3d[]
  [Team.defenders]: Point3d[]
  [Team.spectators]: Point3d[]
}

export type TeamConfig = {
  [key in Team]: {
    name: string
    color: string
    skins: string[]
  }
}

export type RoundConfig = {
  prepare: number
  timeleft: number
}

export type VoteConfig = {
  arena: 30
}