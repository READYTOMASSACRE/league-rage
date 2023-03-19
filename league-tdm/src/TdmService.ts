import { commandable, command, log, proceable, proc } from "../../league-core";
import PermissionService from "./PermissionService";
import RoundService from "./RoundService";
import PlayerService from "./PlayerService";
import VoteService from "./VoteService";
import Arena from "./Arena";
import WeaponService from "./WeaponService";
import { Events, Procs } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";

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

    return JSON.stringify(Arena.arenas)
  }

  @command('name', { desc: Lang["cmd.change_name"]})
  changeName(player: PlayerMp, fullText: string, description: string, name?: string) {
    if (!name) {
      return player.outputChatBox(description)
    }

    const max = 16
    if (name.length > max) {
      throw new BroadCastError(this.lang.get(Lang["error.player.name_too_long"], { max }))
    }

    const old = player.name
    player.name = name.trim()

    mp.events.call(Events["tdm.player.change_name"], player.id, old, player.name)
  }

  @log
  @command('cmdlist')
  cmdlistCmd(player: PlayerMp, fullText: string, description: string, p: string = "0", l: string | number = 7) {
    l = Number(l) || 7
    const maxLimit = 10
    const limit = l > maxLimit ? maxLimit : l
    const page = (Number(p) || 1)
    const [first, last, nextPage, lastPage] = this.getCmdlistOffset(page, this.cmdlist.length, limit)
    const commands = this.cmdlist.slice(first - 1, last)

    if (commands.length) {
      for (const cmd of commands) {
        player.outputChatBox(this.lang.get(cmd))
      }

      player.outputChatBox(
        this.lang.get(Lang["cmdlist.page"], {
          offset: `${first}-${last}`,
          page,
          next: page === lastPage ? 1 : nextPage,
          last: lastPage,
        })
      )
    } else {
      player.outputChatBox(this.lang.get(Lang["cmdlist.not_found"]))
    }
  }

  @log
  @command('kill')
  kill(player: PlayerMp) {
    this.playerService.setHealth(player, 0)
  }

  private getCmdlistOffset(page: number, total: number, limit: number) {
    const [first, last] = this.getOffsetRange(page, limit)
    const [, nextLast] = this.getOffsetRange(page + 1, limit)
    const lastPage = Math.ceil(total / limit)

    if (last >= total) {
      return [first, last - (last - total), lastPage, lastPage]
    }

    if (nextLast < total) {
      return [first, last, page + 1, lastPage]
    }

    return [first, last, lastPage, lastPage]
  }

  private getOffsetRange(page: number, limit: number): [number, number] {
    const first = (page - 1) * limit + 1
    const last = first + limit - 1
    
    return [first, last]
  }

  private get cmdlist() {
    return [
      Lang["cmd.cmdlist"],
      Lang["cmd.kill"],
      Lang["cmd.start_arena"],
      Lang["cmd.stop_arena"],
      Lang["cmd.add_player"],
      Lang["cmd.remove_player"],
      Lang["cmd.pause"],
      Lang["cmd.unpause"],
      Lang["cmd.vote"],
      Lang["cmd.spectate"],
      Lang["cmd.weapon"],
      Lang["cmd.change_team"],
      Lang["cmd.change_name"],
    ]
  }
}