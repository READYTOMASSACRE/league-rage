import { event, eventable, logClient } from "../../league-core/client";
import { Events } from "../../league-core/src/types";
import PlayerService from "./PlayerService";
import weapons from "./weapons";

@eventable
export default class WeaponService {
  constructor(readonly playerService: PlayerService) {}

  @logClient
  @event("outgoingDamage")
  outgoingDamage(
    sourceEntity: EntityMp,
    targetEntity: EntityMp,
    targetPlayer: PlayerMp,
    weapon: number,
    boneIndex: number,
    damage: number
  ): boolean | void {
    try {
      mp.events.callRemote(Events["tdm.player.damage.outgoing"], targetPlayer.remoteId, weapons[weapon], damage)

      return true
      } catch (err) {
        mp.console.logError(err.stack)
    }
  }
}