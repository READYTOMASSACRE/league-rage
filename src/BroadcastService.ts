import { event } from "./helpers/decorators/event";
import { eventable } from "./helpers/decorators/eventable";
import { log } from "./helpers/decorators/log";
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
}