import { addDays, differenceInCalendarDays, endOfDay, startOfDay, subDays } from "date-fns";
import { event, eventable, proc, proceable } from "../../league-core";
import { toProfile } from "../../league-core/src/helpers/toStatistic";
import { Procs } from "../../league-core/src/types";
import PlayerService from "./PlayerService";
import RepositoryService from "./RepositoryService";

const MAX_DIFF_INTERVAL = 2

@eventable
@proceable
export default class StatisticService {
  constructor(
    readonly repositoryService: RepositoryService,
    readonly playerService: PlayerService,
  ) {}

  @event("playerJoin")
  async overrideUserId(player: PlayerMp) {
    Object.defineProperty(player, 'userId', {
      get: () => this.playerService.getVariable(player, 'userId'),
      set: (value: string) => this.playerService.setVariable(player, 'userId', value)
    })

    player.userId = `rg_${player.rgscId}`

    const userProfile = await this.repositoryService.profile.getById(player.userId)
    const profile = toProfile({ name: player.name, id: player.userId, ...userProfile })

    this.playerService.setVariable(player, 'profile', profile)
    player.name = profile.name
    
    if (!userProfile) this.repositoryService.profile.save(profile)
  }

  @proc(Procs["tdm.statistic.profile.get"])
  async getProfile(player: PlayerMp, idOrUserId?: string | number) {
    const userId = this.getUserId(player, idOrUserId)
    const profile = await this.repositoryService.profile.getById(userId)

    if (!profile) return

    return toProfile(profile)
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