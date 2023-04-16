import { IRepository, TEntity } from "../@types";

export default abstract class BaseRepository<T extends TEntity, DB extends any> implements IRepository<T> {
  abstract name: string

  constructor(protected readonly db: DB) {}

  abstract save(t: T): Promise<void>
  abstract get(...args: any[]): Promise<T[]>
  abstract getOne(...args: any[]): Promise<T | undefined>
  abstract getById<ID extends number | string>(id: ID): Promise<T | undefined>
  abstract count(...args: any[]): Promise<number>
}