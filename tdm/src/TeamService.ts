import { toId } from "./helpers";
import { command } from "./helpers/decorators/command";
import { commandable } from "./helpers/decorators/commandable";
import { ensurePlayer } from "./helpers/decorators/ensurePlayer";
import { event } from "./helpers/decorators/event";
import { eventable } from "./helpers/decorators/eventable";
import { log } from "./helpers/decorators/log";
import { State, Team } from "./types";
import PlayerService from "./PlayerService";

@eventable
@commandable
export default class TeamService {
  constructor(readonly playerService: PlayerService) {}
  
  @log
  @event(RageEnums.EventKey.PLAYER_READY)
  playerReady(player: PlayerMp) {
    this.playerService.setTeam(player, Team.attackers)
  }

  @log
  @command(['team', 'changeteam', 't'], {desc: 'Usage /{{cmdName}} <id|string> to change team. Example: /t att|def|spec|0|1|2'})
  changeTeam(player: PlayerMp, fullText: string, description: string, id: string) {
    const hash = {
      att: Team.attackers,
      attackers: Team.attackers,
      def: Team.defenders,
      defenders: Team.defenders,
      spec: Team.spectators,
      spectators: Team.spectators,
      0: Team.attackers,
      1: Team.defenders,
      2: Team.spectators,
    }

    if (!id || !hash[id]) {
      player.outputChatBox(description)
      return
    }

    return this.change(player, hash[id])
  }

  @log
  getPlayersByTeam(id: Team): number[] {
    return mp.players.toArray().filter(player => this.playerService.getTeam(player) === id).map(toId)
  }

  @log
  getAttackers() {
    return this.getPlayersByTeam(Team.attackers)
  }

  @log
  getDefenders() {
    return this.getPlayersByTeam(Team.defenders)
  }

  @log
  getSpectators() {
    return this.getPlayersByTeam(Team.spectators)
  }

  @log
  @ensurePlayer
  change(p: number | PlayerMp, team: Team) {
    const state = this.playerService.getState(p)

    if (state !== State.idle) {
      (p as PlayerMp).outputChatBox('Вы не в лобби')
    }

    this.playerService.setTeam(p, team)

    const hash = {
      [Team.attackers]: 'attackers',
      [Team.defenders]: 'defenders',
      [Team.spectators]: 'spectators',
    };

    (p as PlayerMp).outputChatBox(`Команда изменена на ${hash[team]}`)
  }
}