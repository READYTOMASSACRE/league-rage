import { config } from "../league-core"
import PlayerService from "./src/PlayerService"
import PlayerStatisticService from "./src/PlayerStatisticService"
import RepositoryService from "./src/repository/RepositoryService"
import RoundStatisticService from "./src/RoundStatisticService"

const main = async () => {
  const repositoryService = new RepositoryService(config.db)
  await repositoryService.load()

  const playerService = new PlayerService()
  new PlayerStatisticService(playerService)
  new RoundStatisticService(playerService, repositoryService)
}

main()