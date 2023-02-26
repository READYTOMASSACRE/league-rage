import { event, eventable, log } from "../../league-core";
import { Team } from "./types";
import PlayerService from "./PlayerService";

@eventable
export default class BroadcastService {
  constructor(readonly playerService: PlayerService) {}

  @log
  @event('tdm.round.prepare')
  tdmRoundPrepare(id: number) {
    mp.players.broadcast(`Подготовка арены ${id}`)
  }

  @log
  @event('tdm.round.start')
  tdmRoundStart(id: number, players: number[]) {
    mp.players.broadcast(`Запущена арена ${id}`)
    this.playerService.call('tdm.round.start', players, [id])
  }

  @log
  @event('tdm.round.end')
  tdmRoundEnd(id: number, result: Team | "draw") {
    mp.players.broadcast(`Раунд завершен, результат: ${result}, арена ${id}`)
  }

  @log
  @event('tdm.round.add')
  tdmRoundAdd(id: number, manual?: boolean) {
    if (manual) {
      mp.players.broadcast(`Игрок ${id} был добавлен в раунд`)
    }
  }

  @log
  @event('tdm.round.remove')
  tdmRoundRemove(id: number, manual?: boolean) {
    if (manual) {
      mp.players.broadcast(`Игрок ${id} был удален из раунда`)
    }
  }

  @log
  @event('tdm.round.pause')
  tdmRoundPause(toggle: boolean) {
    const text = toggle ? 'Раунд остановлен' : 'Раунд возобновлен'

    mp.players.broadcast(text)
  }

  @log
  @event('tdm.vote')
  tdmVote(vote: string, id: number, key: string) {
    const player = this.playerService.getById(id)

    mp.players.broadcast(`[${vote}] Игрок ${player?.name} проголосовал за ${key}, ${vote}`)
  }

  @log
  @event('tdm.vote.start')
  tdmVoteStart(vote: string, id: number, key: string) {
    const player = this.playerService.getById(id)

    mp.players.broadcast(`[${vote}] Запущено голосование игроком ${player?.name}, ${key}`)
  }

  @log
  @event('tdm.vote.end')
  tdmVoteEnd(vote: string, result: string) {
    mp.players.broadcast(`[${vote}] Голосование завершено, результат: ${result}`)
  }
}