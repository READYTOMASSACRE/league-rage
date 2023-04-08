import { MongoEntity } from "../../@types";
import BaseRepository from "../BaseRepository";
import { log } from "../../../../league-core";
import { Db, Collection, Filter, OptionalUnlessRequiredId } from "mongodb";
import { maxLimit } from "../../helpers";

export default abstract class MongodbRepository<T extends MongoEntity> extends BaseRepository<T, Db> {
  constructor(db: Db) {
    super(db)
  }

  async save(t: T) {
    const item = await this.getById(t.id)
    if (item) {
      const {_id, ...doc} = item

      await this.collection.updateOne(<Filter<T>>{_id}, {$set: {...doc, ...t}})
    } else {
      await this.collection.insertOne(<OptionalUnlessRequiredId<T>>t)
    }
  }

  async get({
    ids,
    limit = maxLimit,
    offset,
    ...query
  }: Filter<T> = {}) {
    return this.collection.find({
      ...(ids ? { id: { $in: ids } } : false),
      ...query,
    }).limit(Number(limit)).skip(Number(offset) || 0).sort({ _id: -1 }).toArray() as any as T[]
  }

  @log
  async getOne(query: Filter<T>) {
    return this.collection.findOne(query) as any as T
  }

  @log
  async getById(id: number | string) {
    return this.collection.findOne(<Filter<T>>{id}) as any as T
  }

  get collection(): Collection<T> {
    return this.db.collection(this.name)
  }
}