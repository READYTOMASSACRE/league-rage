import PermissionError from "./error/PermissionError";
import { ILanguage, Lang } from "../../league-lang/language";
import PlayerService from "./PlayerService";
import { Right, Role, Rule } from "../../league-core/src/types/permission";
import { Events, IConfig } from "../../league-core/src/types";
import { command, commandable, event, eventable, catchError } from "../../league-core";
import ErrorNotifyHandler from "./error/ErrorNotifyHandler";
import BroadCastError from "./error/BroadCastError";

const MAX_RCON_ATTEMPTS = 3

@commandable
@eventable
export default class PermissionService {
  static readonly rights: Right = {
    [Role.socialUser]: {
      [Rule.tdmVote]: true,
    },
    [Role.authUser]: {
      [Rule.tdmVote]: true,
    },
    [Role.moderator]: {
      [Rule.tdmVote]: true,
      [Rule.tdmMute]: true,
      [Rule.tdmKick]: true,
    },
    [Role.admin]: {
      [Rule.tdmVote]: true,
      [Rule.tdmStop]: true,
      [Rule.tdmStart]: true,
      [Rule.tdmAdd]: true,
      [Rule.tdmRemove]: true,
      [Rule.tdmPause]: true,
      [Rule.tdmSwap]: true,
      [Rule.tdmMute]: true,
      [Rule.tdmKick]: true,
      [Rule.tdmBan]: true,
      [Rule.tdmRole]: true,
    },
    [Role.root]: '*',
  }

  constructor(
    readonly config: IConfig,
    readonly playerService: PlayerService,    
    readonly lang: ILanguage,
  ) {}

  @catchError(ErrorNotifyHandler)
  hasRight(player: PlayerMp, rule: Rule) {
    if (!rule) {
      throw new PermissionError(rule, player)
    }

    const role = this.playerService.getVariable(player, 'role')
    const rights = PermissionService.rights[role]

    if (rights !== '*' && (!rights || !rights[rule])) {
      throw new PermissionError(rule, player)
    }

    return true
  }

  @event('playerReady')
  playerReady(player: PlayerMp) {
    if (!this.config.rcon) {
      this.setRole(player, Role.root)
    }
  }

  @command('rcon')
  rconCmd(player: PlayerMp, fullText: string, description: string, rcon: string) {
    player.rconAttempts = player.rconAttempts ?? 0

    if (++player.rconAttempts > MAX_RCON_ATTEMPTS) {
      return player.kick('Too many attempts rcon auth')
    }

    if (rcon === String(this.config.rcon)) {
      this.setRole(player, Role.root)
    }
  }

  @catchError(ErrorNotifyHandler)
  @command('setrole', { desc: Lang["cmd.kill"] })
  setRoleCmd(player: PlayerMp, fullText: string, description: string, id?: number, role?: string) {
    this.hasRight(player, Rule.tdmRole)

    if (!role) {
      return player.outputChatBox(description)
    }
    
    if (typeof id === 'undefined') {
      return player.outputChatBox(description)
    }

    const foundPlayer = this.playerService.getByIdOrName(id)

    if (Array.isArray(foundPlayer)) {
      const message = this.lang.get(Lang["tdm.player.find_result"], { players: foundPlayer.map(p => p.name).join(', ') })
      return player.outputChatBox(message)
    }

    const availableRoles: Record<string, string[] | string> = {
      [Role.admin]: ['moderator', 'user'],
      [Role.root]: '*',
    }

    const mapRole = {
      'moderator': Role.moderator,
      'user': foundPlayer.logged === 'auth' ? Role.authUser : Role.socialUser,
      'admin': Role.admin,
      'root': Role.root,
    }

    const playerRole = this.playerService.getRole(player)
    const available = availableRoles[playerRole]

    if (
      available !== '*' && (
        !available ||
        !available.includes(role) ||
        !mapRole[role]
      )
    ) {
      throw new BroadCastError(Lang["error.permission.invalid_role"], player, { role, player: foundPlayer.name })
    }

    this.setRole(foundPlayer, mapRole[role])
  }

  setRole(player: PlayerMp, role: Role) {
    this.playerService.setRole(player, role)

    if (role === Role.root) {
      player.rconAttempts = 0
    }

    mp.events.call(Events["tdm.permission.role"], player.id, role)
  }
}