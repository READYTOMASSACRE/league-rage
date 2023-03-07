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

const main = async () => {
  const language = new Language(LanguageService.get(config.lang))
  const playerService = new PlayerService()
  const permissionService = new PermissionService(language)
  const teamService = new TeamService(playerService, language)
  const roundService = new RoundService(playerService, teamService, language)
  const voteService = new VoteService(language)
  const weaponService = new WeaponService(config.weaponConfig, playerService, language)
  
  new ConfigService(config)
  new BroadcastService(playerService, language)
  new TdmService(
    roundService,
    permissionService,
    playerService,
    voteService,
    weaponService,
    language,
  )

  Arena.load(language)

  mp.events.call(Events['tdm.start'])
}

main()