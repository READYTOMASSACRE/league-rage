import { event, eventable } from "../../league-core";
import { toClientProfile, toProfile } from "../../league-core/src/helpers/toStatistic";
import { Events, userId } from "../../league-core/src/types";
import { Role } from "../../league-core/src/types/permission";
import { Profile } from "../../league-core/src/types/statistic";
import PlayerService from "./PlayerService";
import RepositoryService from "./RepositoryService";

@eventable
export default class ProfileService {
  constructor(
    readonly playerService: PlayerService,
    readonly repositoryService: RepositoryService
  ) {}

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

    return this.repositoryService.profile.save({
      ...profile,
      id: userId,
    })
  }

  async getById(userId: userId) {
    const profile = await this.repositoryService.profile.getById(userId)
    return toProfile(profile)
  }

  atUserId(userId: userId): PlayerMp {
    return this.playerService.atUserId(userId)
  }

  async logSocial(player: PlayerMp) {
    try {
      player.userId = `rg_${player.rgscId}`
      player.logged = 'pending'

      const userProfile = await this.getById(player.userId)
      const profile = toProfile({ name: player.name, id: player.userId, ...userProfile })

      this.playerService.setVariable(player, 'profile', toClientProfile(profile))
      this.playerService.setVariable(player, 'role', profile.role)

      player.name = profile.name
      player.logged = 'social'

      if (!userProfile) {
        await this.saveById(profile.id, profile)
      }

      mp.events.call(Events["tdm.profile.login"], player.id, player.userId, player.logged)
    } catch (err) {
      console.error(err)
      player.logged = 'error'
    }
  }
}