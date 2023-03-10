import { event, eventable } from "../../../league-core/client";
import { Enviroment, Events } from "../../../league-core/src/types";
import KeybindService, { key } from "../KeybindService";
import UIService from "../UIService";

@eventable
export default class Chat {
  public visible: boolean = false

  constructor(readonly uiService: UIService, readonly keybindService: KeybindService) {
    mp.gui.chat.activate(false)
    mp.gui.chat.show(false)

    this.toggle = this.toggle.bind(this)

    this.keybindService.unbind(key.t, true)
    this.keybindService.bind(key.t, true, this.toggle)
  }

  @event(Events["tdm.chat.push"])
  push(msg: string, from?: Enviroment) {
    if (from === Enviroment.cef) {
      mp.events.callRemote(Events["tdm.chat.push"], msg)
    } else if (from === Enviroment.server) {
      this.uiService.cef.call(Events["tdm.chat.push"], msg)
    }
  }

  @event(Events["tdm.chat.toggle"])
  toggle(visible: boolean, force?: boolean) {
    const old = this.visible

    visible = typeof visible !== 'undefined' ?
      visible :
      !this.visible

    if (force || !this.visible) {
      this.visible = visible
    }

    if (old !== this.visible) {
      this.uiService.cef.call(Events["tdm.chat.toggle"], this.visible)
    }

    this.uiService.setCursor(this.visible, 'chat')

    return this.visible
  }
}