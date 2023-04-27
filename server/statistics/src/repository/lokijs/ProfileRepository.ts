import { Profile } from "../../../../../core/src/types/statistic";
import LokijsRepository from "./LokijsRepository";

export default class ProfileRepository extends LokijsRepository<Profile> {
  name = 'profile'

  async getByRgscId(rgscId: string) {
    return this.getOne({ rgscId: { $eq: rgscId }})
  }
}