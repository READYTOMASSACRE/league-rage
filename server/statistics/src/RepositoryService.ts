import { resolve } from "path";
import { DbAdapter, DbConfig } from "../../../core/src/types";
import { IProfileRepoSitory, IRoundRepository } from "./@types";
import { packagesPath } from "./helpers";
import LokijsProfileRepository from "./repository/lokijs/ProfileRepository";
import LokijsRoundRepository from "./repository/lokijs/RoundRepository";
import MongodbProfileRepository from "./repository/mongodb/ProfileRepository";
import MongodbRoundRepository from "./repository/mongodb/RoundRepository";
import Loki from 'lokijs'
import { event, eventable } from "../../../core";
import { MongoClient } from "mongodb";

const collections = ['profile', 'round']

@eventable
export default class RepositoryService {
  readonly profile: IProfileRepoSitory
  readonly round: IRoundRepository
  private lokijs?: Loki
  private lokiPromise: Promise<void>
  private mongoClient?: MongoClient

  constructor(readonly config: DbConfig) {
    if (config.adapter === DbAdapter.lokijs) {
      if (!config.lokijs) {
        throw new Error('Lokijs is not configured')
      }

      const dbPath = resolve(packagesPath, config.lokijs.database)

      let _resolve: () => void
      let _reject: () => void

      this.lokiPromise = new Promise((resolve, reject) => {
        _resolve = resolve
        _reject = reject
      })

      this.lokijs = new Loki(dbPath, {
        ...config.lokijs,
        autoloadCallback: () => this.lokiLoad(_resolve, _reject),
      })
      this.profile = new LokijsProfileRepository(this.lokijs)
      this.round = new LokijsRoundRepository(this.lokijs)
    } else {
      this.mongoClient = new MongoClient(
        this.getMongoUri(config.mongodb),
        this.config.mongodb?.opts
      )

      const db = this.mongoClient.db()

      this.profile = new MongodbProfileRepository(db)
      this.round = new MongodbRoundRepository(db)
    }
  }

  async load() {
    if (this.lokijs) {
      return this.lokiPromise
    }

    if (this.mongoClient) {
      await this.mongoClient.connect()
    }
  }

  private lokiLoad(resolve: () => void, reject: () => void) {
    if (!this.lokijs) reject()

    for (const collection of collections) {
      if (!this.lokijs.getCollection(collection)) {
        this.lokijs.addCollection(collection, {
          unique: ['id'],
        })
      }
    }

    resolve()
  }

  @event("serverShutdown")
  async serverShutdown() {
    try {
      mp.events.delayShutdown = true
      if (this.mongoClient) {
        await this.mongoClient.close()
      }
    } catch (err) {
      console.error(err)
    }
    mp.events.delayShutdown = false
  }

  getMongoUri(config: DbConfig["mongodb"]) {
    const credentials = [config.username, config.password].filter(Boolean).join(':')
    return `mongodb://${credentials.length ? credentials + '@' : ''}${config.host}:${config.port}/${config.database}`
  }
}