import { sleep } from "../../helpers"
import Arena from "./Arena"
import PlayerService from "./PlayerService"
import Round from "./Round"

export default class RoundService {
  private round?: Round
  constructor(readonly playerService: PlayerService) {}

  start(player: PlayerMp, id: string) {
    if (this.running) {
      player.outputChatBox('Раунд запущен')
    }

    this.round = new Round({
      arena: new Arena(Number(id)),
      players: [],
      prepareSeconds: 1,
      roundSeconds: 1,
    }, this.playerService)

    this.watch()
  }

  stop(player: PlayerMp) {
    if (!this.running || !this.round) {
      player.outputChatBox('Раунд не запущен')
    }

    this.round.end()
  }

  async watch() {
    while (this.running) {
      if (!this.round) {
        break
      }

      const {attackers, defenders} = this.round.info

      if (!attackers || !defenders) {
        this.round.end()
        break
      }

      await sleep(0.1)
    }
  }

  get running() {
    return Boolean(this.round?.running)
  }

  get paused() {
    return false
  }
}