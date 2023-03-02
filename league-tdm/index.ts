import 'reflect-metadata'
import Arena from './src/Arena'
import BroadcastService from './src/BroadcastService'
import PermissionService from "./src/PermissionService"
import PlayerService from "./src/PlayerService"
import RoundService from "./src/RoundService"
import TdmService from "./src/TdmService"
import TeamService from './src/TeamService'
import VoteService from './src/VoteService'
import WeaponService from './src/WeaponService'
import { config } from '../league-core'

const main = () => {
  const playerService = new PlayerService()
  const permissionService = new PermissionService()
  const teamService = new TeamService(playerService)
  const roundService = new RoundService(playerService, teamService)
  const voteService = new VoteService()
  const tdmService = new TdmService(roundService, permissionService, playerService, voteService)
  const broadcastService = new BroadcastService(playerService)
  const weaponService = new WeaponService(config.weaponConfig)

  Arena.load()

  mp.events.call('tdm.start')
}

main()