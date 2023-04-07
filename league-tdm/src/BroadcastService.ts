import { event, eventable } from "../../league-core";
import { Enviroment, Events, IConfig, tdm, userId } from "../../league-core/src/types";
import { ChatItem } from "../../league-core/src/types/cef";
import { Role } from "../../league-core/src/types/permission";
import { AuthType } from "../../league-core/src/types/statistic";
import { Vote } from "../../league-core/src/types/tdm";
import { ILanguage, Lang } from "../../league-lang/language";
import Arena from "./Arena";
import PlayerService from "./PlayerService";
import TeamService from "./TeamService";

@eventable
export default class BroadcastService {
  private arenas: string[] = []
  private defaultNotifyAlive = 5

  constructor(
    readonly config: IConfig,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly lang: ILanguage,
  ) {}

  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare(id: number) {
    this.broadcastByServer(this.lang.get(Lang["tdm.round.arena_prepare"], { arena: id }))
  }

  @event(Events["tdm.round.start"])
  tdmRoundStart(id: number, players: number[]) {
    const message = this.lang.get(Lang["tdm.round.arena_start"], { arena: id })

    this.broadcastByServer(message)
    this.playerService.popup(id, message, 'success')
  }

  @event(Events["tdm.round.end"])
  tdmRoundEnd(id: number, team: tdm.Team | "draw") {
    const result = this.teamService.getName(team)

    this.broadcastByServer(this.lang.get(Lang["tdm.round.end"], { arena: id, result }))
  }

  @event(Events["tdm.round.add"])
  tdmRoundAdd(id: number, manual?: boolean) {
    if (manual) {
      const message = this.lang.get(Lang["tdm.round.add"], { player: id })

      this.broadcastByServer(message)
      this.playerService.popup(id, message, 'success')
    }
  }

  @event(Events["tdm.round.remove"])
  tdmRoundRemove(id: number, manual?: boolean) {
    if (manual) {
      const message = this.lang.get(Lang["tdm.round.remove"], { player: id })
      this.broadcastByServer(message)
      this.playerService.popup(id, message, 'success')
    }
  }

  @event(Events["tdm.round.pause"])
  tdmRoundPause(toggle: boolean) {
    this.broadcastByServer(toggle ?
      this.lang.get(Lang["tdm.round.is_paused"]) :
      this.lang.get(Lang["tdm.round.is_unpaused"])
    )
  }

  @event(Events["tdm.vote"])
  tdmVote(vote: Vote, id: number, key: string) {
    const player = this.playerService.getById(id)
    const alive = this.config.vote[vote] || this.defaultNotifyAlive
    const replacements = { vote, player: player?.name, key }
    const message = this.getMessage(vote, Lang["tdm.vote.add"], replacements)

    this.broadcastByServer(message.replace('%ss', ''))

    if (vote == Vote.arena) {
      const arena = Arena.get(key)
      if (!this.arenas.includes(arena.code)) {
        this.arenas.push(arena.code)
      }

      replacements.key = this.arenas.join(', ')
      this.notify(this.lang.get(Lang["tdm.vote.text_arena_notify"], replacements), alive, vote, 'top', true)
    } else {
      this.notify(message, alive, vote, 'top', true)
    }
  }

  @event(Events["tdm.vote.start"])
  tdmVoteStart(vote: Vote, id: number, key: string) {
    const player = this.playerService.getById(id)

    if (vote == Vote.arena) {
      this.arenas = [key]
    }

    const alive = this.config.vote[vote] || this.defaultNotifyAlive
    const replacements = { vote, player: player?.name, key }
    const message = this.getMessage(vote, Lang["tdm.vote.text"], replacements)

    this.broadcastByServer(message.replace('%ss', ''))

    if (vote == Vote.arena) {
      const arena = Arena.get(key)
      this.arenas = [arena.code]
      replacements.key = arena.code
      this.notify(this.lang.get(Lang["tdm.vote.text_arena_notify"], replacements), alive, vote, 'top')
    } else {
      this.notify(message, alive, vote, 'top')
    }
  }

  @event(Events["tdm.vote.end"])
  tdmVoteEnd(vote: Vote, result: string) {
    this.arenas = []
    this.broadcastByServer(this.lang.get(Lang["tdm.vote.end"], { vote, result }))
    this.notifyStop(vote)
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
    this.broadcastByServer(this.lang.get(Lang["tdm.player.change_name"], { player: old, new: newName }))
  }

  @event(Events["tdm.permission.role"])
  playerRole(id: number, role: Role) {
    this.broadcastByServer({
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
          input = {
            message: [
              [`[${self.config.prefix}]:`, '#ffd400'],
              [input, '#fff'],
            ]
          }
        } else {
          input = {
            message: [
              [`[${self.config.prefix}]:`, '#ffd400'],
              ...input.message,
            ]
          }
        }
      }

      this.call(Events["tdm.chat.push"], [input, Enviroment.server])
    }

    player.outputPopup = function(message: string, type: string = 'info') {
      this.call(Events["tdm.popup.push"], [message, type])
    }

    this.broadcastByServer(this.config.welcomeText, [player.id])
  }

  @event(Events["tdm.profile.login"])
  playerLogin(id: number, userId: userId, authType: AuthType) {
    const player = this.playerService.getById(id)
    const role = this.playerService.getRole(id)
    const message = this.lang.get(Lang["tdm.player.login"], { player: player.name, role })

    this.broadcastByServer({ message: [[message, '#6ce36f']] }, [id])
    this.playerService.popup(id, message, 'success')
  }

  broadcast(message: string | ChatItem, players?: number[]) {
    if (Array.isArray(players)) {
      this.playerService.call(players, Events["tdm.chat.push"], message, Enviroment.server)
    } else {
      mp.players.call(Events["tdm.chat.push"], [message, Enviroment.server])
    }

    return message
  }

  broadcastByServer(input: string | ChatItem, players?: number[]) {
    if (typeof input === 'string') {
      input = {
        message: [
          [`[${this.config.prefix}]:`, '#ffd400'],
          [input, '#fff'],
        ]
      }
    } else {
      input = {
        message: [
          [`[${this.config.prefix}]:`, '#ffd400'],
          ...input.message,
        ]
      }
    }

    return this.broadcast(input, players)
  }

  notify(text: string, alive: number, component: string, template: string = 'default', keepAlive?: boolean) {
    mp.players.call(Events["tdm.notify.text"], [text, alive, component, template, keepAlive])
  }

  notifyStop(component: string) {
    mp.players.call(Events["tdm.notify.stop"], [component])
  }

  private getMessage(vote: Vote, lang: Lang, replacements?: Record<string, string | number>) {
    const langCode = `${lang}_${vote}`
    let message = this.lang.get(<Lang>langCode, replacements)

    return message !== langCode ? message : this.lang.get(<Lang>lang, replacements)
  }
}