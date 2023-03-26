import { resolve } from "path";
import { DbAdapter, DbConfig } from "../../league-core/src/types";
import { IProfileRepoSitory, IRoundRepository } from "./@types";
import { packagesPath } from "./helpers";
import LokijsProfileRepository from "./repository/lokijs/ProfileRepository";
import LokijsRoundRepository from "./repository/lokijs/RoundRepository";
import MongodbProfileRepository from "./repository/mongodb/ProfileRepository";
import MongodbRoundRepository from "./repository/mongodb/RoundRepository";
import Loki from 'lokijs'

const collections = ['profile', 'round']

export default class RepositoryService {
  readonly profile: IProfileRepoSitory
  readonly round: IRoundRepository
  private lokijs?: Loki
  private lokiPromise: Promise<void>

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
      this.profile = new MongodbProfileRepository({})
      this.round = new MongodbRoundRepository({})
    }
  }

  async load() {
    if (this.lokijs) {
      return this.lokiPromise
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
}