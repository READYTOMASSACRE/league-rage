import { MongoEntity } from "../../@types";
import BaseRepository from "../BaseRepository";
import { Db, Collection, Filter, OptionalUnlessRequiredId } from "mongodb";
import { maxLimit } from "../../helpers";
import { userId } from "../../../../../core/src/types";
import { ObjectId } from "mongodb";

export default abstract class MongodbRepository<T extends MongoEntity> extends BaseRepository<T, Db> {
  constructor(db: Db) {
    super(db)
  }

  async save(t: T) {
    const {_id, ...updateDoc} = t
    const item = await this.getById(_id)
    if (item) {
      const {_id, ...doc} = item

      await this.collection.updateOne(<Filter<T>>{_id}, {$set: {
        ...doc,
        ...<T>updateDoc,
      }})
    } else {
      await this.collection.insertOne(<OptionalUnlessRequiredId<T>>updateDoc)
    }
  }

  async get({ ids = [], limit = maxLimit, offset, ...query }: Filter<T> = {}) {
    ids = ids.map((id: userId) => new ObjectId(id))

    return this.collection.find({
      ...(ids.length ? { _id: { $in: ids } } : false),
      ...query,
    }).limit(Number(limit)).skip(Number(offset) || 0).sort({ _id: -1 }).toArray() as any as T[]
  }

  async count({ ids = [], ...query }: Filter<T> = {}) {
    ids = ids.map((id: userId) => new ObjectId(id))

    return this.collection.countDocuments({
      ...(ids.length ? { _id: { $in: ids } } : false),
      ...query,
    })
  }

  async getOne(query: Filter<T>) {
    return this.collection.findOne(query) as any as T
  }

  async getById(_id: userId) {
    return this.collection.findOne(<Filter<T>>{_id: new ObjectId(_id)}) as any as T
  }

  get collection(): Collection<T> {
    return this.db.collection(this.name)
  }
}