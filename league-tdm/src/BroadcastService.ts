import { event, eventable, log, types } from "../../league-core";
import { Enviroment, Events } from "../../league-core/src/types";
import PlayerService from "./PlayerService";

@eventable
export default class BroadcastService {
  constructor(readonly playerService: PlayerService) {}

  @log
  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare(id: number) {
    mp.players.broadcast(`Подготовка арены ${id}`)
  }

  @log
  @event(Events["tdm.round.start"])
  tdmRoundStart(id: number, players: number[]) {
    mp.players.broadcast(`Запущена арена ${id}`)
    this.playerService.call('tdm.round.start', players, [id])
  }

  @log
  @event(Events["tdm.round.end"])
  tdmRoundEnd(id: number, result: types.tdm.Team | "draw") {
    mp.players.broadcast(`Раунд завершен, результат: ${result}, арена ${id}`)
  }

  @log
  @event(Events["tdm.round.add"])
  tdmRoundAdd(id: number, manual?: boolean) {
    if (manual) {
      mp.players.broadcast(`Игрок ${id} был добавлен в раунд`)
    }
  }

  @log
  @event(Events["tdm.round.remove"])
  tdmRoundRemove(id: number, manual?: boolean) {
    if (manual) {
      mp.players.broadcast(`Игрок ${id} был удален из раунда`)
    }
  }

  @log
  @event(Events["tdm.round.pause"])
  tdmRoundPause(toggle: boolean) {
    const text = toggle ? 'Раунд остановлен' : 'Раунд возобновлен'

    mp.players.broadcast(text)
  }

  @log
  @event(Events["tdm.vote"])
  tdmVote(vote: string, id: number, key: string) {
    const player = this.playerService.getById(id)

    mp.players.broadcast(`[${vote}] Игрок ${player?.name} проголосовал за ${key}, ${vote}`)
  }

  @log
  @event(Events["tdm.vote.start"])
  tdmVoteStart(vote: string, id: number, key: string) {
    const player = this.playerService.getById(id)

    mp.players.broadcast(`[${vote}] Запущено голосование игроком ${player?.name}, ${key}`)
  }

  @log
  @event(Events["tdm.vote.end"])
  tdmVoteEnd(vote: string, result: string) {
    mp.players.broadcast(`[${vote}] Голосование завершено, результат: ${result}`)
  }

  @log
  @event(Events["tdm.chat.push"])
  tdmChatPush(player: PlayerMp, msg: string) {
    mp.players.call(Events["tdm.chat.push"], [msg, Enviroment.server])
  }
}