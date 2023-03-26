import BaseRepository from "../BaseRepository";
import { LokiFilter, TEntity } from "../../@types";
import { maxLimit } from "../../helpers";

export default abstract class LokijsRepository<T extends TEntity> extends BaseRepository<T, Loki> {
  abstract readonly name: string

  async save(t: T, opts?: {write?: boolean}) {
    this.collection.update(t)
    if (opts?.write) await this.saveDatabase()
  }

  async get({
    ids,
    offset = 0,
    limit = maxLimit,
    ...query
  }: LokiFilter<T> = {}) {
    return Promise.resolve(
      this.collection
        .chain()
        .offset(offset)
        .limit(limit)
        .find({
          ...(ids ? { id: { $in: ids } } : false),
          ...query,
        }).data()
    )
  }

  async getOne(query: LokiQuery<T & LokiObj> = {}) {
    return this.collection.findOne(query)
  }

  async getById(id: number | string) {
    return this.getOne({ id: { $eq: id }})
  }

  get collection() {
    return this.db.getCollection<T>(this.name)
  }

  private async saveDatabase() {
    return new Promise((resolve, reject) => {
      this.db.saveDatabase((err) => err ? reject(err) : resolve(void 0))
    })
  }
}