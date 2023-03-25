import { Round } from "../../@types";
import LowdbRepository from "./LowdbRepository";

export default class RoundRepository extends LowdbRepository<Round> {
  name = 'round'
}