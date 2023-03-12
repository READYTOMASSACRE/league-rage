import { event, eventable, logClient } from "../../../league-core/client";
import { decorate } from "../../../league-core/src/helpers";
import { cef, Events, tdm } from "../../../league-core/src/types";
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
  
  @logClient
  @event(Events["tdm.weapon.request"])
  request(visible?: boolean) {
    // todo check if round is running and player can choice weapon
    try {
      this.visible = typeof visible !== 'undefined' ? visible : !this.visible
      this.uiService.cef.call(Events["tdm.weapon.request"], this.getData(), this.visible)
      this.uiService.setCursor(this.visible, 'weapon_request')
    } catch (err) {
      mp.console.logError(err.stack)
    }
  }

  @logClient
  @event(Events["tdm.weapon.submit"])
  submit(weapon: string) {
    mp.events.callRemote(Events["tdm.weapon.submit"], weapon)
  }

  private getData() {
    return Object.entries(this.config.category).reduce((acc, [categoryName, weapons]) => {
      acc[categoryName] = weapons.map(w => this.getWeaponData(w, this.config.damage.category[categoryName]))

      return acc
    }, {})
  }

  private getWeaponData(weapon: string, damage?: number): cef.Weapon {
    return {
      name: weapon,
      damage: this.config.damage.weapon[weapon] || damage || 0,
      firerate: 0,
      range: 0,
      magazine: 0
    }
  }
}