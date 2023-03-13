import { event, eventable, logClient } from "../../../league-core/client";
import { decorate } from "../../../league-core/src/helpers";
import { cef, Events } from "../../../league-core/src/types";
import { Entity } from "../../../league-core/src/types/tdm";
import { Config as WeaponConfig } from "../../../league-core/src/types/weapon";
import { ILanguage, Lang } from "../../../league-lang/language";
import DummyService from "../DummyService";
import PopupError from "../error/PopupError";
import KeybindService, { key } from "../KeybindService";
import PlayerService from "../PlayerService";
import UIService from "../UIService";

@eventable
export default class WeaponRequest {
  public visible: boolean = false
  private data: Record<string, cef.Weapon[]>

  constructor(
    readonly config: WeaponConfig,
    readonly uiService: UIService,
    readonly keybindService: KeybindService,
    readonly playerService: PlayerService,
    readonly dummyService: DummyService,
  ) {
    this.request = this.request.bind(this)

    this.keybindService.unbind(key.b, true)
    this.keybindService.bind(key.b, true, this.request)
    this.data = this.getData()
  }
  
  @event(Events["tdm.weapon.request"])
  request(visible?: boolean) {
    // todo check if round is running and player can choice weapon
    try {
      visible = typeof visible !== 'undefined' ? visible : !this.visible

      const started = this.dummyService.get(Entity.ROUND, 'started')

      if (!started) {
        throw new PopupError(Lang["tdm.round.is_not_running"])
      }

      if (!this.playerService.canSelectWeapon) {
        throw new PopupError(Lang["error.weapon.is_busy"])
      }

      this.visible = visible
    } catch (err) {
      if (err instanceof PopupError) {
        this.uiService.popup(err.message, 'error')
        this.visible = false
      } else {
        mp.console.logError(err.stack)
      }
    } finally {
      this.uiService.cef.call(Events["tdm.weapon.request"], this.data, this.visible)
      this.uiService.setCursor(this.visible, 'weapon_request')
    }
  }

  @logClient
  @event(Events["tdm.weapon.submit"])
  submit(weapon: string) {
    mp.events.callRemote(Events["tdm.weapon.submit"], weapon)
    this.request(false)
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