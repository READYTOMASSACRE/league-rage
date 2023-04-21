import { MongoRound } from "../../../../league-core/src/types/statistic";
import { Team } from "../../../../league-core/src/types/tdm";
import { RoundMongoFilter } from "../../@types";
import MongodbRepository from "./MongodbRepository";

export default class RoundRepository extends MongodbRepository<MongoRound> {
  name = 'round'

  async get(filter: RoundMongoFilter) {
    return super.get(this.makeFilter(filter))
  }

  async count(filter: RoundMongoFilter) {
    return super.count(this.makeFilter(filter))
  }

  private makeFilter({
    userId,
    dateFrom,
    dateTo,
    ...filter
  }: RoundMongoFilter) {
    return {
      ...filter,
      ...(dateFrom || dateTo ? {
        id: {
          ...(dateFrom ? { $gt: dateFrom }: false),
          ...(dateTo ? { $lt: dateTo }: false),
        },
      } : {}),
      ...(userId ? {
        $or: [
          {[`${Team.attackers}.players.${userId}`]: { $exists: true }},
          {[`${Team.defenders}.players.${userId}`]: { $exists: true }},
        ],
      } : {}),
    }
  }
}