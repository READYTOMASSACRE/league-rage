import 'reflect-metadata'
import { Language } from '../league-lang/language'
import DummyService from '../league-core/src/server/DummyService'
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
import DebugService from './src/DebugService'
import SpectateService from './src/SpectateService'
import TaskManager from './src/TaskManager'

const main = async () => {
  const language = new Language(LanguageService.get(config.lang))
  new ConfigService(config)

  const playerService = new PlayerService(config)
  const permissionService = new PermissionService(language)
  const teamService = new TeamService(playerService, language)
  const roundService = new RoundService(config.round, playerService, teamService, DummyService, language)
  const voteService = new VoteService(config.vote, language)
  const weaponService = new WeaponService(config.weapon, playerService, roundService, language)

  new BroadcastService(config, playerService, teamService, language)
  new SpectateService(playerService, roundService, language)
  new TdmService(
    roundService, permissionService, playerService,
    voteService, weaponService, teamService, language
  )
  new DebugService(playerService, DummyService)

  Arena.load(language)

  TaskManager.start()

  mp.events.call(Events['tdm.start'])
}

main()