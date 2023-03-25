import { rgscId } from "../../../league-core/src/types"
import { PlayerStat, Team } from "../../../league-core/src/types/tdm"

export type TEntity = {
  id: number
}

export interface IRepository<T extends TEntity> {
  load(): Promise<void>
  save(t: T, opts?: any): Promise<void>
  get(...args: any[]): Promise<T[]>
  getOne(...args: any[]): Promise<T | undefined>
  getById(id: number | string): Promise<T | undefined>
}

export interface LowdbCollection<T extends TEntity> {
  [key: string]: Record<number | string, T>
}

export type LowdbFilter = {
  id?: number
  ids?: number[]
  limit?: number
  offset?: number
}

export type Profile = {
  id: number
  rgscId: rgscId
  lvl: number
  exp: number
  kill: number
  death: number
  assists: number
  damageDone: number
  damageRecieved: number
  hit: number
  name: string
}

export type Round = {
  id: number
  arenaId: number
  result: Team | "draw"
  [Team.attackers]: Record<rgscId, PlayerStat>
  [Team.defenders]: Record<rgscId, PlayerStat>
}