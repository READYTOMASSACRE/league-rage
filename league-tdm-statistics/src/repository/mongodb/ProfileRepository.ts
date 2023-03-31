import { Profile } from "../../../../league-core/src/types/statistic";
import MongodbRepository from "./MongodbRepository";

export default class ProfileRepository extends MongodbRepository<Profile> {
  name = 'profile'
}