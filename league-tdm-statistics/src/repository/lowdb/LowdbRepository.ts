import BaseRepository from "../BaseRepository";
import { Low } from 'lowdb'
import { Filter, LowdbCollection, TEntity } from "../../@types";

export default abstract class LowdbRepository<T extends TEntity, K extends keyof LowdbCollection>
  extends BaseRepository<T, Low<LowdbCollection>> {

  abstract readonly name: string

  async load() {
    return this.db.read()
  }

  async save(t: T, opts?: {write?: boolean}) {
    this.collection[t.id] = {...this.collection[t.id], ...t}
    if (opts?.write) await this.write()
  }

  async write() {
    this.db.write()
  }

  async get({ id, ids, limit = 10, offset = 0 }: Filter = {}) {
    let result: T[] = [this.collection[id]]
    limit = limit > 50 ? 50 : limit

    if (ids) {
      ids.map(id => result.push(this.collection[id]))
    }

    if (!id && !ids) {
      result = Object.values(this.collection)
    }

    result = result.filter(Boolean)

    if (offset) {
      result = result.slice(offset)
    }

    if (limit && result.length > limit) {
      result = result.slice(offset, limit)
    }

    return Promise.resolve(result)
  }

  async getOne({ id }: Filter = {}) {
    return Promise.resolve(this.collection[id])
  }

  async getById(id: number | string) {
    return Promise.resolve(this.collection[id])
  }

  get collection(): LowdbCollection[K] {
    return this.db.data[this.name]
  }
}