import { JSONFile } from "lowdb/node";
import { resolve } from "path";
import { DbAdapter, DbConfig } from "../../league-core/src/types";
import { IProfileRepoSitory, IRoundRepository, LowdbCollection } from "./@types";
import LowdbProfileRepository from "./repository/lowdb/ProfileRepository";
import LowdbRoundRepository from "./repository/lowdb/RoundRepository";
import MongodbProfileRepository from "./repository/mongodb/ProfileRepository";
import MongodbRoundRepository from "./repository/mongodb/RoundRepository";

export default class RepositoryService {
  readonly profile: IProfileRepoSitory
  readonly round: IRoundRepository

  constructor(readonly config: DbConfig) {
    if (config.adapter === DbAdapter.lowdb) {
      const dbPath = resolve(__dirname, config.lowdb)
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