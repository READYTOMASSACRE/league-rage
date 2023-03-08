import { event, eventable, log, types } from "../../league-core";
import { Enviroment, Events, tdm } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";
import PlayerService from "./PlayerService";
import TeamService from "./TeamService";

@eventable
export default class BroadcastService {
  constructor(
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly lang: ILanguage,
  ) {}

  @log
  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare(id: number) {
    this.broadcast(this.lang.get(Lang["tdm.round.arena_prepare"], { arena: id }))

    mp.players.call(Events["tdm.round.prepare"], [id])
  }

  @log
  @event(Events["tdm.round.start"])
  tdmRoundStart(id: number, players: number[]) {
    this.broadcast(this.lang.get(Lang["tdm.round.arena_start"], { arena: id }))

    mp.players.call(Events["tdm.round.start"], [players, id])
  }

  @log
  @event(Events["tdm.round.end"])
  tdmRoundEnd(id: number, team: tdm.Team | "draw") {
    const result = this.teamService.getName(team)

    this.broadcast(this.lang.get(Lang["tdm.round.end"], { arena: id, result }))

    mp.players.call(Events["tdm.round.end"], [id, team])
  }

  @log
  @event(Events["tdm.round.add"])
  tdmRoundAdd(id: number, manual?: boolean) {
    if (manual) {
      this.broadcast(this.lang.get(Lang["tdm.round.add"], { player: id }))
    }
  }

  @log
  @event(Events["tdm.round.remove"])
  tdmRoundRemove(id: number, manual?: boolean) {
    if (manual) {
      this.broadcast(this.lang.get(Lang["tdm.round.end"], { player: id }))
    }
  }

  @log
  @event(Events["tdm.round.pause"])
  tdmRoundPause(toggle: boolean) {
    this.broadcast(toggle ?
      this.lang.get(Lang["tdm.round.is_paused"]) :
      this.lang.get(Lang["tdm.round.is_unpaused"])
    )
  }

  @log
  @event(Events["tdm.vote"])
  tdmVote(vote: string, id: number, key: string) {
    const player = this.playerService.getById(id)

    this.broadcast(this.lang.get(Lang["tdm.round.vote"], { vote, player: player?.name, key }))
  }

  @log
  @event(Events["tdm.vote.start"])
  tdmVoteStart(vote: string, id: number, key: string) {
    const player = this.playerService.getById(id)

    this.broadcast(this.lang.get(Lang["tdm.round.vote_start"], { vote, player: player?.name, key }))
  }

  @log
  @event(Events["tdm.vote.end"])
  tdmVoteEnd(vote: string, result: string) {
    this.broadcast(this.lang.get(Lang["tdm.round.vote_end"], { vote, result }))
  }

  @log
  @event(Events["tdm.chat.push"])
  tdmChatPush(player: PlayerMp, message?: string) {
    if (message?.[0] === '/') {
      return
    }

    if (!mp.players.exists(player)) {
      return
    }

    return this.broadcast(`${player.name} [${player.id}]: ${message}`)
  }

  @log
  broadcast(message: string) {
    mp.players.call(Events["tdm.chat.push"], [message, Enviroment.server])
  }

  @log
  @event("playerReady")
  overrideOutputChatBox(player: PlayerMp) {
    player.outputChatBox = function (message: string) {
      player.call(Events["tdm.chat.push"], [message, Enviroment.server])
    }
  }
}