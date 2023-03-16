import { Events, IConfig, Procs } from "../league-core/src/types"
import { Language } from '../league-lang/language'
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
    mp.console.reset()
    mp.console.clear()

    const config: IConfig = await mp.events.callRemoteProc(Procs["tdm.config.get"])
    const lang = await mp.events.callRemoteProc(Procs["tdm.language.get"], config.lang)
    const language = new Language(lang)
  
    const dummyService = new DummyService()
    const playerService = new PlayerService()
    const zoneService = new ZoneService(playerService)
    const roundService = new RoundService(zoneService)
    const keybindService = new KeybindService()

    new UIService(
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
    new InteractionService(config, playerService, dummyService, keybindService)
  
    mp.console.logInfo('league-tdm-ui package initialized')
  
    mp.events.call(Events["tdm.player.ready"])
    mp.events.callRemote(Events["tdm.player.ready"])
  } catch (err) {
    mp.console.logError(err.stack)
  }
}

main()