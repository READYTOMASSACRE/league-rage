import { config } from "../league-core"
import PlayerService from "./src/PlayerService"
import PlayerStatisticService from "./src/PlayerStatisticService"
import ProfileService from "./src/ProfileService"
import RepositoryService from "./src/RepositoryService"
import RoundService from "./src/RoundService"
import RoundStatisticService from "./src/RoundStatisticService"
import StatisticService from "./src/StatisticService"

const main = async () => {
  try {
    const repositoryService = new RepositoryService(config.db)
    await repositoryService.load()

    const playerService = new PlayerService()
    const profileService = new ProfileService(playerService, repositoryService)
    const roundService = new RoundService(repositoryService)

    new PlayerStatisticService(playerService)
    new RoundStatisticService(config.team, config.statistic, playerService, profileService, roundService)
    new StatisticService(playerService, profileService, roundService)

  } catch (err) {
    console.error(err)
  }
}

main()