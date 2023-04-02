import { config } from "../league-core"
import PlayerService from "./src/PlayerService"
import PlayerStatisticService from "./src/PlayerStatisticService"
import RepositoryService from "./src/RepositoryService"
import RoundStatisticService from "./src/RoundStatisticService"
import StatisticService from "./src/StatisticService"

const main = async () => {
  try {
    const repositoryService = new RepositoryService(config.db)
    await repositoryService.load()

    const playerService = new PlayerService()
    new PlayerStatisticService(playerService)
    new RoundStatisticService(config.team, config.statistic, playerService, repositoryService)
    new StatisticService(repositoryService, playerService)
  } catch (err) {
    console.error(err)
  }
}

main()