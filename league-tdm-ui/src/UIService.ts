import { command, commandable, event, eventable, logClient } from "../../league-core/client";
import { Enviroment, Events } from "../../league-core/src/types";
import { ILanguage } from "../../league-lang/language";

@eventable
@commandable
export default class UIService {
  public cef: BrowserMp
  private chatVisible: boolean = false
  private scoreboardVisible: boolean = false

  constructor(readonly url: string, readonly lang: ILanguage) {
    mp.gui.chat.activate(false)
    mp.gui.chat.show(false)

    mp.console.clear()
    mp.console.reset()

    this.chatToggle = this.chatToggle.bind(this)

    mp.keys.unbind(0x54, true)
    mp.keys.bind(0x54, true, this.chatToggle)

    mp.keys.unbind(0x09, true)
    mp.keys.bind(0x09, true, () => this.scoreboardToggle(true))
    mp.keys.unbind(0x09, false)
    mp.keys.bind(0x09, false, () => this.scoreboardToggle(false))
  }

  @event(Events["tdm.player.ready"])
  @command('reload')
  loadCef() {
    if (this.cef) {
      this.cef.destroy()
    }

    this.cef = mp.browsers.new(this.url)
    this.cef.markAsChat()

    return this.url
  }

  @event(Events["tdm.chat.push"])
  chatPush(msg: string, from?: Enviroment) {
    if (from === Enviroment.cef) {
      mp.events.callRemote(Events["tdm.chat.push"], msg)
    } else if (from === Enviroment.server) {
      this.cef.call(Events["tdm.chat.push"], msg)
    }
  }

  @event(Events["tdm.chat.toggle"])
  chatToggle(visible: boolean, force?: boolean) {
    const old = this.chatVisible

    visible = typeof visible !== 'undefined' ?
      visible :
      !this.chatVisible

    if (force || !this.chatVisible) {
      this.chatVisible = visible
    }

    if (old !== this.chatVisible) {
      this.cef.call(Events["tdm.chat.toggle"], this.chatVisible)
    }

    mp.gui.cursor.visible = this.chatVisible // todo fixme

    return this.chatVisible
  }

  @event('render')
  disableControlActions() {
    mp.game.controls.disableControlAction(24, 37, true)
    mp.game.controls.disableControlAction(24, 157, true)

    if (this.chatVisible) {
      mp.game.controls.disableAllControlActions(2)
    }
  }

  @event(Events["tdm.scoreboard.toggle"])
  scoreboardToggle(visible: boolean) {
    this.scoreboardVisible = visible
    mp.gui.cursor.visible = this.scoreboardVisible // todo fixme

    this.cef.call(Events['tdm.scoreboard.toggle'], this.scoreboardVisible)
  }

  @logClient
  @event(Events["tdm.cef.log"])
  cefLog(...args: any[]) {}

  @event(Events["tdm.team.select_toggle"])
  teamSelectToggle(team: string, toggle: boolean) {
    this.cef.call(Events["tdm.team.select_toggle"], team, toggle)
  }
}