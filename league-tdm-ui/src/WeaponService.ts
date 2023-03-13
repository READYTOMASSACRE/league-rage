import { event, eventable, logClient, helpers } from "../../league-core/client";
import { Events } from "../../league-core/src/types";
import PlayerService from "./PlayerService";
import weapons from "./weapons";

@eventable
export default class WeaponService {
  private throttledIncomingUpdate: Function
  private damage: number = 0
  private hit: number = 0
  private source?: number
  private weapon?: string

  constructor(readonly playerService: PlayerService) {
    this.throttledIncomingUpdate = helpers.throttle(() => this.incomingUpdate(), 100)
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