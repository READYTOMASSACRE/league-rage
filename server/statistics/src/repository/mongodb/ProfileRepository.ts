import { MongoProfile } from "../../../../../core/src/types/statistic";
import MongodbRepository from "./MongodbRepository";

export default class ProfileRepository extends MongodbRepository<MongoProfile> {
  name = 'profile'

  async getByRgscId(rgscId: string) {
    const profile = await this.collection.findOne({rgscId})

    if (!profile) return

    return profile
  }
}