import { JSONFile } from "lowdb/node";
import { resolve } from "path";
import { DbAdapter, DbConfig } from "../../../league-core/src/types";
import { IProfileRepoSitory, IRoundRepository, LowdbCollection, Profile, Round } from "../@types";
import LowdbProfileRepository from "./lowdb/ProfileRepository";
import LowdbRoundRepository from "./lowdb/RoundRepository";
import MongodbProfileRepository from "./mongodb/ProfileRepository";
import MongodbRoundRepository from "./mongodb/RoundRepository";

export default class RepositoryService {
  readonly profile: IProfileRepoSitory
  readonly round: IRoundRepository

  constructor(readonly config: DbConfig) {
    if (config.adapter === DbAdapter.lowdb) {
      const dbPath = resolve(__dirname, config.lowdb || "db.json")
      const adapter = new JSONFile<LowdbCollection<any>>(dbPath)

      this.profile = new LowdbProfileRepository(adapter)
      this.round = new LowdbRoundRepository(adapter)
    } else {
      this.profile = new MongodbProfileRepository({})
      this.round = new MongodbRoundRepository({})
    }
  }

  async load() {
    await Promise.all([
      this.profile.load(),
      this.round.load(),
    ])
  }
}