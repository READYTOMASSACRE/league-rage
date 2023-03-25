import { Point2d, Point3d, userId } from "./common"

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
  watcher: {
    alive: boolean
  }
}

export type VoteConfig = {
  [Vote.arena]: number
}

export const enum Entity {
  ROUND,
  ROUND_STAT,
  TEAM,
}

export type RoundData = {
  arena: string
  state: RoundState
  time: number
  players: string
}

export type TeamData = Record<Team, { score: number }>

export type PlayerStat = {
  kill: number
  death: number
  assists: number
  damageDone: number
  damageRecieved: number
  hit: number
}

export type RoundStatData = {
  result: Team | 'draw'
  players: {
    [Team.attackers]: Record<userId, PlayerStat>
    [Team.defenders]: Record<userId, PlayerStat>
  }
}

export type Dummy = {
  [Entity.ROUND]: RoundData
  [Entity.TEAM]: TeamData
  [Entity.ROUND_STAT]: RoundStatData
}

export type PlayerData = {
  state: State
  team: Team
  weaponState: WeaponState
  weaponSlot: Record<string, string>
  health: number
  alive: boolean
  spectate?: number
  statistic: PlayerStat
  userId: string
}

export enum Vote {
  arena = 'arena'
}