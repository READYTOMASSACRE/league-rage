import { event, eventable } from "../../../league-core/client";
import { Events } from "../../../league-core/src/types";
import KeybindService from "../KeybindService";
import UIService from "../UIService";

@eventable
export default class WeaponRequest {
  public visible: boolean = false
  constructor(readonly uiService: UIService, keybindService: KeybindService) {}

  @event(Events["tdm.weapon.request"])
  weaponRequest(weapon: string) {
    mp.events.callRemote(Events["tdm.weapon.request"], weapon)
  }
}