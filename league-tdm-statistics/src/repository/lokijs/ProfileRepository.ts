import { Profile } from "../../@types";
import LokijsRepository from "./LokijsRepository";

export default class ProfileRepository extends LokijsRepository<Profile> {
  name = 'profile'
}