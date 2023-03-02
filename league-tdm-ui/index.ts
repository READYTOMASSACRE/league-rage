import PlayerService from "./src/PlayerService"
import UIService from "./src/UIService"
import WeaponService from "./src/WeaponService"

const main = () => {
  new UIService("package://league-tdm-cef/index.html")
  const playerService = new PlayerService()
  new WeaponService(playerService)
}

main()