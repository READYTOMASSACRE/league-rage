import { event, eventable, log } from "../../league-core"
import { PlayerData } from "../../league-core/src/types/tdm"

@eventable
export default class PlayerService {
  @log
  @event("playerJoin")
  overrideUserId(player: PlayerMp) {
    Object.defineProperty(player, 'userId', {
      get: () => this.getVariable(player, 'userId'),
      set: (value: string) => this.setVariable(player, 'userId', value)
    })

    player.userId = `rg_${player.rgscId}`
  }

  setVariable<_, K extends keyof PlayerData, V extends PlayerData[K]>(
    player: PlayerMp, key: K, value: V
  ) {
    player.setVariable(String(key), value)
  }

  getVariable<_, K extends keyof PlayerData>(
    player: PlayerMp, key: K
  ): PlayerData[K] {
    return player.getVariable(String(key))
  }

  getTeam(player: PlayerMp) {
    return this.getVariable(player, 'team')
  }

  atUserId(id: string): PlayerMp | undefined {
    const player = mp.players.toArrayFast().find(player => player.userId === id)
    return mp.players.exists(player) ? player : undefined
  }
}