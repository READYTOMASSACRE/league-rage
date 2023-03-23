import { PlayerStat, Team } from "../../../league-core/src/types/tdm"

export type TEntity = {}

export interface IRepository<T = TEntity> {
  save(t: T): Promise<T>
  get(...args: any[]): Promise<T[]>
  getOne(...args: any[]): Promise<T>
  getById(id: number | string): Promise<T>
}

export type rgscId = number

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
  name: number
}

export type Round = {
  id: number
  date: number
  [Team.attackers]: Record<rgscId, PlayerStat>
  [Team.defenders]: Record<rgscId, PlayerStat>
}