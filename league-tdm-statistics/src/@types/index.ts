import { userId } from "../../../league-core/src/types"
import { Profile, Round } from "../../../league-core/src/types/statistic"

export type TEntity = {
  id: number | string
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