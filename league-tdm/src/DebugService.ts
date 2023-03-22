import { command, commandable, log } from "../../league-core";
import { decorate } from "../../league-core/src/helpers";
import { IDummyService } from "../../league-core/src/server/DummyService";
import { Entity } from "../../league-core/src/types/tdm";
import PlayerService from "./PlayerService";
import TaskManager from "./TaskManager";

@commandable
export default class DebugService {
  constructor(
    readonly playerService: PlayerService,
    readonly dummyService: IDummyService,
  ) {}

  @command('health')
  setHealth(player: PlayerMp, fullText: string, description: string, health: string = "100", id?: string) {
    const debugPlayer = this.playerService.getByIdOrName(id) || player

    if (Array.isArray(debugPlayer)) {
      return player.outputChatBox(debugPlayer.map(p => p.name).join(', '))
    }

    debugPlayer.health = Number(health)
  }

  @log
  @command('state', { group: 'debug'})
  getStateCmd(player: PlayerMp) {
    const state = this.getState(player)

    player.outputChatBox(state)
    
    return state
  }

  @log
  @command('data', { group: 'debug'})
  playerDataCmd(player: PlayerMp) {
    const data = this.playerData(player)

    player.outputChatBox(decorate(data))

    return data
  }

  @log
  @command('tasks', { group: 'debug'})
  tasks(player: PlayerMp) {
    const message = `Task size: ${TaskManager.size}, Running: ${TaskManager.isRunning ? 'true' : 'false'}`

    player.outputChatBox(message)

    return message
  }

  @log
  @command('round', { group: 'debug' })
  roundData(player: PlayerMp) {
    const data = {
      arena: this.dummyService.get(Entity.ROUND, 'arena'),
      players: this.dummyService.get(Entity.ROUND, 'players'),
      state: this.dummyService.get(Entity.ROUND, 'state'),
      time: this.dummyService.get(Entity.ROUND, 'time'),
    }

    player.outputChatBox(decorate(data))

    return data
  }

  @log
  @command('player', { group: 'debug'})
  player(player: PlayerMp, fullText: string, description?: string, id?: string) {
    if (!id) {
      return
    }

    const debugPlayer = this.playerService.getByIdOrName(id) || player

    if (Array.isArray(debugPlayer)) {
      return player.outputChatBox(debugPlayer.map(p => p.name).join(', '))
    }

    const data = this.playerData(debugPlayer)

    player.outputChatBox(decorate(data))

    return data
  }

  @log
  @command('get', { group: 'debug'})
  get(player: PlayerMp, fullText: string, description?: string, key?: string, id?: string) {
    if (!key) {
      return
    }

    const debugPlayer = this.playerService.getByIdOrName(id) || player

    if (Array.isArray(debugPlayer)) {
      return player.outputChatBox(debugPlayer.map(p => p.name).join(', '))
    }

    const data = debugPlayer[key]

    player.outputChatBox(decorate(data))

    return data
  }

  private getState(player: PlayerMp) {
    return this.playerService.getState(player)
  }

  private playerData(player: PlayerMp) {
    return {
      alive: this.playerService.getVariable(player, 'alive'),
      health: this.playerService.getVariable(player, 'health'),
      state: this.playerService.getVariable(player, 'state'),
      team: this.playerService.getVariable(player, 'team'),
      weaponSlot: this.playerService.getVariable(player, 'weaponSlot'),
      weaponState: this.playerService.getVariable(player, 'weaponState'),
      position: player.position,
    }
  }
}