import { event, eventable } from "../../../league-core/client";
import { toColor } from "../../../league-core/src/helpers";
import { Events } from "../../../league-core/src/types";
import { TeamConfig } from "../../../league-core/src/types/tdm";
import console from "../helpers/console";
import PlayerService from "../PlayerService";
import UIService from "../UIService";

@eventable
export default class Deathlog {
  constructor(
    readonly config: TeamConfig,
    readonly uiService: UIService,
    readonly playerService: PlayerService,
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
      const killerTeam= this.playerService.getTeam(killerPlayer)
  
      this.uiService.cef.call(Events["tdm.player.kill"], {
        killer: {
          name: killerPlayer.name,
          color: toColor(this.config[killerTeam].color),
        },
        victim: {
          name: victimPlayer.name,
          color: toColor(this.config[victimTeam].color),
        },
        weapon
      })
    } catch (err) {
      console.error(err)
    }
  }
}