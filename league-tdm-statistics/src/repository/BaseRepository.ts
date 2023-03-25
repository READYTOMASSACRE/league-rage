import { IRepository, TEntity } from "../@types";

export default abstract class BaseRepository<T extends TEntity, A extends any> implements IRepository<T> {
  constructor(private readonly adapter: A) {}

  abstract load(): Promise<void>
  abstract save(t: T): Promise<void>
  abstract get(...args: any[]): Promise<T[]>
  abstract getOne(...args: any[]): Promise<T | undefined>
  abstract getById<V extends number | string>(id: V): Promise<T | undefined>
}