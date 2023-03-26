import { TEntity } from "../../@types";
import BaseRepository from "../BaseRepository";

export default abstract class MongodbRepository<T extends TEntity> extends BaseRepository<T, any> {
  async load() {
    return Promise.resolve()
  }

  async save(t: T) {
    return Promise.resolve()
  }

  async get(...args: any[]) {
    return [{} as T]
  }

  async getOne(...args: any[]) {
    return {} as T
  }

  async getById(id: number | string) {
    return {} as T
  }  
}