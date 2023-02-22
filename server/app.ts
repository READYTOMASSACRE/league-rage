import PermissionService from "./src/PermissionService"
import PlayerService from "./src/PlayerService"
import RoundService from "./src/RoundService"
import TdmService from "./src/TdmService"

const main = () => {
  const playerService = new PlayerService()
  const permissionService = new PermissionService()
  const roundService = new RoundService(playerService)
  const tdmService = new TdmService(roundService, permissionService)

  mp.events.call('tdm.start')
}

main()