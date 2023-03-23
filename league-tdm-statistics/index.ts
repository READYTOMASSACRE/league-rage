import PlayerService from "./src/PlayerService"
import PlayerStatisticService from "./src/PlayerStatisticService"
import RoundStatisticService from "./src/RoundStatisticService"

const main = () => {
  const playerService = new PlayerService()
  new PlayerStatisticService(playerService)
  new RoundStatisticService(playerService)
}

main()