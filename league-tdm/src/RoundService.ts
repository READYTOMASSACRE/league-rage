import { event, eventable } from "../../league-core"
import { RoundConfig, State, Team } from "../../league-core/src/types/tdm"
import { IDummyService } from '../../league-core/src/server/DummyService'
import { ILanguage, Lang } from "../../league-lang/language"
import Arena from "./Arena"
import PlayerService from "./PlayerService"
import Round from "./Round"
import TeamService from "./TeamService"

@eventable
export default class RoundService {
  private round?: Round
  constructor(
    readonly config: RoundConfig,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly dummyService: IDummyService,
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
      prepareSeconds: this.config.prepare,
      roundSeconds: this.config.timeleft,
      aliveWatcher: this.config.watcher.alive,
    }, this.playerService, this.dummyService)
  }

  stop(player?: PlayerMp) {
    if (!this.running || !this.round) {
      if (player) {
        player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
      }

      return
    }

    this.end()
  }

  add(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
    }

    if (this.playerService.hasState(player, State.alive)) {
      return player.outputChatBox(this.lang.get(Lang["error.player.in_round"], { player: player.name }))
    }

    if (
      !this.playerService.hasState(player, [State.dead, State.idle]) ||
      this.playerService.getTeam(player) === Team.spectators
    ) {
      return player.outputChatBox(this.lang.get(Lang["error.round.add.player_is_busy"]))
    }

    return this.round.addPlayer(player.id, true)
  }

  remove(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
    }

    if (!this.playerService.hasState(player, State.alive)) {
      return player.outputChatBox(this.lang.get(Lang["error.player.not_in_round"], { player: player.name }))
    }

    return this.round.removePlayer(player.id, true)
  }

  pause(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
    }
    if (this.paused) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_stopped"]))
    }

    return this.round.pause()
  }

  unpause(player: PlayerMp) {
    if (!this.running || !this.round) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_not_running"]))
    }
    if (!this.paused) {
      return player.outputChatBox(this.lang.get(Lang["tdm.round.is_already_paused"]))
    }

    return this.round.unpause()
  }

  private end() {
    if (!this.round) return
    
    this.round.end()
    delete this.round
  }

  get state() {
    return this.round?.state
  }

  get running() {
    if (!this.round) return false

    return this.round.running || this.round.prepared || this.round.paused
  }

  get paused() {
    return Boolean(this.round?.paused)
  }
}