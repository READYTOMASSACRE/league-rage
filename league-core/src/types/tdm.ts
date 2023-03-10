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

export enum RoundState {
  prepare = 'prepare',
  running = 'running',
  stopped = 'stopped',
  paused = 'paused',
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
  weapon: number
  watcher: {
    alive: boolean
  }
}

export type VoteConfig = {
  arena: 30
}

export const enum Entity {
  ROUND,
}

export type RoundData = {
  arena: string
  state: RoundState
  date: number
  time: number
  players: string
}

export type Dummy = {
  [Entity.ROUND]: RoundData
}

export type PlayerData = {
  state: State
  team: Team
  weaponState: WeaponState
  weaponSlot: Record<string, string>
  health: number
  alive: boolean
}