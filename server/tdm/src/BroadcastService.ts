import { event, eventable } from "../../../core";
import { Enviroment, Events, IConfig, tdm, userId } from "../../../core/src/types";
import { ChatItem } from "../../../core/src/types/cef";
import { Role } from "../../../core/src/types/permission";
import { AuthType } from "../../../core/src/types/statistic";
import { Vote } from "../../../core/src/types/tdm";
import { ILanguage, Lang } from "../../../lang/language";
import Arena from "./Arena";
import PlayerService from "./PlayerService";
import TeamService from "./TeamService";

@eventable
export default class BroadcastService {
  private defaultNotifyAlive = 5

  constructor(
    readonly config: IConfig,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly lang: ILanguage,
  ) {}

  onRoundAdd(id: number, manual?: boolean, arenaId?: number, whoAdded?: number) {
    if (manual) {
      const message = this.lang.get(Lang["tdm.round.add"], { player: id })

      this.byServer(message)

      if (typeof whoAdded !== 'undefined') {
        this.playerService.popup(whoAdded, message, 'success')
      }
    }
  }

  onRoundRemove(id: number, reason?: 'manual' | 'death', arenaId?: number, whoRemoved?: number) {
    if (reason === 'manual') {
      const message = this.lang.get(Lang["tdm.round.remove"], { player: id })
      this.byServer(message)

      if (typeof whoRemoved !== 'undefined') {
        this.playerService.popup(whoRemoved, message, 'success')
      }
    }
  }

  @event(Events["tdm.vote"], { serverOnly: true })
  tdmVote(vote: Vote, id: number, key: Record<string, number> | string) {
    const player = this.playerService.getById(id)
    const alive = this.config.vote[vote] || this.defaultNotifyAlive
    const replacements = this.getReplacements(vote, player, key)
    const message = this.getMessage(vote, Lang["tdm.vote.add"], replacements)

    this.byServer(message.replace('%ss', ''))

    if (vote == Vote.arena) {
      this.notify(this.lang.get(Lang["tdm.vote.text_arena_notify"], replacements), alive, vote, 'default', true)
    } else {
      this.notify(message, alive, vote, 'default', true)
    }
  }

  @event(Events["tdm.vote.start"], { serverOnly: true })
  tdmVoteStart(vote: Vote, id: number, key: Record<string, number> | string) {
    const player = this.playerService.getById(id)
    const alive = this.config.vote[vote] || this.defaultNotifyAlive
    const replacements = this.getReplacements(vote, player, key)
    const message = this.getMessage(vote, Lang["tdm.vote.text"], replacements)

    this.byServer(message.replace('%ss', ''))

    if (vote == Vote.arena) {
      this.notify(this.lang.get(Lang["tdm.vote.text_arena_notify"], replacements), alive, vote, 'default')
    } else {
      this.notify(message, alive, vote, 'default')
    }
  }

  @event(Events["tdm.vote.end"], { serverOnly: true })
  tdmVoteEnd(vote: Vote, result?: string) {
    if (result) {
      this.byServer(this.lang.get(Lang["tdm.vote.end"], { vote, result }))
    }

    this.notifyStop(vote)
  }

  private getReplacements(vote: Vote, player: PlayerMp, key: Record<string, number> | string) {
    const replacements = {
      vote,
      player: player?.name,
      key: String(key),
    }
    if (typeof key !== 'undefined' && vote === Vote.arena) {
      const votes = []
      for (const [arenaId, count] of Object.entries(key)) {
        try {
          const arena = Arena.get(arenaId)
          votes.push(`${arena.code} (${count})`)
        } catch (err) {
          console.error(err)
        }
      }

      replacements.key = votes.join(', ')
    }

    return replacements
  }

  @event(Events["tdm.chat.push"])
  tdmChatPush(player: PlayerMp, message?: string) {
    if (message?.[0] === '/') {
      return
    }

    if (!mp.players.exists(player)) {
      return
    }

    const team = this.playerService.getTeam(player)
    const color = this.teamService.getTeam(team).color

    return this.broadcast({
      message: [
        [`${player.name} [${player.id}]:`, color],
        [message, '#fff'],
      ]
    })
  }

  @event("playerJoin")
  playerJoin(player: PlayerMp) {
    mp.players.forEachFast(p => p.outputChatBox(this.lang.get(Lang["tdm.player.join"], {
      player: player.name
    })))
  }

  @event("playerQuit")
  playerQuit(player: PlayerMp, exitType: string, reason?: string) {
    mp.players.forEachFast(p => p.outputChatBox(this.lang.get(Lang["tdm.player.quit"], {
      player: player.name,
      reason: [exitType, reason].filter(Boolean).join(', ')
    })))
  }

  @event(Events["tdm.player.change_name"])
  onChangeName(id: number, old: string, newName: string) {
    this.byServer(this.lang.get(Lang["tdm.player.change_name"], { player: old, new: newName }))
  }

  @event(Events["tdm.permission.role"])
  playerRole(id: number, role: Role) {
    this.byServer({
      message: [
        [this.lang.get(Lang["tdm.permission.role"], { role }), '#6ce36f']
      ]
    }, [id])
  }

  @event("playerReady")
  overrideOutputChatBox(player: PlayerMp) {
    const self = this
    player.outputChatBox = function (input: string | ChatItem, byServer = true) {
      if (byServer) {
        if (typeof input === 'string') {
          input = { message: [[input, '#fff']] }
        }

        input = {
          message: [
            [`[${self.config.prefix}]:`, '#ffd400'],
            ...input.message,
          ]
        }
      }

      this.call(Events["tdm.chat.push"], [input, Enviroment.server])
    }

    player.outputPopup = function(message: string, type: string = 'info') {
      this.call(Events["tdm.popup.push"], [message, type])
    }

    this.byServer(this.config.welcomeText, [player.id])
  }

  @event(Events["tdm.profile.login"])
  playerLogin(id: number, userId: userId, authType: AuthType) {
    const player = this.playerService.getById(id)
    const role = this.playerService.getRole(id)
    const message = this.lang.get(Lang["tdm.player.login"], { player: player.name, role })

    this.byServer({ message: [[message, '#6ce36f']] }, [id])
    this.playerService.popup(id, message, 'success')
  }

  @event(Events["tdm.client.ready"])
  clientReady(player: PlayerMp) {
    player.outputChatBox(this.config.welcomeText.replace(':player', player.name))
  }

  broadcast(message: string | ChatItem, players?: number[]) {
    if (Array.isArray(players)) {
      this.playerService.call(players, Events["tdm.chat.push"], message, Enviroment.server)
    } else {
      mp.players.call(Events["tdm.chat.push"], [message, Enviroment.server])
    }

    return message
  }

  byServer(input: string | ChatItem, players?: number[]) {
    if (typeof input === 'string') {
      input = { message: [[input, '#fff']] }
    }

    input = {
      message: [
        [`[${this.config.prefix}]:`, '#ffd400'],
        ...input.message,
      ]
    }

    return this.broadcast(input, players)
  }

  notify(text: string, alive: number, component: string, template: string = 'default', keepAlive?: boolean) {
    mp.players.call(Events["tdm.notify.text"], [text, alive, component, template, keepAlive])
  }

  notifyStop(component: Vote) {
    mp.players.call(Events["tdm.notify.stop"], [component])
  }

  private getMessage(vote: Vote, lang: Lang, replacements?: Record<string, string | number>) {
    const langCode = `${lang}_${vote}`
    let message = this.lang.get(<Lang>langCode, replacements)

    return message !== langCode ? message : this.lang.get(<Lang>lang, replacements)
  }
}