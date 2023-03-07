import { event, eventable, log, types } from "../../league-core";
import { Enviroment, Events } from "../../league-core/src/types";
import PlayerService from "./PlayerService";

@eventable
export default class BroadcastService {
  constructor(readonly playerService: PlayerService) {}

  @log
  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare(id: number) {
    this.broadcast(`Подготовка арены ${id}`)

    mp.players.call(Events["tdm.round.prepare"], [id])
  }

  @log
  @event(Events["tdm.round.start"])
  tdmRoundStart(id: number, players: number[]) {
    this.broadcast(`Запущена арена ${id}`)

    mp.players.call(Events["tdm.round.start"], [players, id])
  }

  @log
  @event(Events["tdm.round.end"])
  tdmRoundEnd(id: number, result: types.tdm.Team | "draw") {
    this.broadcast(`Раунд завершен, результат: ${result}, арена ${id}`)

    mp.players.call(Events["tdm.round.end"], [id, result])
  }

  @log
  @event(Events["tdm.round.add"])
  tdmRoundAdd(id: number, manual?: boolean) {
    if (manual) {
      this.broadcast(`Игрок ${id} был добавлен в раунд`)
    }
  }

  @log
  @event(Events["tdm.round.remove"])
  tdmRoundRemove(id: number, manual?: boolean) {
    if (manual) {
      this.broadcast(`Игрок ${id} был удален из раунда`)
    }
  }

  @log
  @event(Events["tdm.round.pause"])
  tdmRoundPause(toggle: boolean) {
    const text = toggle ? 'Раунд остановлен' : 'Раунд возобновлен'

    this.broadcast(text)
  }

  @log
  @event(Events["tdm.vote"])
  tdmVote(vote: string, id: number, key: string) {
    const player = this.playerService.getById(id)

    this.broadcast(`[${vote}] Игрок ${player?.name} проголосовал за ${key}, ${vote}`)
  }

  @log
  @event(Events["tdm.vote.start"])
  tdmVoteStart(vote: string, id: number, key: string) {
    const player = this.playerService.getById(id)

    this.broadcast(`[${vote}] Запущено голосование игроком ${player?.name}, ${key}`)
  }

  @log
  @event(Events["tdm.vote.end"])
  tdmVoteEnd(vote: string, result: string) {
    this.broadcast(`[${vote}] Голосование завершено, результат: ${result}`)
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