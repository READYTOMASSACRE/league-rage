import { Low } from "lowdb/lib";
import { JSONFile } from "lowdb/node";
import { resolve } from "path";
import { DbAdapter, DbConfig } from "../../league-core/src/types";
import { IProfileRepoSitory, IRoundRepository, LowdbCollection } from "./@types";
import { packagesPath } from "./helpers";
import LowdbProfileRepository from "./repository/lowdb/ProfileRepository";
import LowdbRoundRepository from "./repository/lowdb/RoundRepository";
import MongodbProfileRepository from "./repository/mongodb/ProfileRepository";
import MongodbRoundRepository from "./repository/mongodb/RoundRepository";

export default class RepositoryService {
  readonly profile: IProfileRepoSitory
  readonly round: IRoundRepository
  private lowdb?: Low<LowdbCollection>

  constructor(readonly config: DbConfig) {
    if (config.adapter === DbAdapter.lowdb) {
      const dbPath = resolve(packagesPath, config.lowdb)
      const adapter = new JSONFile<LowdbCollection>(dbPath)

      this.lowdb = new Low(adapter)
      this.profile = new LowdbProfileRepository(this.lowdb)
      this.round = new LowdbRoundRepository(this.lowdb)
    } else {
      this.profile = new MongodbProfileRepository({})
      this.round = new MongodbRoundRepository({})
    }
  }

  async load() {
    if (this.lowdb) await this.lowdb.read()
  }
}