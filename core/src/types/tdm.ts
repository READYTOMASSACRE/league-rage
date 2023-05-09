import { Point2d, Point3d, userId } from "./common"
import { Role } from "./permission"
import { ClientProfile, PlayerStat } from "./statistic"

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
  prepare = 'prepare',
}

export const StateDimensions = {
  [State.alive]: 0,
  [State.prepare]: 0,
  [State.spectate]: 0,
  [State.idle]: 1,
  [State.dead]: 1,
  [State.select]: 10,
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

export type TeamOptions = {
  name: string
  color: string
  skins: string[]
  blipColor?: number
}
export type TeamConfig = {
  [key in Team]: TeamOptions
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
  players: number[]
}

export type TeamData = Record<Team, { score: number } & TeamOptions>

export type Dummy = {
  [Entity.ROUND]: RoundData
  [Entity.TEAM]: TeamData
}

export const enum WeaponSlot {
  primary = 'primary',
  secondary = 'secondary',
  melee = 'melee',
  unarmed = 'unarmed'
}

export type PlayerData = {
  state: State
  team: Team
  weaponState: WeaponState
  weaponSlot: Record<string, string> // todo add enum WeaponSlot
  health: number
  alive: boolean
  spectate?: number
  userId: userId
  profile: ClientProfile
  statistic: PlayerStat
  role: Role,
}

export enum Vote {
  arena = 'arena'
}

export enum GameType {
  round = 'round',
  match = 'match'
}

export type MatchConfig = {
  timeleft: number
  prepare: number
}

export type GameConfig = {
  type: GameType
  [GameType.match]: MatchConfig
  [GameType.round]: RoundConfig
}