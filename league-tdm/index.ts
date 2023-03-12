import 'reflect-metadata'
import { Language } from '../league-lang/language'
import LanguageService from '../league-lang'
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
import { Events } from '../league-core/src/types'
import ConfigService from './src/ConfigService'
import DummyService from './src/DummyService'

const main = async () => {
  const language = new Language(LanguageService.get(config.lang))
  new ConfigService(config)
  
  const playerService = new PlayerService(config)
  const permissionService = new PermissionService(language)
  const teamService = new TeamService(config.team, playerService, language)
  const roundService = new RoundService(config.round, playerService, teamService, language)
  const voteService = new VoteService(config.vote, language)
  const weaponService = new WeaponService(config.weapon, playerService, language)
  const broadcastService = new BroadcastService(playerService, teamService, language)
  const tdmService = new TdmService(
    roundService, permissionService, playerService,
    voteService, weaponService, language
  )
  new DummyService()

  Arena.load(language)

  mp.events.call(Events['tdm.start'])
}

main()