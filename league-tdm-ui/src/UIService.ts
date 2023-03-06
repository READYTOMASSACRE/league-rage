import { command, commandable, event, eventable, logClient } from "../../league-core/client";
import { Enviroment, Events } from "../../league-core/src/types";

@eventable
@commandable
export default class UIService {
  public cef: BrowserMp
  private chatVisible: boolean = false


  constructor(readonly url: string) {
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

  @logClient
  @event("playerReady")
  @command('reload')
  loadCef() {
    if (this.cef) {
      this.cef.destroy()
    }

    this.cef = mp.browsers.new(this.url)
    this.cef.markAsChat()

    return this.url
  }

  @logClient
  @event(Events["tdm.chat.push"])
  chatPush(msg: string, from?: Enviroment) {
    if (from === Enviroment.cef) {
      mp.events.callRemote(Events["tdm.chat.push"], msg)
    } else if (from === Enviroment.server) {
      this.cef.call(Events["tdm.chat.push"], msg)
    }
  }

  @logClient
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

  @logClient
  @event(Events["tdm.scoreboard.toggle"])
  scoreboardToggle(visible: boolean) {
   this.cef.call(Events['tdm.scoreboard.toggle'], visible)
  }
}