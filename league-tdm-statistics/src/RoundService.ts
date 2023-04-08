import { toRound } from "../../league-core/src/helpers/toStatistic";
import { userId } from "../../league-core/src/types";
import { Round } from "../../league-core/src/types/statistic";
import RepositoryService from "./RepositoryService";
import { maxLimit } from "./helpers";

export default class RoundService {
  constructor(readonly repositoryService: RepositoryService) {}

  async save(round: Partial<Round>) {
    try {
      return await this.repositoryService.round.save(toRound(round), { write: true })
    } catch (err) {
      console.error(err)
    }
  }

  async get({
    userId,
    limit,
    offset,
    dateFrom,
    dateTo,
  }: {
    userId: userId
    limit?: number
    offset?: number
    dateFrom?: number
    dateTo?: number
  }) {
    try {
      limit = Number(limit ?? maxLimit)
      offset = Number(offset ?? 0)
      limit = isNaN(limit) ? maxLimit : limit
      offset = isNaN(offset) ? 0 : offset

      limit = limit > maxLimit ? maxLimit : limit

      const rounds = await this.repositoryService.round.get({
        userId,
        limit,
        offset,
        dateFrom,
        dateTo
      })

      return rounds.map(toRound)
    } catch (err) {
      console.error(err)
      return []
    }
  }
}