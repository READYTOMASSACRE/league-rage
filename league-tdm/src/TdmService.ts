import { commandable, command, log, proceable, proc } from "../../league-core";
import PermissionService from "./PermissionService";
import RoundService from "./RoundService";
import PlayerService from "./PlayerService";
import VoteService from "./VoteService";
import Arena from "./Arena";
import WeaponService from "./WeaponService";
import { Procs } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";

@commandable
@proceable
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

    const addPlayer = this.playerService.getByIdOrName(id, player)

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

    const removePlayer = this.playerService.getByIdOrName(id, player)

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
}