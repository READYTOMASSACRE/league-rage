import { BroadCastError, event, eventable, proc, proceable } from "../../../core"
import { GameType, RoundConfig, State, Team, Vote } from "../../../core/src/types/tdm"
import { IDummyService } from '../../../core/src/server/DummyService'
import { ILanguage, Lang } from "../../../lang/language"
import Arena from "./Arena"
import PlayerService from "./PlayerService"
import TeamService from "./TeamService"
import { Events, Procs } from "../../../core/src/types"
import MatchRound from "./round/MatchRound"
import Round from './round/Round'
import SpectateService from "./SpectateService"
import BroadcastService from "./BroadcastService"
import WeaponService from "./WeaponService"
import VoteService from "./VoteService"

const roundMap = {
  [GameType.match]: MatchRound,
  [GameType.round]: Round,
}

type RoundType = typeof roundMap
type Tuples<T> = T extends GameType ? [T, InstanceType<RoundType[T]>] : never
type SingleGameType<K> = [K] extends (K extends GameType ? [K] : never) ? K : never
type RoundClassType<A extends GameType> = Extract<Tuples<GameType>, [A, any]>[1]

@proceable
@eventable
export default class RoundService {
  private round?: Round
  constructor(
    readonly config: RoundConfig,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly dummyService: IDummyService,
    readonly spectateService: SpectateService,
    readonly broadcastService: BroadcastService,
    readonly weaponService: WeaponService,
    readonly voteService: VoteService,
    readonly lang: ILanguage,
  ) {}

  @event(['playerDeath', 'playerQuit'])
  playerDeathOrQuit(player: PlayerMp) {
    if (!this.running) {
      return
    }

    this.spectateService.onPlayerDeathOrQuit(player)
  }

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

  @event(Events["tdm.round.prepare"], { serverOnly: true })
  onPrepare(arenaId: number, players: number[]) {
    this.voteService.stop(Vote.arena)
    this.weaponService.onRoundPrepare(players)
    this.broadcastService.byServer(this.lang.get(Lang["tdm.round.arena_prepare"], { arena: arenaId }))
  }

  @event(Events["tdm.round.start"], { serverOnly: true })
  onStart(arenaId: number, players: number[]) {
    this.spectateService.onRoundStart(players)
    this.broadcastService.byServer(this.lang.get(Lang["tdm.round.arena_start"], { arena: arenaId }))
  }

  @event(Events["tdm.round.end"], { serverOnly: true })
  onEnd(arenaId: number, result: Team | 'draw') {
    const teamName = this.teamService.getName(result)

    this.weaponService.onRoundEnd()
    this.spectateService.stop()
    this.broadcastService.byServer(this.lang.get(Lang["tdm.round.end"], { arena: arenaId, result: teamName }))
  }

  @event(Events["tdm.round.add"], { serverOnly: true })
  onAdd(id: number, manual: boolean | undefined, arenaId: number, whoAdded?: number) {
    this.weaponService.onRoundAdd(id, manual)
    this.spectateService.stopByPlayer(id)
    this.broadcastService.onRoundAdd(id, manual, arenaId, whoAdded)
  }

  @event(Events["tdm.round.remove"], { serverOnly: true })
  onRemove(id: number, reason: 'manual' | 'death' | undefined, arenaId: number, whoRemoved?: number) {
    this.weaponService.onRoundRemove(id)
    this.spectateService.onPlayerRemove(id, reason)
    this.broadcastService.onRoundRemove(id, reason, arenaId, whoRemoved)
  }

  @event(Events["tdm.round.pause"], { serverOnly: true })
  onPause(toggle: boolean) {
    this.broadcastService.byServer(toggle ?
      this.lang.get(Lang["tdm.round.is_paused"]) :
      this.lang.get(Lang["tdm.round.is_unpaused"])
    )
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

    const arena = Arena.findByIdOrCode(id, player)
    const attackers = this.teamService.getAttackers()
    const defenders = this.teamService.getDefenders()
    const players = [...attackers, ...defenders]

    if (this.config.watcher.alive && (!attackers.length || !defenders.length)) {
      if (player) {
        throw new BroadCastError(Lang["tdm.round.start_empty"], player)
      }

      return
    }

    this.round = this.createRoundInstance(GameType.round, { arena, players })
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

    if (this.playerService.inRound(player)) {
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

    if (!this.playerService.inRound(player)) {
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

  createRoundInstance<T extends GameType>(type: SingleGameType<T>, {arena, players}: {
    arena: Arena, players: number[]
  }): RoundClassType<T> {
    const roundConstructor = roundMap[type]

    return new roundConstructor({
      arena,
      players,
      prepareSeconds: this.config.prepare,
      roundSeconds: this.config.timeleft,
      aliveWatcher: this.config.watcher.alive,
    }, this.playerService, this.teamService, this.dummyService)
  }

  private end() {
    if (!this.round) return
    
    this.round.end()
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