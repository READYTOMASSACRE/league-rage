import { Point2d, Point3d } from "./common"
import { PlayerStat, Profile } from "./statistic"

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
    blipColor?: number
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
  TEAM,
}

export type RoundData = {
  arena: string
  state: RoundState
  time: number
  players: string
}

export type TeamData = Record<Team, { score: number }>

export type Dummy = {
  [Entity.ROUND]: RoundData
  [Entity.TEAM]: TeamData
}

export const enum WeaponSlot {
  primary = 'primary',
  secondary = 'secondary',
  melee = 'melee',
}

export type PlayerData = {
  state: State
  team: Team
  weaponState: WeaponState
  weaponSlot: Record<string, string> // todo add enum WeaponSlot
  health: number
  alive: boolean
  spectate?: number
  userId: string
  profile: Profile
  statistic: PlayerStat
}

export enum Vote {
  arena = 'arena'
}