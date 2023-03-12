import { event, eventable } from "../../../league-core/client";
import { Events, tdm } from "../../../league-core/src/types";
import { Config as WeaponConfig } from "../../../league-core/src/types/weapon";
import KeybindService, { key } from "../KeybindService";
import UIService from "../UIService";

@eventable
export default class WeaponRequest {
  public visible: boolean = false
  constructor(
    readonly uiService: UIService,
    readonly keybindService: KeybindService,
    readonly config: WeaponConfig
  ) {
    this.request = this.request.bind(this)

    this.keybindService.unbind(key.b, true)
    this.keybindService.bind(key.b, true, this.request)
  }

  @event(Events["tdm.weapon.request"])
  request() {
    this.uiService.cef.call(Events["tdm.weapon.request"], this.config.category)
  }

  @event(Events["tdm.weapon.submit"])
  submit(weapon: string) {
    mp.events.callRemote(Events["tdm.weapon.submit"], weapon)
  }
}