import { Profile } from "../../@types";
import LowdbRepository from "./LowdbRepository";

export default class ProfileRepository extends LowdbRepository<Profile> {
  name = 'profile'
}