import { addDays, differenceInCalendarDays, endOfDay, startOfDay, subDays } from "date-fns";
import { event, eventable, log, proc, proceable } from "../../league-core";
import { toClientProfile, toProfile, toRound } from "../../league-core/src/helpers/toStatistic";
import { Events, Procs } from "../../league-core/src/types";
import PlayerService from "./PlayerService";
import ProfileService from "./ProfileService";
import RoundService from "./RoundService";

const MAX_DIFF_INTERVAL = 2

@eventable
@proceable
export default class StatisticService {
  constructor(
    readonly playerService: PlayerService,
    readonly profileService: ProfileService,
    readonly roundService: RoundService,
  ) {}

  @event("playerJoin")
  async overrideUserId(player: PlayerMp) {
    Object.defineProperty(player, 'userId', {
      get: () => this.playerService.getVariable(player, 'userId'),
      set: (value: string) => this.playerService.setVariable(player, 'userId', value)
    })
  }

  @event(Events["tdm.client.ready"])
  async playerReady(player: PlayerMp) {
    await this.profileService.logSocial(player)
  }

  @log
  @proc(Procs["tdm.statistic.profile.get"])
  async getProfile(player: PlayerMp, idOrUserId?: string | number) {
    try {
      const userId = this.getUserId(player, idOrUserId)
      const profile = await this.profileService.getById(userId)
  
      if (!profile) return
  
      return JSON.stringify(toClientProfile(profile))
    } catch (err) {
      console.error(err)
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

    return JSON.stringify(await this.roundService.get({ userId, dateFrom, dateTo }))
  }

  private getUserId(player: PlayerMp, idOrUserId?: number | string) {
    idOrUserId = idOrUserId ?? -1

    if (idOrUserId !== -1) {
      let targetPlayer = this.playerService.atUserId(String(idOrUserId))
      targetPlayer = targetPlayer ?? mp.players.at(Number(idOrUserId))
  
      if (!mp.players.exists(targetPlayer)) {
        return undefined
      }

      return String(idOrUserId)
    }

    return player.userId
  }
}