import { DbAdapter, DbConfig } from "../../../league-core/src/types";
import { IRepository, Profile, Round } from "../@types";
import LowdbProfileRepository from "./lowdb/ProfileRepository";
import LowdbRoundRepository from "./lowdb/RoundRepository";
import MongodbProfileRepository from "./mongodb/ProfileRepository";
import MongodbRoundRepository from "./mongodb/RoundRepository";

export default class RepositoryService {
  readonly profileRepository: IRepository<Profile>
  readonly roundRepository: IRepository<Round>

  constructor(readonly config: DbConfig) {
    if (config.adapter === DbAdapter.lowdb) {
      this.profileRepository = new LowdbProfileRepository({})
      this.roundRepository = new LowdbRoundRepository({})
    } else {
      this.profileRepository = new MongodbProfileRepository({})
      this.roundRepository = new MongodbRoundRepository({})
    }
  }
}