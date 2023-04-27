import { event, eventable, log, proc, proceable } from "../../../core";
import { toClientProfile } from "../../../core/src/helpers/toStatistic";
import { Events, Procs } from "../../../core/src/types";
import { ListRequest } from "../../../core/src/types/statistic";
import PlayerService from "./PlayerService";
import ProfileService from "./ProfileService";
import RoundService from "./RoundService";
import { maxLimit } from "./helpers";

@eventable
@proceable
export default class StatisticService {
  constructor(
    readonly playerService: PlayerService,
    readonly profileService: ProfileService,
    readonly roundService: RoundService,
  ) {}

  @event(Events["tdm.client.ready"])
  async playerReady(player: PlayerMp) {
    await this.profileService.logSocial(player)
  }

  @proc(Procs["tdm.statistic.profile.get"])
  async getProfile(player: PlayerMp, idOrUserId?: string | number) {
    try {
      const userId = this.getUserId(player, idOrUserId)

      if (!userId) return

      const profile = await this.profileService.getById(userId)
  
      if (!profile) return
  
      return JSON.stringify(toClientProfile(profile))
    } catch (err) {
      console.error(err)
    }
  }

  @proc(Procs["tdm.statistic.round.get"])
  async getRound(
    player: PlayerMp,
    idOrUserId?: string | number,
    limit: number = maxLimit,
    offset?: number,
    dateFrom?: number,
    dateTo?: number, 
  ) {
    try {
      const userId = this.getUserId(player, idOrUserId)
  
      const query: ListRequest = {
        userId,
        limit,
        offset: offset ?? 0,
      }
  
      if (dateFrom) {
        query.dateFrom = Number(dateFrom)
      }
  
      if (dateTo) {
        query.dateTo = Number(dateTo)
      }
  
      return JSON.stringify(await this.roundService.get(query))
    } catch (err) {
      console.error(err)
      return []
    }
  }

  @log
  @proc(Procs["tdm.statistic.round.total"])
  async getRoundCount(
      player: PlayerMp,
      idOrUserId?: string | number,
      dateFrom?: number,
      dateTo?: number, 
    ) {
    const userId = this.getUserId(player, idOrUserId)

    const query: ListRequest = {
      userId,
    }

    if (dateFrom) {
      query.dateFrom = Number(dateFrom)
    }

    if (dateTo) {
      query.dateTo = Number(dateTo)
    }

    return await this.roundService.count(query)
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