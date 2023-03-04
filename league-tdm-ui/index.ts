import ChatService from "./src/ChatService"
import PlayerService from "./src/PlayerService"
import UIService from "./src/UIService"
import WeaponService from "./src/WeaponService"

const main = () => {
  const uiService = new UIService("package://league-tdm-cef/index.html")
  const playerService = new PlayerService()

  new WeaponService(playerService)
  new ChatService(uiService)

  mp.gui.chat.push('league-tdm-ui package init')
}

main()