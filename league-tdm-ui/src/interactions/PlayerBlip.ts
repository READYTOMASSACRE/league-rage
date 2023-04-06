import { event, eventable, logClient } from "../../../league-core/client";
import PlayerService from "../PlayerService";
import TeamService from "../TeamService";
import console from "../helpers/console";
import { isPlayer } from "../helpers/guards";

@eventable
export default class PlayerBlip {
  static setBlipCategory = '0x234CDD44D996FD9A'
  static showHeadingIndicatorOnBlip = '0x5FBCA48327B914DF'
  static setBlipAsFriendly = '0x6F6F290102C02AB4'

  constructor(
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
  ) {}

  @logClient
  @event('entityStreamIn')
  streamIn(entity: EntityMp) {
    try {
      if (isPlayer(entity)) {
        entity.destroyBlip()
  
        const local = this.playerService.getTeam()
        const enemy = this.playerService.getTeam(entity)
        const team = this.teamService.getTeam(local)

        if (local !== enemy || !team) return
        
        entity.createBlip(1)
  
        if (typeof team.blipColor !== 'undefined') {
          entity.setBlipColor(team.blipColor)
        } else {
          mp.game.invoke(PlayerBlip.setBlipAsFriendly, entity.blip, true)  
        }
  
        mp.game.invoke(PlayerBlip.setBlipCategory, entity.blip, 7)
        mp.game.invoke(PlayerBlip.showHeadingIndicatorOnBlip, entity.blip, true)
      }
    } catch (err) {
      console.error(err)
    }
  }
}