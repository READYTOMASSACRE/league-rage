import BaseRepository from "../BaseRepository";
import { LokiFilter, TEntity } from "../../@types";
import { maxLimit } from "../../helpers";

export default abstract class LokijsRepository<T extends TEntity> extends BaseRepository<T, Loki> {
  abstract readonly name: string

  async save(t: T, opts?: {write?: boolean}) {
    const doc = await this.getById(t._id)

    if (doc) {
      this.collection.update({...doc, ...t, _id: doc._id})
    } else {
      this.collection.insert({...t, _id: this.lastId + 1})
    }

    if (opts?.write) await this.saveDatabase()
  }

  async get({ ids, offset = 0, limit = maxLimit, ...query }: LokiFilter<T> = {}) {
    return Promise.resolve(
      this.collection
        .chain()
        .find({
          ...(ids ? { _id: { $in: ids } } : false),
          ...query,
        })
        .sort((a, b) => Number(b._id) - Number(a._id))
        .offset(Number(offset))
        .limit(Number(limit))
        .data()
    )
  }

  async count({ ids, ...query }: LokiFilter<T> = {}) {
    return Promise.resolve(
      this.collection
        .chain()
        .find({
          ...(ids ? { _id: { $in: ids } } : false),
          ...query,
        })
        .data()
        .length
    )
  }

  async getOne(query: LokiQuery<T & LokiObj> = {}): Promise<T & LokiObj | undefined> {
    return Promise.resolve(this.collection.findOne(query))
  }

  async getById(_id: number | string) {
    return this.getOne({ _id: { $eq: _id }})
  }

  get collection() {
    return this.db.getCollection<T>(this.name)
  }

  get lastId() {
    return this.collection.data.length || 1
  }

  private async saveDatabase() {
    return new Promise((resolve, reject) => {
      this.db.saveDatabase((err) => err ? reject(err) : resolve(void 0))
    })
  }
}