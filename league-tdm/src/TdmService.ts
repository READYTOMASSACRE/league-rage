import { commandable, command, log } from "../../core/server";
import PermissionService from "./PermissionService";
import RoundService from "./RoundService";
import PlayerService from "./PlayerService";
import VoteService from "./VoteService";
import Arena from "./Arena";

@commandable
export default class TdmService {
  constructor(
    readonly roundService: RoundService,
    readonly permissionService: PermissionService,
    readonly playerService: PlayerService,
    readonly voteService: VoteService,
  ) {}

  @log
  @command(['start', 'arena', 'a'], {desc: 'Usage /{{cmdName}} <id> - start arena by id or code'})
  start(player: PlayerMp, fullText: string, description: string, id?: string) {
    this.permissionService.hasRight(player, 'tdm.start')

    if (!id) {
      return player.outputChatBox(description)
    }

    return this.roundService.start(id, player)
  }

  @log
  @command(['stop', 's'], {desc: 'Usage /{{cmdName}} - stop arena'})
  stop(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, 'tdm.stop')

    return this.roundService.stop(player)
  }

  @log
  @command('add', {desc: 'Usage /{{cmdName}} <player> - add player to round'})
  add(player: PlayerMp, fullText: string,description: string, id?: string) {
    this.permissionService.hasRight(player, 'tdm.add')

    if (typeof id === 'undefined') {
      return player.outputChatBox(description)
    }

    const addPlayer = this.playerService.getByIdOrName(id, player)

    if (!addPlayer) {
      return player.outputChatBox(`Игрок ${id} не найден`)
    }

    if (Array.isArray(addPlayer)) {
      return player.outputChatBox('Найдены следующие игроки: ' + addPlayer.map(p => p.name).join(', '))
    }

    return this.roundService.add(addPlayer)
  }

  @log
  @command('remove', {desc: 'Usage /{{cmdName}} <player> - remove player from round'})
  remove(player: PlayerMp, fullText: string,description: string, id?: string) {
    this.permissionService.hasRight(player, 'tdm.remove')

    if (typeof id === 'undefined') {
      return player.outputChatBox(description)
    }

    const removePlayer = this.playerService.getByIdOrName(id, player)

    if (!removePlayer) {
      return player.outputChatBox(`Игрок ${id} не найден`)
    }

    if (Array.isArray(removePlayer)) {
      return player.outputChatBox('Найдены следующие игроки: ' + removePlayer.map(p => p.name).join(', '))
    }

    return this.roundService.remove(removePlayer)
  }

  @log
  @command('pause', {desc: 'Usage /{{cmdName}} - pause round'})
  pause(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, 'tdm.pause')

    return this.roundService.pause(player)
  }

  @log
  @command('unpause', {desc: 'Usage /{{cmdName}} - unpause round'})
  unpause(player: PlayerMp, fullText: string, description: string) {
    this.permissionService.hasRight(player, 'tdm.pause')

    return this.roundService.unpause(player)
  }

  @log
  @command('vote', {desc: 'Usage //{{cmdName}} <id|code> vote for arena'})
  vote(player: PlayerMp, fullText: string, description: string, id?: string) {
    this.permissionService.hasRight(player, 'tdm.vote')

    if (!id) {
      return player.outputChatBox(description)
    }

    const arena = Arena.get(id, player)

    return this.voteService.voteArena(player, arena.id, (result) => {
      return this.roundService.start(result)
    })
  }
}