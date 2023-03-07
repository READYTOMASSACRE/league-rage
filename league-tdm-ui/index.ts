import HudService from "./src/HudService"
import PlayerService from "./src/PlayerService"
import RoundService from "./src/RoundService"
import UIService from "./src/UIService"
import WeaponService from "./src/WeaponService"
import ZoneService from "./src/ZoneService"

const main = () => {
  const playerService = new PlayerService()
  const zoneService = new ZoneService(playerService)
  const roundService = new RoundService(zoneService)

  new UIService("package://league-tdm-cef/index.html")
  new WeaponService(playerService)
  new HudService(roundService)

  mp.console.logInfo('league-tdm-ui package initialized')
}

main()