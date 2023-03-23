import BaseRepository from "../BaseRepository";

export default class MongodbRepository<T> extends BaseRepository<T> {
  async save(t: T) {
    return t
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