import { Round } from "../../../../../core/src/types/statistic";
import { Team } from "../../../../../core/src/types/tdm";
import { RoundLokiFilter } from "../../@types";
import { day } from "../../helpers";
import LokijsRepository from "./LokijsRepository";

export default class RoundRepository extends LokijsRepository<Round> {
  name = 'round'

  async get(filter: RoundLokiFilter) {
    return super.get(this.makeFilter(filter))
  }

  async count(filter: RoundLokiFilter) {
    return super.count(this.makeFilter(filter))
  }

  private makeFilter({
    userId,
    dateFrom = Date.now() - (day * 10),
    dateTo,
    ...filter
  }: RoundLokiFilter) {
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

