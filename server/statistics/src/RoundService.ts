import { toRound } from "../../../core/src/helpers/toStatistic";
import { userId } from "../../../core/src/types";
import { ListReponse, ListRequest, Round } from "../../../core/src/types/statistic";
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
    ...args
  }: ListRequest): Promise<ListReponse<Round>> {
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
        ...args
      })

      const total = await this.repositoryService.round.count({ userId, ...args })

      return { list: rounds.map(toRound), total }
    } catch (err) {
      console.error(err)
      return { list: [], total: 0 }
    }
  }

  async count(request: ListRequest) {
    try {
      return await this.repositoryService.round.count(request)
    } catch (err) {
      console.error(err)
      return 0
    }
  }
}