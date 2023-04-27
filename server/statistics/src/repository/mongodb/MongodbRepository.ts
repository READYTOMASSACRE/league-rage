import { MongoEntity } from "../../@types";
import BaseRepository from "../BaseRepository";
import { Db, Collection, Filter, OptionalUnlessRequiredId } from "mongodb";
import { maxLimit } from "../../helpers";

export default abstract class MongodbRepository<T extends MongoEntity> extends BaseRepository<T, Db> {
  constructor(db: Db) {
    super(db)
  }

  async save(t: T) {
    const item = await this.getById(t._id)
    if (item) {
      const {_id, ...doc} = item

      await this.collection.updateOne(<Filter<T>>{_id}, {$set: {...doc, ...t}})
    } else {
      await this.collection.insertOne(<OptionalUnlessRequiredId<T>>t)
    }
  }

  async get({ ids, limit = maxLimit, offset, ...query }: Filter<T> = {}) {
    return this.collection.find({
      ...(ids ? { _id: { $in: ids } } : false),
      ...query,
    }).limit(Number(limit)).skip(Number(offset) || 0).sort({ _id: -1 }).toArray() as any as T[]
  }

  async count({ ids, ...query }: Filter<T> = {}) {
    return this.collection.countDocuments({
      ...(ids ? { _id: { $in: ids } } : false),
      ...query,
    })
  }

  async getOne(query: Filter<T>) {
    return this.collection.findOne(query) as any as T
  }

  async getById(_id: number | string) {
    return this.collection.findOne(<Filter<T>>{_id}) as any as T
  }

  get collection(): Collection<T> {
    return this.db.collection(this.name)
  }
}