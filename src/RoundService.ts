import { sleep } from "./helpers"
import { event } from "./helpers/decorators/event"
import { eventable } from "./helpers/decorators/eventable"
import { log } from "./helpers/decorators/log"
import Arena from "./Arena"
import PlayerService from "./PlayerService"
import Round from "./Round"
import TeamService from "./TeamService"

@eventable
export default class RoundService {
  private round?: Round
  constructor(
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
  ) {}

  @event(RageEnums.EventKey.PLAYER_DEATH)
  playerDeath(player: PlayerMp) {
    if (!this.running) {
      return
    }

    if (!mp.players.exists(player)) {
      return
    }

    this.round.removePlayer(player.id)
  }

  @event(RageEnums.EventKey.PLAYER_QUIT)
  playerQuit(player: PlayerMp) {
    if (!this.running) {
      return
    }

    this.round.playerQuit(player.id)
  }

  @log
  start(id: string, player?: PlayerMp) {
    if (this.running) {
      if (player) {
        player.outputChatBox('Раунд запущен')
      }
      return
    }

    const players = [
      ...this.teamService.getAttackers(),
      ...this.teamService.getDefenders(),
    ]

    if (!players.length) {
      if (player) {
        player.outputChatBox('Недостаточно игроков для запуска')
      }

      return
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
  stop(player?: PlayerMp) {
    if (!this.running || !this.round) {
      if (player) {
        player.outputChatBox('Раунд не запущен')
      }

      return
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

      if (!attackers || !defenders || !this.round.timeleft) {
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