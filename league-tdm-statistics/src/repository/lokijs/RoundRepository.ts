import { Round } from "../../../../league-core/src/types/statistic";
import { Team } from "../../../../league-core/src/types/tdm";
import { RoundLokiFilter } from "../../@types";
import { day } from "../../helpers";
import LokijsRepository from "./LokijsRepository";

export default class RoundRepository extends LokijsRepository<Round> {
  name = 'round'

  async get({
    userId,
    dateFrom = Date.now() - (day * 10),
    dateTo,
    ...filter
  }: RoundLokiFilter) {
    return super.get({
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
    })
  }
}

