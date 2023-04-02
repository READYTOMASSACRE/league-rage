import { event, eventable, logClient } from "../../../league-core/client";
import { Events } from "../../../league-core/src/types";
import PlayerService from "../PlayerService";
import UIService from "../UIService";

@eventable
export default class WeaponHud {
  constructor(
    readonly uiService: UIService,
    readonly playerService: PlayerService,
  ) {}

  @event(Events["tdm.player.weapon_slot"])
  changeWeaponSlot(id: number, slot: string, weapon: string) {
    if (id === this.playerService.local.remoteId) {
      this.uiService.cef.call(Events["tdm.cef.weapon_hud"], this.data)
    }
  }

  @event(Events["tdm.player.switch_weapon"])
  switchWeapon(weapon: string) {
    this.uiService.cef.call(Events["tdm.cef.weapon_hud"], this.data, weapon)
  }

  get data() {
    const {
      primary,
      secondary,
      melee
    } = this.playerService.getVariable(this.playerService.local, 'weaponSlot') || {}

    return {
      primary,
      secondary,
      melee
    }
  }
}