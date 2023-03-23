import { IRepository } from "../@types";

export default abstract class BaseRepository<T> implements IRepository<T> {
  constructor(readonly adapter: any) {}

  abstract save(t: T): Promise<T>
  abstract get(...args: any[]): Promise<T[]>
  abstract getOne(...args: any[]): Promise<T>
  abstract getById<V extends number | string>(id: V): Promise<T>
}