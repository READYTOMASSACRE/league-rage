import { ClientConfig, Events, IConfig, Procs } from "../league-core/src/types"
import './src/helpers/console'
import { Language } from '../league-lang/language'
import DebugService from "./src/DebugService"
import DummyService from "./src/DummyService"
import HudService from "./src/HudService"
import InteractionService from "./src/InteractionService"
import KeybindService from "./src/KeybindService"
import PlayerService from "./src/PlayerService"
import RoundService from "./src/RoundService"
import UIService from "./src/UIService"
import WeaponService from "./src/WeaponService"
import ZoneService from "./src/ZoneService"

const main = async () => {
  try {
    const config: ClientConfig = await mp.events.callRemoteProc(Procs["tdm.config.get"])
    const lang = await mp.events.callRemoteProc(Procs["tdm.language.get"], config.lang)
    const language = new Language(lang)
  
    const dummyService = new DummyService()
    const playerService = new PlayerService()
    const zoneService = new ZoneService(playerService, dummyService)
    const roundService = new RoundService(zoneService, playerService, await RoundService.getArenas())
    const keybindService = new KeybindService()
    const uiService = new UIService(
      "package://league-tdm-cef/index.html",
      config,
      keybindService,
      playerService,
      dummyService,
      roundService,
      language
    )

    new WeaponService(playerService)
    new HudService(config, roundService, playerService)
    new InteractionService(config, playerService, dummyService, keybindService, uiService)
    new DebugService(playerService)

    mp.console.log('league-tdm-ui package initialized')
  
    mp.events.call(Events["tdm.player.ready"])
    mp.events.callRemote(Events["tdm.player.ready"])
  } catch (err) {
    mp.console.logError(err.stack)
  }
}

main()