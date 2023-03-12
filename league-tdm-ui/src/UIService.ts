import { event, eventable, logClient } from "../../league-core/client";
import { Events, IConfig } from "../../league-core/src/types";
import { ILanguage } from "../../league-lang/language";
import KeybindService from "./KeybindService";
import Chat from "./ui/Chat";
import Scoreboard from "./ui/Scoreboard";
import TeamSelector from "./ui/TeamSelector";
import WeaponSelector from "./ui/WeaponSelector";

@eventable
export default class UIService {
  public cef: BrowserMp
  public chat: Chat
  public scoreboard: Scoreboard
  public weaponSelector: WeaponSelector
  public teamSelect: TeamSelector
  public visible: Record<string, boolean> = {}

  constructor(
    readonly url: string,
    readonly keybindService: KeybindService,
    readonly config: IConfig,
    readonly lang: ILanguage
  ) {
    this.chat = new Chat(this, keybindService)
    this.scoreboard = new Scoreboard(this, keybindService, config.team)
    this.weaponSelector = new WeaponSelector(this, keybindService, config.weapon)
    this.teamSelect = new TeamSelector(this, keybindService)

    this.disableControlActions()
  }

  setCursor(visible: boolean, component: string, forceClose?: boolean) {
    if (forceClose) {
      this.visible = {}
    }

    this.visible = {[component]: visible}

    if (!visible && Object.values(this.visible).find(Boolean)) {
      return
    }

    mp.gui.cursor.visible = visible
  }

  @event(Events["tdm.player.ready"])
  load() {
    if (this.cef) {
      this.cef.destroy()
    }

    this.cef = mp.browsers.new(this.url)

    return this.url
  }

  disableControlActions() {
    mp.game.controls.disableControlAction(24, 37, true)
    mp.game.controls.disableControlAction(24, 157, true)

    if (this.chat.visible) {
      mp.game.controls.disableAllControlActions(2)
    }
  }

  @logClient
  @event(Events["tdm.cef.log"])
  log(...args: any[]) {}
}