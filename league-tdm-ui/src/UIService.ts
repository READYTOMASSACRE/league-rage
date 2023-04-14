import { event, eventable, logClient, console } from "../../league-core/client";
import { ClientConfig, Events } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";
import ArenaService from "./ArenaService";
import DummyService from "./DummyService";
import KeybindService from "./KeybindService";
import PlayerService from "./PlayerService";
import RoundService from "./RoundService";
import TeamService from "./TeamService";
import Chat from "./ui/Chat";
import Controls from "./ui/Controls";
import Deathlog from "./ui/Deathlog";
import Debug from "./ui/Debug";
import Effects from "./ui/Effects";
import Infopanel from "./ui/Infopanel";
import Motd from "./ui/Motd";
import NotifyText from "./ui/Notifytext";
import Panel from "./ui/Panel";
import Scoreboard from "./ui/Scoreboard";
import Spectate from "./ui/Spectate";
import TeamSelector from "./ui/TeamSelector";
import WeaponHud from "./ui/WeaponHud";
import WeaponSelector from "./ui/WeaponSelector";
import Winner from "./ui/Winner";

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
  public panel: Panel
  public spectate: Spectate
  public weaponHud: WeaponHud
  public winner: Winner
  public effects: Effects

  constructor(
    readonly url: string,
    readonly config: ClientConfig,
    readonly keybindService: KeybindService,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly dummyService: DummyService,
    readonly roundService: RoundService,
    readonly arenaService: ArenaService,
    readonly lang: ILanguage
  ) {
    this.debug = new Debug(this, keybindService)
    this.chat = new Chat(this, keybindService)
    this.scoreboard = new Scoreboard(
      this, keybindService,
      playerService, teamService, dummyService
    )
    this.weaponSelector = new WeaponSelector(
      config.weapon, this, keybindService,
      playerService, dummyService
    )
    this.teamSelect = new TeamSelector(this, keybindService)
    this.infoPanel = new Infopanel(this, this.dummyService, teamService)
    this.controls = new Controls(this, lang)
    this.notifyText = new NotifyText(config.round, this, this.roundService, lang)
    this.deathlog = new Deathlog(this, playerService, teamService)
    this.motd = new Motd(config, this, keybindService)
    this.panel = new Panel(config.name, this, keybindService, arenaService)
    this.spectate = new Spectate(this, playerService)
    this.weaponHud = new WeaponHud(this, playerService)
    this.winner = new Winner(this, teamService)
    this.effects = new Effects(config.effects, this, playerService)
  }

  setCursor(visible: boolean, component: string, forceClose?: boolean) {
    if (forceClose) {
      this.visible = {}
    }

    this.visible = {...this.visible, [component]: visible}

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

  @event('render')
  disableControlActions() {
    mp.game.controls.disableControlAction(24, 37, true)
    mp.game.controls.disableControlAction(24, 157, true)
    mp.game.ui.hideHudComponentThisFrame(7)
    mp.game.ui.hideHudComponentThisFrame(9)
  }

  @logClient
  @event(Events["tdm.cef.log"])
  log(...args: any[]) {}

  @event(Events["tdm.popup.push"])
  popup(message: Lang | string, type: string = 'info') {
    this.cef.call(Events["tdm.popup.push"], this.lang.get(<Lang>message), type)
  }

  @event(Events["tdm.ui.ready"])
  ready() {
    mp.events.callRemote(Events["tdm.client.ready"])
    this.refreshCefLanguage()
  }

  @event(Events["tdm.language"])
  refreshCefLanguage(lang?: string) {
    if (typeof lang === 'string') {
      try {
        this.lang.change(JSON.parse(lang))
      } catch (err) {
        console.error(err)
      }
    }

    this.cef.call(Events["tdm.language"], this.lang.language)
  }
}