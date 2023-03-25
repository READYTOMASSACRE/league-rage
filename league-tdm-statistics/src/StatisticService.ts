import { addDays, differenceInCalendarDays, endOfDay, startOfDay, subDays } from "date-fns";
import { proc, proceable } from "../../league-core";
import { Procs } from "../../league-core/src/types";
import RepositoryService from "./RepositoryService";

const MAX_DIFF_INTERVAL = 2

@proceable
export default class PlayerProfileService {
  constructor(readonly repositoryService: RepositoryService) {}

  @proc(Procs["tdm.statistic.profile.get"])
  async getProfile(player: PlayerMp, idOrUserId?: string | number) {
    const userId = this.getUserId(player, idOrUserId)
    const profile = await this.repositoryService.profile.getById(userId)

    if (!profile) return

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
  async getRound(player: PlayerMp, idOrUserId?: string | number, dateFrom?: number, dateTo?: number) {
    const userId = this.getUserId(player, idOrUserId)
    const now = Date.now()
    const yesterday = +startOfDay(subDays(now, 1))
    const tomorrow = +endOfDay(addDays(now, 1))

    dateFrom = Number(dateFrom) || yesterday
    dateTo = Number(dateTo) || tomorrow

    if (differenceInCalendarDays(dateFrom, dateTo) > MAX_DIFF_INTERVAL) {
      dateFrom = yesterday
      dateTo = tomorrow
    }

    return this.repositoryService.round.get({ userId, dateFrom, dateTo })
  }

  private getUserId(player: PlayerMp, idOrUserId?: number | string) {
    if (typeof idOrUserId !== 'undefined') {
      const targetId = Number(idOrUserId) || -1
      const targetPlayer = mp.players.at(targetId)
  
      if (mp.players.exists(targetPlayer)) {
        idOrUserId = targetPlayer.userId
      }

      return String(idOrUserId)
    }

    return player.userId
  }
}