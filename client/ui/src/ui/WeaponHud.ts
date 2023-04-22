import { event, eventable } from "../../../../core/client";
import { Events } from "../../../../core/src/types";
import PlayerService from "../PlayerService";
import UIService from "../UIService";

@eventable
export default class WeaponHud {
  constructor(
    readonly uiService: UIService,
    readonly playerService: PlayerService,
  ) {}
  
  @event(Events["tdm.player.switch_weapon"])
  switchWeapon(weapon: string) {
    this.uiService.cef.call(Events["tdm.cef.weapon_hud"], this.data, weapon)
  }
  
  @event([Events["tdm.round.end"], Events["tdm.round.prepare"]])
  update() {
    this.uiService.cef.call(Events["tdm.cef.weapon_hud"], this.data)
  }

  @event(Events["tdm.round.remove"])
  roundRemove() {
    this.uiService.cef.call(Events["tdm.cef.weapon_hud"])
  }

  get data() {
    const {
      primary,
      secondary,
      melee,
    } = this.playerService.getVariable(this.playerService.local, 'weaponSlot') || {}

    return {
      primary,
      secondary,
      melee,
    }
  }
}