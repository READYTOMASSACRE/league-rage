import PermissionService from "./src/tdm/PermissionService"
import PlayerService from "./src/tdm/PlayerService"
import RoundService from "./src/tdm/RoundService"
import TdmService from "./src/tdm/TdmService"

const main = () => {
  const playerService = new PlayerService()
  const permissionService = new PermissionService()
  const roundService = new RoundService(playerService)
  const tdmService = new TdmService(roundService, permissionService)

  mp.events.call('tdm.start')
}

main()