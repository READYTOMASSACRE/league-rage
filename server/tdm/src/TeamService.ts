import { eventable, event, ensurePlayer, commandable, command, helpers, catchError, BroadCastError } from "../../../core";
import { deepclone } from "../../../core/src/helpers";
import DummyService from "../../../core/src/server/DummyService";
import { Events, tdm } from "../../../core/src/types";
import { Entity } from "../../../core/src/types/tdm";
import { ILanguage, Lang } from "../../../lang/language";
import PlayerService from "./PlayerService";
import ErrorNotifyHandler from "./error/ErrorNotifyHandler";

@eventable
@commandable
export default class TeamService {
  constructor(
    readonly playerService: PlayerService,
    readonly lang: ILanguage,
  ) {}

  @event(Events["tdm.player.ready"])
  clientPlayerReady(player: PlayerMp) {
    if (this.playerService.getState(player) !== tdm.State.idle) {
      return player.outputChatBox(this.lang.get(Lang["error.team.player_is_busy"]))
    }

    // return this.change(player, tdm.Team.attackers, 'u_m_m_jesus_01')
    return this.teamSelectRequest(player)
  }

  @catchError(ErrorNotifyHandler)
  @event(Events["tdm.team.select"])
  teamSelect(player: PlayerMp, team?: tdm.Team, model?: string) {
    if (typeof team === 'undefined') {
      return this.teamSelectRequest(player)
    }

    const teamOptions = this.getTeam(team)

    if (!teamOptions) {
      throw new BroadCastError(Lang["error.team.not_found"], player, { team })
    }

    if (this.playerService.getState(player) !== tdm.State.select) {
      throw new BroadCastError(Lang["error.team.player_is_busy"], player)
    }

    return this.change(player, team, model)
  }

  @catchError(ErrorNotifyHandler)
  @command(['team', 'changeteam', 't'], {desc: Lang["cmd.change_team"]})
  changeTeam(player: PlayerMp, fullText: string, description: string, id: string) {
    const state = DummyService.get(Entity.ROUND, 'state')

    if (state === tdm.RoundState.prepare) {
      throw new BroadCastError(Lang["error.is_busy"], player)
    }

    if (!id) {
      return this.teamSelect(player)
    }

    const teamName = this.hash[id]
    const team = this.getTeam(teamName)

    if (!teamName || !team) {
      player.outputChatBox(description)
      return
    }

    const [model] = team.skins

    return this.change(player, teamName, model)
  }

  private teamSelectRequest(player: PlayerMp) {
    this.playerService.setState(player, tdm.State.select)
    return player.call(Events["tdm.team.select"])
  }

  getPlayersByTeam(id: tdm.Team): number[] {
    return mp.players.toArray().filter(player => this.playerService.getTeam(player) === id).map(helpers.toId)
  }

  getAttackers() {
    return this.getPlayersByTeam(tdm.Team.attackers)
  }

  getDefenders() {
    return this.getPlayersByTeam(tdm.Team.defenders)
  }

  getSpectators() {
    return this.getPlayersByTeam(tdm.Team.spectators)
  }

  @ensurePlayer
  change(p: number | PlayerMp, team: tdm.Team, model?: string) {
    const state = this.playerService.getState(p)
    const player = <PlayerMp>p

    if (![tdm.State.idle, tdm.State.select].includes(state)) {
      throw new BroadCastError(Lang["error.team.player_not_in_lobby"], player)
    }

    this.playerService.setTeam(p, team)
    this.playerService.spawnLobby(p, true)

    if (model) {
      this.playerService.setModel(p, mp.joaat(model))
    }

    const teamData = this.getTeam(team)

    player.outputChatBox({
      message: [
        [this.lang.get(Lang["tdm.team.change"]), '#fff'],
        [teamData.name, teamData.color]
      ]
    })
  }

  getName(team: tdm.Team | 'draw') {
    if (team === 'draw') {
      return team
    }

    return this.getTeam(team)?.name || team
  }

  getTeam(team: tdm.Team) {
    return DummyService.get(Entity.TEAM, team)
  }

  addScore(result: tdm.Team | 'draw') {
    const team = this.getTeam(<tdm.Team>result)

    if (!team) {
      return
    }

    DummyService.set(Entity.TEAM, <tdm.Team>result, {
      ...team,
      score: team.score + 1,
    })
  }

  swap() {
    const attackers = deepclone(DummyService.get(Entity.TEAM, tdm.Team.attackers))
    const defenders = deepclone(DummyService.get(Entity.TEAM, tdm.Team.defenders))

    const attackerPlayers = this.playerService
      .getByTeam(tdm.Team.attackers)
      .filter(player => !this.playerService.hasState(player, tdm.State.select))
    const defenderPlayers = this.playerService
      .getByTeam(tdm.Team.defenders)
      .filter(player => !this.playerService.hasState(player, tdm.State.select))

    DummyService.set(Entity.TEAM, tdm.Team.defenders, attackers)
    DummyService.set(Entity.TEAM, tdm.Team.attackers, defenders)

    attackerPlayers.forEach(player => this.change(player, tdm.Team.defenders))
    defenderPlayers.forEach(player => this.change(player, tdm.Team.attackers))

    this.playerService.call(Events["tdm.team.swap"])
    mp.events.call(Events["tdm.team.swap"])
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