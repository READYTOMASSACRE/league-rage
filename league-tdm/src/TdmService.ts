import { commandable, command, log, proceable, proc, catchError } from "../../league-core";
import PermissionService from "./PermissionService";
import RoundService from "./RoundService";
import PlayerService from "./PlayerService";
import VoteService from "./VoteService";
import Arena from "./Arena";
import WeaponService from "./WeaponService";
import { Events, Procs } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";
import DummyService from "../../league-core/src/server/DummyService";
import { Entity, RoundState, State, Team } from "../../league-core/src/types/tdm";
import TeamService from "./TeamService";
import { Rule } from "../../league-core/src/types/permission";
import ErrorNotifyHandler from "./error/ErrorNotifyHandler";

@commandable
@proceable
export default class TdmService {
  constructor(
    readonly roundService: RoundService,
    readonly permissionService: PermissionService,
    readonly playerService: PlayerService,
    readonly voteService: VoteService,
    readonly weaponService: WeaponService,
    readonly teamService: TeamService,
    readonly lang: ILanguage,
  ) {}

  @catchError(ErrorNotifyHandler)
  @command(['start', 'arena', 'a'], {desc: Lang["cmd.start_arena"]})
  start(player: PlayerMp, fullText: string, description: string, id?: string) {
    this.permissionService.hasRight(player, Rule.tdmStart)

    if (!id) {
      return player.outputChatBox(description)
    }

    return this.roundService.start(id, player)
  }

  @catchError(ErrorNotifyHandler)
  @command(['stop', 's'], {desc: Lang["cmd.stop_arena"]})
  stop(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, Rule.tdmStop)

    return this.roundService.stop(player)
  }

  @catchError(ErrorNotifyHandler)
  @command('add', {desc: Lang["cmd.add_player"]})
  add(player: PlayerMp, fullText: string,description: string, id?: string) {
    this.permissionService.hasRight(player, Rule.tdmAdd)

    if (typeof id === 'undefined') {
      return player.outputChatBox(description)
    }

    const addPlayer = this.playerService.getByIdOrName(id)

    if (!addPlayer) {
      throw new BroadCastError(Lang["error.player.not_found"], player, { player: id })
    }

    if (Array.isArray(addPlayer)) {
      const message = this.lang.get(Lang["tdm.player.find_result"], { players: addPlayer.map(p => p.name).join(', ') })
      return player.outputChatBox(message)
    }

    return this.roundService.add(addPlayer)
  }

  @catchError(ErrorNotifyHandler)
  @command('remove', {desc: Lang["cmd.remove_player"]})
  remove(player: PlayerMp, fullText: string,description: string, id?: string) {
    this.permissionService.hasRight(player, Rule.tdmRemove)

    if (typeof id === 'undefined') {
      return player.outputChatBox(description)
    }

    const removePlayer = this.playerService.getByIdOrName(id)

    if (!removePlayer) {
      throw new BroadCastError(Lang["error.player.not_found"], player, { player: id })
    }

    if (Array.isArray(removePlayer)) {
      const message = this.lang.get(Lang["tdm.player.find_result"], { players: removePlayer.map(p => p.name).join(', ') })
      return player.outputChatBox(message)
    }

    return this.roundService.remove(removePlayer)
  }

  @catchError(ErrorNotifyHandler)
  @command('pause', {desc: Lang["cmd.pause"]})
  pause(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, Rule.tdmPause)

    return this.roundService.pause(player)
  }

  @catchError(ErrorNotifyHandler)
  @command('unpause', {desc: Lang["cmd.unpause"]})
  unpause(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, Rule.tdmPause)

    return this.roundService.unpause(player)
  }

  @catchError(ErrorNotifyHandler)
  @command('vote', {desc: Lang["cmd.vote"]})
  vote(player: PlayerMp, fullText: string, description: string, id?: string) {
    this.permissionService.hasRight(player, Rule.tdmVote)

    if (!id) {
      return player.outputChatBox(description)
    }

    const arena = Arena.get(id, player, this.lang)

    return this.voteService.voteArena(player, arena.id, (result) => {
      return this.roundService.start(result)
    })
  }

  @proc(Procs["tdm.arena.get"])
  getArenas(player: PlayerMp, id?: number) {
    if (typeof id !== 'undefined') {
      return Arena.get(id, player, this.lang)
    }

    return JSON.stringify(Arena.arenas)
  }

  @catchError(ErrorNotifyHandler)
  @command('name', { desc: Lang["cmd.change_name"]})
  changeName(player: PlayerMp, fullText: string, description: string, name?: string) {
    if (!name) {
      return player.outputChatBox(description)
    }

    const max = 16
    if (name.length > max) {
      throw new BroadCastError(Lang["error.player.name_too_long"], player, { max })
    }

    const old = player.name
    player.name = name.trim()

    mp.events.call(Events["tdm.player.change_name"], player.id, old, player.name)
  }

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

  @command('kill')
  kill(player: PlayerMp) {
    this.playerService.setHealth(player, 0)
  }

  @command('swap')
  swap(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, Rule.tdmSwap)

    const roundState = DummyService.get(Entity.ROUND, 'state')

    if (RoundState.stopped !== roundState) {
      return player.outputChatBox(description)
    }

    this.teamService.swap()
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
      Lang["cmd.swap_team"],
      Lang["cmd.rcon"],
      Lang["cmd.set_role"],
    ]
  }
}