import { MongoProfile } from "../../../../../core/src/types/statistic";
import MongodbRepository from "./MongodbRepository";

export default class ProfileRepository extends MongodbRepository<MongoProfile> {
  name = 'profile'
}