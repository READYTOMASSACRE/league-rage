import { event, eventable, proc, proceable } from "../../league-core"
import { RoundConfig, State, Team } from "../../league-core/src/types/tdm"
import { IDummyService } from '../../league-core/src/server/DummyService'
import { ILanguage, Lang } from "../../league-lang/language"
import Arena from "./Arena"
import PlayerService from "./PlayerService"
import Round from "./Round"
import TeamService from "./TeamService"
import BroadCastError from "./error/BroadCastError"
import { Procs } from "../../league-core/src/types"

@proceable
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
      this.round.removePlayer(player.id, 'death')
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

  @proc(Procs["tdm.round.timeleft"])
  getTimeleft() {
    return this.timeleft
  }

  start(id: string, player?: PlayerMp) {
    if (this.running) {
      if (player) {
        throw new BroadCastError(Lang["tdm.round.is_running"], player)
      }
      return
    }

    const players = [
      ...this.teamService.getAttackers(),
      ...this.teamService.getDefenders(),
    ]

    if (!players.length) {
      if (player) {
        throw new BroadCastError(Lang["tdm.round.start_empty"], player)
      }

      return
    }

    this.round = new Round({
      arena: new Arena(id, this.lang, player),
      players,
      prepareSeconds: this.config.prepare,
      roundSeconds: this.config.timeleft,
      aliveWatcher: this.config.watcher.alive,
    }, this.playerService, this.teamService, this.dummyService)
  }

  stop(player?: PlayerMp) {
    if (!this.running || !this.round) {
      if (player) {
        throw new BroadCastError(Lang["tdm.round.is_not_running"], player)
      }

      return
    }

    this.end()
  }

  add(player: PlayerMp, whoAdded?: PlayerMp) {
    if (!this.running || !this.round) {
      throw new BroadCastError(Lang["tdm.round.is_not_running"], player)
    }

    if (this.playerService.hasState(player, State.alive)) {
      throw new BroadCastError(Lang["error.player.in_round"], player, { player: player.name })
    }

    if (
      !this.playerService.hasState(player, [State.dead, State.idle]) ||
      this.playerService.getTeam(player) === Team.spectators
    ) {
      throw new BroadCastError(Lang["error.round.add.player_is_busy"], player)
    }

    return this.round.addPlayer(player.id, true, whoAdded?.id)
  }

  remove(player: PlayerMp, whoRemoved?: PlayerMp) {
    if (!this.running || !this.round) {
      throw new BroadCastError(Lang["tdm.round.is_not_running"], player)
    }

    if (!this.playerService.hasState(player, State.alive)) {
      throw new BroadCastError(Lang["error.player.not_in_round"], player, { player: player.name })
    }

    return this.round.removePlayer(player.id, 'manual', whoRemoved?.id)
  }

  pause(player: PlayerMp) {
    if (!this.running || !this.round) {
      throw new BroadCastError(Lang["tdm.round.is_not_running"], player)
    }
    if (this.paused) {
      throw new BroadCastError(Lang["tdm.round.is_stopped"], player)
    }

    return this.round.pause()
  }

  unpause(player: PlayerMp) {
    if (!this.running || !this.round) {
      throw new BroadCastError(Lang["tdm.round.is_not_running"], player)
    }
    if (!this.paused) {
      throw new BroadCastError(Lang["tdm.round.is_already_paused"], player)
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

  get timeleft() {
    return this.round?.timeleft ?? 0
  }
}