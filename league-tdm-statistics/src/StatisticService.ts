import { proc, proceable } from "../../league-core";
import { Procs, userId } from "../../league-core/src/types";
import RepositoryService from "./RepositoryService";

@proceable
export default class PlayerProfileService {
  constructor(readonly repositoryService: RepositoryService) {}

  @proc(Procs["tdm.statistic.profile.get"])
  async getProfile(player: PlayerMp, id?: number, userId?: string) {
    userId = this.getUserId(player, id, userId)
    if (!userId) return

    const profile = await this.repositoryService.profile.getById(id)

    return {
      lvl: profile.lvl,
      exp: profile.exp,
      kill: profile.kill,
      death: profile.death,
      assists: profile.assists,
      damageDone: profile.damageDone,
      damageRecieved: profile.damageRecieved,
      hit: profile.hit,
      name: profile.name,
    }
  }

  @proc(Procs["tdm.statistic.round.get"])
  async getRound(player: PlayerMp, id?: number, userId?: userId) {
    userId = this.getUserId(player, id, userId)
    if (!userId) return []

    return this.repositoryService.round.get({userId})
  }

  private getUserId(player: PlayerMp, id?: number, userId?: userId) {
    userId = userId || player.userId

    if (typeof id !== 'undefined') {
      const targetPlayer = mp.players.at(id)
      if (!mp.players.exists(targetPlayer)) return

      userId = targetPlayer.userId
    }

    return userId
  }
}