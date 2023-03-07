import { Events, IConfig, Procs } from "../league-core/src/types"
import HudService from "./src/HudService"
import PlayerService from "./src/PlayerService"
import RoundService from "./src/RoundService"
import UIService from "./src/UIService"
import WeaponService from "./src/WeaponService"
import ZoneService from "./src/ZoneService"

const main = async () => {
  const config: IConfig = await mp.events.callRemoteProc(Procs["tdm.config.get"])

  const playerService = new PlayerService()
  const zoneService = new ZoneService(playerService)
  const roundService = new RoundService(zoneService)

  new UIService("package://league-tdm-cef/index.html")
  new WeaponService(playerService)
  new HudService(roundService)

  mp.console.logInfo('league-tdm-ui package initialized')
  mp.events.call(Events["tdm.player.ready"])
}

main()