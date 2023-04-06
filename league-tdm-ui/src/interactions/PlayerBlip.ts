import { event, eventable, logClient } from "../../../league-core/client";
import { TeamConfig } from "../../../league-core/src/types/tdm";
import PlayerService from "../PlayerService";
import { isPlayer } from "../helpers/guards";

@eventable
export default class PlayerBlip {
  static setBlipCategory = '0x234CDD44D996FD9A'
  static showHeadingIndicatorOnBlip = '0x5FBCA48327B914DF'
  static setBlipAsFriendly = '0x6F6F290102C02AB4'

  constructor(
    readonly config: TeamConfig,
    readonly playerService: PlayerService
  ) {}

  @logClient
  @event('entityStreamIn')
  streamIn(entity: EntityMp) {
    if (isPlayer(entity)) {
      entity.destroyBlip()

      const local = this.playerService.getTeam()
      const enemy = this.playerService.getTeam(entity)

      if (local !== enemy) return
      
      entity.createBlip(1)

      if (typeof this.config[local].blipColor !== 'undefined') {
        entity.setBlipColor(this.config[local].blipColor)
      } else {
        mp.game.invoke(PlayerBlip.setBlipAsFriendly, entity.blip, true)  
      }

      mp.game.invoke(PlayerBlip.setBlipCategory, entity.blip, 7)
      mp.game.invoke(PlayerBlip.showHeadingIndicatorOnBlip, entity.blip, true)
    }
  }
}