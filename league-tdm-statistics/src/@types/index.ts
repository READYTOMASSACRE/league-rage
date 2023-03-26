import { userId } from "../../../league-core/src/types"
import { PlayerStat, Team } from "../../../league-core/src/types/tdm"

export type TEntity = {
  id: number
}

export interface IRepository<T extends TEntity> {
  name: string

  save(t: T, opts?: any): Promise<void>
  get(...args: any[]): Promise<T[]>
  getOne(...args: any[]): Promise<T | undefined>
  getById(id: number | string): Promise<T | undefined>
}

export interface IProfileRepoSitory extends IRepository<Profile> {}
export interface IRoundRepository extends IRepository<Round> {}

export type Filter = {
  ids?: string[]
  limit?: number
  offset?: number
}

export type LokiFilter<E> = Filter & LokiQuery<E & LokiObj>

export type RoundLokiFilter = LokiFilter<Round> & {
  dateFrom: number
  dateTo: number
  userId: userId
}

export type Profile = {
  id: number
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
  [Team.attackers]: Record<userId, PlayerStat>
  [Team.defenders]: Record<userId, PlayerStat>
}