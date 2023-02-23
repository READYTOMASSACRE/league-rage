import 'reflect-metadata'
import BroadcastService from './src/tdm/BroadcastService'
import PermissionService from "./src/tdm/PermissionService"
import PlayerService from "./src/tdm/PlayerService"
import RoundService from "./src/tdm/RoundService"
import TdmService from "./src/tdm/TdmService"
import TeamService from './src/tdm/TeamService'

const main = () => {
  const playerService = new PlayerService()
  const permissionService = new PermissionService()
  const teamService = new TeamService(playerService)
  const roundService = new RoundService(playerService, teamService)
  const tdmService = new TdmService(roundService, permissionService)
  const broadcastService = new BroadcastService(playerService)

  mp.events.call('tdm.start')
}

main()