import { InferIdType, Filter as MongoFilter } from 'mongodb'
import { userId } from "../../../../core/src/types"
import { MongoRound, Profile, Round } from "../../../../core/src/types/statistic"

export type TEntity = {
  id: number | string
}

export type MongoEntity = TEntity & {
  _id: InferIdType<any>
}

export interface IRepository<T extends TEntity> {
  name: string

  save(t: Partial<T>, opts?: any): Promise<void>
  get(...args: any[]): Promise<T[]>
  getOne(...args: any[]): Promise<T | undefined>
  getById(id: number | string): Promise<T | undefined>
  count(...args: any[]): Promise<number>
}

export interface IProfileRepoSitory extends IRepository<Profile> {}
export interface IRoundRepository extends IRepository<Round> {}

export type AbstractFilter = {
  ids?: string[]
  limit?: number
  offset?: number
}

export type RoundFilter = {
  dateFrom: number
  dateTo: number
  userId: userId
}

export type LokiFilter<E> = AbstractFilter & LokiQuery<E & LokiObj>
export type RoundLokiFilter = LokiFilter<Round> & RoundFilter
export type RoundMongoFilter = MongoFilter<MongoRound> & RoundFilter