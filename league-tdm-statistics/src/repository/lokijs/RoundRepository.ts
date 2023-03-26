import { Round } from "../../../../league-core/src/types/statistic";
import { Team } from "../../../../league-core/src/types/tdm";
import { RoundLokiFilter } from "../../@types";
import { day } from "../../helpers";
import LokijsRepository from "./LokijsRepository";

export default class RoundRepository extends LokijsRepository<Round> {
  name = 'round'

  async get({
    userId,
    dateFrom = Date.now() - day,
    dateTo = Date.now() + day,
    ...filter
  }: RoundLokiFilter) {
    return super.get({
      ...filter,
      id: { $gt: dateFrom, $lt: dateTo },
      ...(userId ? {
        $or: [
          {[`${Team.attackers}.players.${userId}`]: { $exists: true }},
          {[`${Team.defenders}.players.${userId}`]: { $exists: true }},
        ],
      } : {}),
    })
  }
}

