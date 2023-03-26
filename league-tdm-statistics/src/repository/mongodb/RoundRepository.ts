import { Round } from "../../../../league-core/src/types/statistic";
import MongodbRepository from "./MongodbRepository";

export default class RoundRepository extends MongodbRepository<Round> {
  name: 'round'
}