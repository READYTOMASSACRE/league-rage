import { event, eventable } from "../../../league-core/client";
import { Events } from "../../../league-core/src/types";
import KeybindService, { key } from "../KeybindService";
import UIService from "../UIService";

@eventable
export default class Debug {
  static key = 'debug'

  private visible: boolean = false

  constructor(
    readonly uiService: UIService,
    readonly keybindService: KeybindService,
  ) {
    this.toggle = this.toggle.bind(this)
    this.keybindService.unbind(key.vk_f9, true, Debug.key)
    this.keybindService.bind(key.vk_f9, true, Debug.key, this.toggle)

    mp.events.add(Events["tdm.cef.debug"], (args: string[], type?: string) => this.debug(args, type))
  }

  private debug(args: string[], type: string = 'log') {
    try {
      this.uiService.cef.call(Events["tdm.cef.debug"], args, type)
    } catch (err) {
      mp.console.logInfo(err.stack)
    }
  }

  @event(Events["tdm.cef.debug_toggle"])
  toggle(t?: boolean) {
    t = typeof t !== 'undefined' ? t : !this.visible
    this.visible = t
    this.uiService.cef.call(Events["tdm.cef.debug_toggle"], this.visible)
    this.uiService.setCursor(this.visible, Debug.key)
  }
}