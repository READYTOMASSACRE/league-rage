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
  @event("playerReady")
  playerReady(player: PlayerMp) {
    this.playerService.setTeam(player, tdm.Team.spectators)
  }

  @log
  @event(Events["tdm.player.ready"])
  clientPlayerReady(player: PlayerMp) {
    const state = this.playerService.getState(player)
    if (state !== tdm.State.idle) {
      player.outputChatBox(this.lang.get(Lang["error.team.player_is_busy"]))
    }

    this.playerService.setState(player, tdm.State.select)
    player.call(Events["tdm.team.select"])
  }

  @log
  @event(Events["tdm.team.select"])
  teamSelect(player: PlayerMp, team?: tdm.Team) {
    if (!this.config[team]) {
      player.outputChatBox(this.lang.get(Lang["error.team.not_found"], { team }))
    }

    const state = this.playerService.getState(player)
    if (state !== tdm.State.select) {
      player.outputChatBox(this.lang.get(Lang["error.team.player_is_busy"]))
    }

    return this.change(player, team)
  }

  @log
  @command(['team', 'changeteam', 't'], {desc: Lang["cmd.change_team"]})
  changeTeam(player: PlayerMp, fullText: string, description: string, id: string) {
    if (!id) {
      return this.teamSelect(player)
    }

    if (!this.hash[id]) {
      player.outputChatBox(description)
      return
    }

    return this.change(player, this.hash[id])
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
  change(p: number | PlayerMp, team: tdm.Team) {
    const state = this.playerService.getState(p)
    const player = <PlayerMp>p

    if (![tdm.State.idle, tdm.State.select].includes(state)) {
      player.outputChatBox(this.lang.get(Lang["error.team.player_not_in_lobby"]))
    }

    this.playerService.setTeam(p, team)
    this.playerService.setState(p, tdm.State.idle)
    this.playerService.spawnLobby(p)

    player.outputChatBox(this.lang.get(Lang["tdm.team.change"], { team }))
  }

  getName(team: tdm.Team | 'draw') {
    if (team === 'draw') {
      return team
    }

    return this.config[team]?.name || team
  }

  get hash() {
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