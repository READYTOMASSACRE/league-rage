import { rgscId } from "../../league-core/src/types"
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

  atRgscId(rgscId: rgscId): PlayerMp | undefined {
    const player = mp.players.toArrayFast().find(player => player.rgscId === rgscId)
    return mp.players.exists(player) ? player : undefined
  }
}