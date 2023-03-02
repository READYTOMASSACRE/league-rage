import { log, eventable, event, ensurePlayer, commandable, command, helpers, types } from "../../league-core";
import PlayerService from "./PlayerService";

@eventable
@commandable
export default class TeamService {
  constructor(readonly playerService: PlayerService) {}
  
  @log
  @event(RageEnums.EventKey.PLAYER_READY)
  playerReady(player: PlayerMp) {
    this.playerService.setTeam(player, types.tdm.Team.attackers)
  }

  @log
  @command(['team', 'changeteam', 't'], {desc: 'Usage /{{cmdName}} <id|string> to change team. Example: /t att|def|spec|0|1|2'})
  changeTeam(player: PlayerMp, fullText: string, description: string, id: string) {
    const hash = {
      att: types.tdm.Team.attackers,
      attackers: types.tdm.Team.attackers,
      def: types.tdm.Team.defenders,
      defenders: types.tdm.Team.defenders,
      spec: types.tdm.Team.spectators,
      spectators: types.tdm.Team.spectators,
      0: types.tdm.Team.attackers,
      1: types.tdm.Team.defenders,
      2: types.tdm.Team.spectators,
    }

    if (!id || !hash[id]) {
      player.outputChatBox(description)
      return
    }

    return this.change(player, hash[id])
  }

  @log
  getPlayersByTeam(id: types.tdm.Team): number[] {
    return mp.players.toArray().filter(player => this.playerService.getTeam(player) === id).map(helpers.toId)
  }

  @log
  getAttackers() {
    return this.getPlayersByTeam(types.tdm.Team.attackers)
  }

  @log
  getDefenders() {
    return this.getPlayersByTeam(types.tdm.Team.defenders)
  }

  @log
  getSpectators() {
    return this.getPlayersByTeam(types.tdm.Team.spectators)
  }

  @log
  @ensurePlayer
  change(p: number | PlayerMp, team: types.tdm.Team) {
    const state = this.playerService.getState(p)

    if (state !== types.tdm.State.idle) {
      (p as PlayerMp).outputChatBox('Вы не в лобби')
    }

    this.playerService.setTeam(p, team)

    const hash = {
      [types.tdm.Team.attackers]: 'attackers',
      [types.tdm.Team.defenders]: 'defenders',
      [types.tdm.Team.spectators]: 'spectators',
    };

    (p as PlayerMp).outputChatBox(`Команда изменена на ${hash[team]}`)
  }
}