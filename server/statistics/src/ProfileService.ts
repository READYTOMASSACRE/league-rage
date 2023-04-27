import { BroadCastError, catchError, event, eventable } from "../../../core";
import { toClientProfile, toProfile } from "../../../core/src/helpers/toStatistic";
import { Events, userId } from "../../../core/src/types";
import { Role } from "../../../core/src/types/permission";
import { Profile } from "../../../core/src/types/statistic";
import { Lang } from "../../../lang/language";
import PlayerService from "./PlayerService";
import RepositoryService from "./RepositoryService";
import ErrorNotifyHandler from "./error/ErrorNotifyHandler";

@eventable
export default class ProfileService {
  constructor(
    readonly playerService: PlayerService,
    readonly repositoryService: RepositoryService
  ) {}

  @event("playerJoin")
  async overrideUserId(player: PlayerMp) {
    Object.defineProperty(player, 'userId', {
      get: () => this.playerService.getVariable(player, 'userId'),
      set: (value: userId) => this.playerService.setVariable(player, 'userId', value)
    })
  }

  @event(Events["tdm.permission.role"])
  playerRole(id: number, role: Role) {
    const player = this.playerService.at(id)

    if (!player) return

    return this.saveById(player.userId, { role })
  }

  async saveById(userId: userId, profile: Partial<Profile> = {}) {
    const player = this.playerService.atUserId(userId)

    if (player) {
      const name = player.name
      const role = this.playerService.getVariable(player, 'role')

      profile = {name, role, ...profile}

      if (profile.role === Role.root) {
        profile.role = Role.admin
      }
    }

    return this.repositoryService.profile.save({...profile, _id: userId})
  }

  async getById(userId: userId) {
    return this.repositoryService.profile.getById(userId)
  }

  async getByRgscId(rgscId: string) {
    return this.repositoryService.profile.getByRgscId(rgscId)
  }

  @catchError(ErrorNotifyHandler)
  async logSocial(player: PlayerMp) {
    try {
      player.logged = 'pending'

      const userProfile = await this.getByRgscId(player.rgscId)

      if (!userProfile) {
        await this.repositoryService.profile.save(toProfile({
          name: player.name,
          rgscId: player.rgscId,
        }))
      }

      const profile = userProfile ?? await this.getByRgscId(player.rgscId)

      if (!profile) {
        throw new BroadCastError(Lang["error.not_found"], player)
      }

      player.name = profile.name || player.name
      player.userId = profile._id
      player.logged = 'social'

      this.playerService.setVariable(player, 'profile', toClientProfile(profile))
      this.playerService.setVariable(player, 'role', profile.role)

      mp.events.call(Events["tdm.profile.login"], player.id, player.userId, player.logged)
    } catch (err) {
      console.error(err)
      player.logged = 'error'
    }
  }
}