import { toPlayerStat } from "../../../core/src/helpers/toStatistic"
import { userId } from "../../../core/src/types"
import { PlayerData } from "../../../core/src/types/tdm"

export default class PlayerService {
  setVariable<_, K extends keyof PlayerData, V extends PlayerData[K]>(
    player: PlayerMp, key: K, value: V
  ) {
    player.setVariable(String(key), value)
  }

  getVariable<_, K extends keyof PlayerData>(
    player: PlayerMp, key: K
  ): PlayerData[K] | undefined {
    return player.getVariable(String(key))
  }

  getStatistic(player: PlayerMp) {
    return toPlayerStat(this.getVariable(player, 'statistic'))
  }

  getTeam(player: PlayerMp) {
    const team = this.getVariable(player, 'team')

    if (!team) throw new Error('player team not found: ' + player.id)

    return team
  }

  atUserId(id: userId): PlayerMp | undefined {
    const player = mp.players.toArray().find(player => player.userId === id)
    return player && mp.players.exists(player) ? player : undefined
  }

  at(id: number): PlayerMp | undefined {
    return mp.players.at(id)
  }
}