import { Profile } from "../../@types";
import MongodbRepository from "./MongodbRepository";

export default class ProfileRepository extends MongodbRepository<Profile> {
  name: 'profile'
}