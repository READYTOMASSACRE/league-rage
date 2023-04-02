import { command, commandable, event, eventable, helpers, logClient } from "../../league-core/client";
import { Events } from "../../league-core/src/types";
import { WeaponSlot } from "../../league-core/src/types/tdm";
import console from "./helpers/console";
import KeybindService, { key } from "./KeybindService";
import PlayerService from "./PlayerService";
import weapons from "./weapons";

@eventable
@commandable
export default class WeaponService {
  static key = 'weapon_service'
  static isPedArmed = '0x475768A975D5AD17'
  static setCurrentPedWeapon = '0xADF692B254977C0C'
  static exceptFists = 7

  private throttledIncomingUpdate: Function
  private damage: number = 0
  private hit: number = 0
  private source?: number
  private weapon?: string
  private rendering: boolean = true

  constructor(
    readonly playerService: PlayerService,
    readonly keybindService: KeybindService,
  ) {
    this.throttledIncomingUpdate = helpers.throttle(() => this.incomingUpdate(), 100)
    mp.game.weapon.unequipEmptyWeapons = false

    this.keybindService.unbind([key["1"], key["2"], key["3"]], true, WeaponService.key)
    this.keybindService.bind(key["1"], true, WeaponService.key, () => this.switchPlayerWeapon(WeaponSlot.primary))
    this.keybindService.bind(key["2"], true, WeaponService.key, () => this.switchPlayerWeapon(WeaponSlot.secondary))
    this.keybindService.bind(key["3"], true, WeaponService.key, () => this.switchPlayerWeapon(WeaponSlot.melee))
  }

  @event('render')
  render() {
    if (!this.rendering) return

    try {
      mp.game.player.setHealthRechargeMultiplier(0.0);
		  mp.game.player.restoreStamina(100)

      if (mp.game.invoke(WeaponService.isPedArmed, this.playerService.local.handle, WeaponService.exceptFists)) {
        mp.game.controls.disableControlAction(0, 140, true)
        mp.game.controls.disableControlAction(0, 141, true)
        mp.game.controls.disableControlAction(0, 142, true)
      }
    } catch (err) {
      console.error(err)
      this.rendering = false
    }
  }

  @logClient
  @event("incomingDamage")
  incomingDamage(
    sourceEntity: EntityMp,
    sourcePlayer: PlayerMp,
    targetPlayer: PlayerMp,
    weapon: number,
    boneIndex: number,
    damage: number
  ) {
    try {
      this.hit++
      this.damage += damage
      this.source = sourcePlayer.remoteId
      this.weapon = weapons[weapon]

      this.throttledIncomingUpdate()

      return true
    } catch (err) {
        mp.console.logError(err.stack)
    }
  }

  incomingUpdate() {
    if (
      typeof this.source === 'undefined' ||
      typeof this.weapon === 'undefined'
    ) {
      return
    }

    mp.events.callRemote(Events["tdm.player.incoming_damage"], this.source, this.weapon, this.hit, this.damage)

    this.hit = 0
    this.damage = 0
    this.source = undefined
    this.weapon = undefined
  }

  @logClient
  private switchPlayerWeapon(slot: WeaponSlot) {
    const weaponSlot = this.playerService.getVariable(this.playerService.local, 'weaponSlot')
    const weapon = weaponSlot[slot]

    if (!weapon) return

    mp.game.invoke(WeaponService.setCurrentPedWeapon, this.playerService.local.handle, mp.game.joaat('weapon_' + weapon) >> 0, true)
    mp.events.call(Events["tdm.player.switch_weapon"], weapon)
  }
}