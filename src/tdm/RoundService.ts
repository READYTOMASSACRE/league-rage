import { sleep } from "../helpers"
import { log } from "../helpers/decorators/log"
import Arena from "./Arena"
import PlayerService from "./PlayerService"
import Round from "./Round"
import TeamService from "./TeamService"

export default class RoundService {
  private round?: Round
  constructor(
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
  ) {}

  @log
  start(player: PlayerMp, id: string) {
    if (this.running) {
      return player.outputChatBox('Раунд запущен')
    }

    const players = [
      ...this.teamService.getAttackers(),
      ...this.teamService.getDefenders(),
    ]

    if (!players.length) {
      return player.outputChatBox('Недостаточно игроков для запуска')
    }

    this.round = new Round({
      arena: new Arena(id, player),
      players,
      prepareSeconds: 1,
      roundSeconds: 120,
    }, this.playerService)

    this.watch()
  }

  @log
  stop(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox('Раунд не запущен')
    }

    this.end()
  }

  @log
  add(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox('Раунд не запущен')
    }

    return this.round.addPlayer(player.id, true)
  }

  @log
  remove(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox('Раунд не запущен')
    }

    return this.round.removePlayer(player.id, true)
  }

  @log
  pause(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox('Раунд не запущен')
    }
    if (this.paused) {
      return player.outputChatBox('Раунд уже остановлен')
    }

    return this.round.pause()
  }

  @log
  unpause(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox('Раунд не запущен')
    }
    if (!this.paused) {
      return player.outputChatBox('Раунд не остановлен')
    }

    return this.round.unpause()
  }

  @log
  async watch() {
    while (this.running) {
      if (!this.round) {
        break
      }

      const {attackers, defenders} = this.round.info

      if (!attackers || !defenders) {
        this.end()
        break
      }

      await sleep(0.1)
    }
  }

  @log
  private end() {
    if (!this.round) return
    
    this.round.end()
    delete this.round
  }

  get running() {
    return Boolean(this.round?.running)
  }

  get paused() {
    return Boolean(this.round?.paused)
  }
}