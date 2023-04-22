import { event, eventable, console } from "../../../../core/client";
import { Events } from "../../../../core/src/types";
import PlayerService from "../PlayerService";
import TeamService from "../TeamService";
import UIService from "../UIService";

@eventable
export default class Deathlog {
  constructor(
    readonly uiService: UIService,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
  ) {}

  @event(Events["tdm.player.kill"])
  kill(victim: number, killer: number, weapon: string) {
    try {
      const victimPlayer = mp.players.atRemoteId(victim)
      const killerPlayer = mp.players.atRemoteId(killer)
  
      if (!mp.players.exists(victimPlayer) || !mp.players.exists(killerPlayer)) {
        return
      }
  
      const victimTeam = this.playerService.getTeam(victimPlayer)
      const killerTeam = this.playerService.getTeam(killerPlayer)
      
      const killerColor = this.teamService.getTeam(killerTeam).color
      const victimColor = this.teamService.getTeam(victimTeam).color

      this.uiService.cef.call(Events["tdm.player.kill"], {
        killer: {
          name: killerPlayer.name,
          color: killerColor,
        },
        victim: {
          name: victimPlayer.name,
          color: victimColor,
        },
        weapon
      })
    } catch (err) {
      console.error(err)
    }
  }
}