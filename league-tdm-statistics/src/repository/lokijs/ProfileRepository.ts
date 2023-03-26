import { Profile } from "../../../../league-core/src/types/statistic";
import LokijsRepository from "./LokijsRepository";

export default class ProfileRepository extends LokijsRepository<Profile> {
  name = 'profile'
}