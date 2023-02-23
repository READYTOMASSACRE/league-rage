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
      player.outputChatBox('Раунд запущен')
      return
    }

    const players = [
      ...this.teamService.getAttackers(),
      ...this.teamService.getDefenders(),
    ]

    if (!players.length) {
      player.outputChatBox('Недостаточно игроков для запуска')
      return
    }

    this.round = new Round({
      arena: new Arena(Number(id)),
      players,
      prepareSeconds: 1,
      roundSeconds: 120,
    }, this.playerService)

    this.watch()
  }

  @log
  stop(player: PlayerMp) {
    if (!this.running || !this.round) {
      player.outputChatBox('Раунд не запущен')
    }

    this.end()
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
    return false
  }
}