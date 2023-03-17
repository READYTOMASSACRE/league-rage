import { log, eventable, event, ensurePlayer, commandable, command, helpers } from "../../league-core";
import { Events, IConfig, tdm } from "../../league-core/src/types";
import { TeamConfig } from "../../league-core/src/types/tdm";
import { ILanguage, Lang } from "../../league-lang/language";
import PlayerService from "./PlayerService";

@eventable
@commandable
export default class TeamService {
  constructor(
    readonly config: TeamConfig,
    readonly playerService: PlayerService,
    readonly lang: ILanguage,
  ) {}

  @log
  @event(Events["tdm.player.ready"])
  clientPlayerReady(player: PlayerMp) {
    if (this.playerService.getState(player) !== tdm.State.idle) {
      return player.outputChatBox(this.lang.get(Lang["error.team.player_is_busy"]))
    }

    return this.change(player, tdm.Team.attackers, 'u_m_m_jesus_01')
    // return this.teamSelectRequest(player)
  }

  @log
  @event(Events["tdm.team.select"])
  teamSelect(player: PlayerMp, team?: tdm.Team, model?: string) {
    if (typeof team === 'undefined') {
      return this.teamSelectRequest(player)
    }

    if (!this.config[team]) {
      return player.outputChatBox(this.lang.get(Lang["error.team.not_found"], { team }))
    }

    if (this.playerService.getState(player) !== tdm.State.select) {
      return player.outputChatBox(this.lang.get(Lang["error.team.player_is_busy"]))
    }

    return this.change(player, team, model)
  }

  @log
  @command(['team', 'changeteam', 't'], {desc: Lang["cmd.change_team"]})
  changeTeam(player: PlayerMp, fullText: string, description: string, id: string) {
    if (!id) {
      return this.teamSelect(player)
    }

    const team = this.hash[id]

    if (!team) {
      player.outputChatBox(description)
      return
    }

    const [model] = this.config[team].skins

    return this.change(player, team, model)
  }

  private teamSelectRequest(player: PlayerMp) {
    this.playerService.setState(player, tdm.State.select)
    return player.call(Events["tdm.team.select"])
  }

  @log
  getPlayersByTeam(id: tdm.Team): number[] {
    return mp.players.toArray().filter(player => this.playerService.getTeam(player) === id).map(helpers.toId)
  }

  @log
  getAttackers() {
    return this.getPlayersByTeam(tdm.Team.attackers)
  }

  @log
  getDefenders() {
    return this.getPlayersByTeam(tdm.Team.defenders)
  }

  @log
  getSpectators() {
    return this.getPlayersByTeam(tdm.Team.spectators)
  }

  @log
  @ensurePlayer
  change(p: number | PlayerMp, team: tdm.Team, model: string) {
    const state = this.playerService.getState(p)
    const player = <PlayerMp>p

    if (![tdm.State.idle, tdm.State.select].includes(state)) {
      player.outputChatBox(this.lang.get(Lang["error.team.player_not_in_lobby"]))
    }

    this.playerService.setTeam(p, team)
    this.playerService.setState(p, tdm.State.idle)
    this.playerService.spawnLobby(p)
    this.playerService.setModel(p, mp.joaat(model))

    player.outputChatBox(this.lang.get(Lang["tdm.team.change"], { team }))
  }

  getName(team: tdm.Team | 'draw') {
    if (team === 'draw') {
      return team
    }

    return this.config[team]?.name || team
  }

  get hash(): Record<string | number, tdm.Team> {
    return {
      att: tdm.Team.attackers,
      attackers: tdm.Team.attackers,
      def: tdm.Team.defenders,
      defenders: tdm.Team.defenders,
      spec: tdm.Team.spectators,
      spectators: tdm.Team.spectators,
      0: tdm.Team.attackers,
      1: tdm.Team.defenders,
      2: tdm.Team.spectators,
    }
  }
}