import { commandable, command, log, proceable, proc, eventable, event } from "../../league-core";
import PermissionService from "./PermissionService";
import RoundService from "./RoundService";
import PlayerService from "./PlayerService";
import VoteService from "./VoteService";
import Arena from "./Arena";
import WeaponService from "./WeaponService";
import { Events, Procs } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";
import { State, Team } from "../../league-core/src/types/tdm";

@commandable
@proceable
@eventable
export default class TdmService {
  constructor(
    readonly roundService: RoundService,
    readonly permissionService: PermissionService,
    readonly playerService: PlayerService,
    readonly voteService: VoteService,
    readonly weaponService: WeaponService,
    readonly lang: ILanguage,
  ) {}

  @log
  @command(['start', 'arena', 'a'], {desc: Lang["cmd.start_arena"]})
  start(player: PlayerMp, fullText: string, description: string, id?: string) {
    this.permissionService.hasRight(player, 'tdm.start')

    if (!id) {
      return player.outputChatBox(description)
    }

    return this.roundService.start(id, player)
  }

  @log
  @command(['stop', 's'], {desc: Lang["cmd.stop_arena"]})
  stop(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, 'tdm.stop')

    return this.roundService.stop(player)
  }

  @log
  @command('add', {desc: Lang["cmd.add_player"]})
  add(player: PlayerMp, fullText: string,description: string, id?: string) {
    this.permissionService.hasRight(player, 'tdm.add')

    if (typeof id === 'undefined') {
      return player.outputChatBox(description)
    }

    const addPlayer = this.playerService.getByIdOrName(id)

    if (!addPlayer) {
      return player.outputChatBox(this.lang.get(Lang["error.player.not_found"], { player: id }))
    }

    if (Array.isArray(addPlayer)) {
      const message = this.lang.get(Lang["tdm.player.find_result"], { players: addPlayer.map(p => p.name).join(', ') })
      return player.outputChatBox(message)
    }

    return this.roundService.add(addPlayer)
  }

  @log
  @command('remove', {desc: Lang["cmd.remove_player"]})
  remove(player: PlayerMp, fullText: string,description: string, id?: string) {
    this.permissionService.hasRight(player, 'tdm.remove')

    if (typeof id === 'undefined') {
      return player.outputChatBox(description)
    }

    const removePlayer = this.playerService.getByIdOrName(id)

    if (!removePlayer) {
      return player.outputChatBox(this.lang.get(Lang["error.player.not_found"], { player: id }))
    }

    if (Array.isArray(removePlayer)) {
      const message = this.lang.get(Lang["tdm.player.find_result"], { players: removePlayer.map(p => p.name).join(', ') })
      return player.outputChatBox(message)
    }

    return this.roundService.remove(removePlayer)
  }

  @log
  @command('pause', {desc: Lang["cmd.pause"]})
  pause(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, 'tdm.pause')

    return this.roundService.pause(player)
  }

  @log
  @command('unpause', {desc: Lang["cmd.unpause"]})
  unpause(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, 'tdm.pause')

    return this.roundService.unpause(player)
  }

  @log
  @command('vote', {desc: Lang["cmd.vote"]})
  vote(player: PlayerMp, fullText: string, description: string, id?: string) {
    this.permissionService.hasRight(player, 'tdm.vote')

    if (!id) {
      return player.outputChatBox(description)
    }

    const arena = Arena.get(id, player, this.lang)

    return this.voteService.voteArena(player, arena.id, (result) => {
      return this.roundService.start(result)
    })
  }

  @log
  @proc(Procs["tdm.arena.get"])
  getArenas(player: PlayerMp, id?: number) {
    if (typeof id !== 'undefined') {
      return Arena.get(id, player, this.lang)
    }

    return Arena.arenas
  }

  @log
  @command(['spec', 'spectate'], { desc: Lang["cmd.spectate"] })
  spectate(player: PlayerMp, fullText: string, description: string, id?: string) {
    if (!this.roundService.running) {
      throw new BroadCastError(this.lang.get(Lang["tdm.round.is_not_running"]), player)
    }

    if (![State.dead, State.idle, State.spectate].includes(this.playerService.getState(player))) {
      throw new BroadCastError(this.lang.get(Lang["error.spectate.not_same_team"]), player)
    }

    if (!id) {
      return player.outputChatBox(description)
    }

    if (this.playerService.hasState(player, State.spectate) && id === 'off') {
      return this.playerService.call([player.id], Events["tdm.spectate.stop"])
    }

    const spectatePlayer = this.playerService.getByIdOrName(id)

    if (!spectatePlayer) {
      throw new BroadCastError(this.lang.get(Lang["error.player.not_found"], { player: id }), player)
    }

    if (Array.isArray(spectatePlayer)) {
      const message = this.lang.get(Lang["tdm.player.find_result"], { players: spectatePlayer.map(p => p.name).join(', ') })
      throw new BroadCastError(message, player)
    }

    if (
      this.playerService.getTeam(player) !== Team.spectators &&
      this.playerService.getTeam(player) !== this.playerService.getTeam(spectatePlayer)
    ) {
      throw new BroadCastError(this.lang.get(Lang["error.spectate.not_same_team"]), player)
    }

    if (!this.playerService.hasState(spectatePlayer, State.alive)) {
      throw new BroadCastError(
        this.lang.get(Lang["error.player.not_in_round"], { player: spectatePlayer.name }),
        player
      )
    }

    if (spectatePlayer.id === player.id) {
      throw new BroadCastError(this.lang.get(Lang["error.spectate.same_player"]), player)
    }

    this.playerService.setState(player, State.spectate)
    this.playerService.call([player.id], Events["tdm.spectate.start"], spectatePlayer.id)
  }

  @log
  @event(Events["tdm.spectate.stop"])
  stopSpectate(player: PlayerMp | number) {
    player = typeof player === 'number' ? mp.players.at(player) : player

    if (
      !mp.players.exists(player) ||
      !this.playerService.hasState(player, State.spectate)
    ) {
      return
    }

    this.playerService.setState(player, State.idle)
    this.playerService.spawnLobby(player)
  }

  @log
  @proc(Procs["tdm.spectate.move"])
  moveSpectate(player: PlayerMp, x: number, y: number, z: number, dimension: number) {
    try {
      if (!this.playerService.hasState(player, State.spectate)) {
        return false
      }
  
      player.position = new mp.Vector3(x, y, z)
      player.dimension = dimension
  
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
}