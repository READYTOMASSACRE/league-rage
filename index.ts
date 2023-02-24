import 'reflect-metadata'
import {arenaPath} from './src/helpers'
import Arena from './src/tdm/Arena'
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
  const tdmService = new TdmService(roundService, permissionService, playerService)
  const broadcastService = new BroadcastService(playerService)

  Arena.load(arenaPath)

  mp.events.call('tdm.start')
}

main()