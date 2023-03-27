import { event, eventable } from "../../../league-core/client";
import { Enviroment, Events } from "../../../league-core/src/types";
import { ChatItem } from "../../../league-core/src/types/cef";
import KeybindService, { key } from "../KeybindService";
import UIService from "../UIService";

@eventable
export default class Chat {
  static key = 'chat'
  public visible: boolean = false

  constructor(readonly uiService: UIService, readonly keybindService: KeybindService) {
    mp.gui.chat.activate(false)
    mp.gui.chat.show(false)

    this.toggle = this.toggle.bind(this)

    this.keybindService.unbind(key.t, true, Chat.key)
    this.keybindService.bind(key.t, true, Chat.key, this.toggle)
  }

  @event(Events["tdm.chat.push"])
  push(msg: string | ChatItem, from?: Enviroment) {
    if (from === Enviroment.cef) {
      mp.events.callRemote(Events["tdm.chat.push"], msg)
    } else if ([Enviroment.server, Enviroment.client].includes(from)) {
      if (typeof msg === 'string') {
        msg = { message: [[msg, '#fff']]}
      }

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
    this.keybindService.typing = this.visible

    return this.visible
  }

  @event('render')
  render() {
    if (!this.visible) {
      return
    }

    mp.game.controls.disableAllControlActions(2)
  }
}