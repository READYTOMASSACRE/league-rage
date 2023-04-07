import { toRound } from "../../league-core/src/helpers/toStatistic";
import { userId } from "../../league-core/src/types";
import { Round } from "../../league-core/src/types/statistic";
import RepositoryService from "./RepositoryService";

export default class RoundService {
  constructor(readonly repositoryService: RepositoryService) {}

  async save(round: Partial<Round>) {
    try {
      return await this.repositoryService.round.save(toRound(round), { write: true })
    } catch (err) {
      console.error(err)
    }
  }

  async get({ userId, dateFrom, dateTo }: {
    userId: userId, dateFrom?: number, dateTo?: number
  }) {
    try {
      const rounds = await this.repositoryService.round.get({ userId, dateFrom, dateTo })

      return rounds.map(toRound)
    } catch (err) {
      console.error(err)
      return []
    }
  }
}