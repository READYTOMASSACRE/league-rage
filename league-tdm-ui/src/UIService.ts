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

    mp.keys.unbind(0x54, true, this.chatToggle)
    mp.keys.bind(0x54, true, this.chatToggle)
  }

  @logClient
  @event("playerReady")
  @command('reload')
  loadCef() {
    if (this.cef) {
      this.cef.destroy()
    }

    this.cef = mp.browsers.new(this.url)

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
}