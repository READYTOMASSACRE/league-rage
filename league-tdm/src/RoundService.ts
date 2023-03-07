import { event, eventable, log } from "../../league-core"
import { ILanguage, Lang } from "../../league-lang/language"
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
    readonly lang: ILanguage,
  ) {}

  @event("playerDeath")
  playerDeath(player: PlayerMp) {
    if (!this.running) {
      return
    }

    if (!mp.players.exists(player)) {
      return
    }

    if (this.round) {
      this.round.removePlayer(player.id)
    }
  }

  @event("playerQuit")
  playerQuit(player: PlayerMp) {
    if (!this.running) {
      return
    }

    if (this.round) {
      this.round.playerQuit(player.id)
    }
  }

  @log
  start(id: string, player?: PlayerMp) {
    if (this.running) {
      if (player) {
        player.outputChatBox(this.lang.get(Lang["tdm.round.is_running"]))
      }
      return
    }

    const players = [
      ...this.teamService.getAttackers(),
      ...this.teamService.getDefenders(),
    ]

    if (!players.length) {
      if (player) {
        player.outputChatBox(this.lang.get(Lang["tdm.round.start_empty"]))
      }

      return
    }

    this.round = new Round({
      arena: new Arena(id, this.lang, player),
      players,
      prepareSeconds: 5,
      roundSeconds: 150,
    }, this.playerService)
  }

  @log
  stop(player?: PlayerMp) {
    if (!this.running || !this.round) {
      if (player) {
        player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
      }

      return
    }

    this.end()
  }

  @log
  add(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
    }

    return this.round.addPlayer(player.id, true)
  }

  @log
  remove(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
    }

    return this.round.removePlayer(player.id, true)
  }

  @log
  pause(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
    }
    if (this.paused) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_stopped"]))
    }

    return this.round.pause()
  }

  @log
  unpause(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
    }
    if (!this.paused) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_already_paused"]))
    }

    return this.round.unpause()
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