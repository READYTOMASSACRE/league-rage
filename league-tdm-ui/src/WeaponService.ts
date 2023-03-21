import { event, eventable, helpers, logClient } from "../../league-core/client";
import { Events } from "../../league-core/src/types";
import console from "./helpers/console";
import PlayerService from "./PlayerService";
import weapons from "./weapons";

@eventable
export default class WeaponService {
  static isPedArmed = '0x475768A975D5AD17'
  static exceptFists = 7

  private throttledIncomingUpdate: Function
  private damage: number = 0
  private hit: number = 0
  private source?: number
  private weapon?: string
  private rendering: boolean = true

  constructor(readonly playerService: PlayerService) {
    this.throttledIncomingUpdate = helpers.throttle(() => this.incomingUpdate(), 100)
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
}