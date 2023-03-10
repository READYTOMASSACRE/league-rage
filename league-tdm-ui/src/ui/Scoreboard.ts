import { event, eventable } from "../../../league-core/client";
import { Events } from "../../../league-core/src/types";
import KeybindService, { key } from "../KeybindService";
import UIService from "../UIService";

@eventable
export default class Scoreboard {
  private visible: boolean = false

  constructor(readonly uiService: UIService, readonly keybindService: KeybindService) {
    this.keybindService.unbind(key.tab, [true, false])
    this.keybindService.bind(key.tab, [true, false], () => this.toggle(true))
  }

  @event(Events["tdm.scoreboard.toggle"])
  toggle(visible: boolean) {
    this.visible = visible
    this.uiService.setCursor(visible, 'scoreboard')
    this.uiService.cef.call(Events['tdm.scoreboard.toggle'], this.visible)
  }
}