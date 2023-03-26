import { PlayerData } from "../../league-core/src/types/tdm"

export default class PlayerService {
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
    const player = mp.players.toArray().find(player => player.userId === id)
    return mp.players.exists(player) ? player : undefined
  }
}