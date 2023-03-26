import { event, eventable, logClient } from "../../league-core/client";
import { Events, IConfig } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";
import DummyService from "./DummyService";
import KeybindService from "./KeybindService";
import PlayerService from "./PlayerService";
import RoundService from "./RoundService";
import Chat from "./ui/Chat";
import Controls from "./ui/Controls";
import Deathlog from "./ui/Deathlog";
import Debug from "./ui/Debug";
import Infopanel from "./ui/Infopanel";
import Motd from "./ui/Motd";
import NotifyText from "./ui/Notifytext";
import Scoreboard from "./ui/Scoreboard";
import TeamSelector from "./ui/TeamSelector";
import WeaponSelector from "./ui/WeaponSelector";

@eventable
export default class UIService {
  public debug: Debug
  public cef: BrowserMp
  public chat: Chat
  public scoreboard: Scoreboard
  public weaponSelector: WeaponSelector
  public teamSelect: TeamSelector
  public visible: Record<string, boolean> = {}
  public infoPanel: Infopanel
  public controls: Controls
  public notifyText: NotifyText
  public deathlog: Deathlog
  public motd: Motd

  constructor(
    readonly url: string,
    readonly config: IConfig,
    readonly keybindService: KeybindService,
    readonly playerService: PlayerService,
    readonly dummyService: DummyService,
    readonly roundService: RoundService,
    readonly lang: ILanguage
  ) {
    this.debug = new Debug(this, keybindService)
    this.chat = new Chat(this, keybindService)
    this.scoreboard = new Scoreboard(
      config.team, this, keybindService,
      playerService, dummyService
    )
    this.weaponSelector = new WeaponSelector(
      config.weapon, this, keybindService,
      playerService, dummyService
    )
    this.teamSelect = new TeamSelector(this, keybindService)
    this.infoPanel = new Infopanel(config.team, this, this.dummyService)
    this.controls = new Controls(this, lang)
    this.notifyText = new NotifyText(config.round, this, this.roundService, lang)
    this.deathlog = new Deathlog(config.team, this, playerService)
    this.motd = new Motd(config.motd, this)

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
  }

  @logClient
  @event(Events["tdm.cef.log"])
  log(...args: any[]) {}

  popup(message: Lang | string, type: string = 'info') {
    this.cef.call(Events["tdm.popup.push"], this.lang.get(<Lang>message), type)
  }
}