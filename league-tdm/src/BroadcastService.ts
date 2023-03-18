import { event, eventable, log } from "../../league-core";
import { Enviroment, Events, tdm } from "../../league-core/src/types";
import { Vote, VoteConfig } from "../../league-core/src/types/tdm";
import { ILanguage, Lang } from "../../league-lang/language";
import Arena from "./Arena";
import PlayerService from "./PlayerService";
import TeamService from "./TeamService";

@eventable
export default class BroadcastService {
  private arenas: string[] = []
  private defaultNotifyAlive = 5

  constructor(
    readonly config: VoteConfig,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly lang: ILanguage,
  ) {}

  @log
  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare(id: number) {
    this.broadcast(this.lang.get(Lang["tdm.round.arena_prepare"], { arena: id }))

    mp.players.call(Events["tdm.round.prepare"], [id])
  }

  @log
  @event(Events["tdm.round.start"])
  tdmRoundStart(id: number, players: number[]) {
    this.broadcast(this.lang.get(Lang["tdm.round.arena_start"], { arena: id }))

    mp.players.call(Events["tdm.round.start"], [players, id])
  }

  @log
  @event(Events["tdm.round.end"])
  tdmRoundEnd(id: number, team: tdm.Team | "draw") {
    const result = this.teamService.getName(team)

    this.broadcast(this.lang.get(Lang["tdm.round.end"], { arena: id, result }))

    mp.players.call(Events["tdm.round.end"], [id, team])
  }

  @log
  @event(Events["tdm.round.add"])
  tdmRoundAdd(id: number, manual?: boolean) {
    if (manual) {
      this.broadcast(this.lang.get(Lang["tdm.round.add"], { player: id }))
    }
  }

  @log
  @event(Events["tdm.round.remove"])
  tdmRoundRemove(id: number, manual?: boolean) {
    if (manual) {
      this.broadcast(this.lang.get(Lang["tdm.round.remove"], { player: id }))
    }
  }

  @log
  @event(Events["tdm.round.pause"])
  tdmRoundPause(toggle: boolean) {
    this.broadcast(toggle ?
      this.lang.get(Lang["tdm.round.is_paused"]) :
      this.lang.get(Lang["tdm.round.is_unpaused"])
    )
  }

  @log
  @event(Events["tdm.vote"])
  tdmVote(vote: Vote, id: number, key: string) {
    const player = this.playerService.getById(id)
    const alive = this.config[vote] || this.defaultNotifyAlive
    const replacements = { vote, player: player?.name, key }
    const message = this.getMessage(vote, Lang["tdm.vote.add"], replacements)

    this.broadcast(message.replace('%ss', ''))

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

  @log
  @event(Events["tdm.vote.start"])
  tdmVoteStart(vote: Vote, id: number, key: string) {
    const player = this.playerService.getById(id)

    if (vote == Vote.arena) {
      this.arenas = [key]
    }

    const alive = this.config[vote] || this.defaultNotifyAlive
    const replacements = { vote, player: player?.name, key }
    const message = this.getMessage(vote, Lang["tdm.vote.text"], replacements)

    this.broadcast(message.replace('%ss', ''))

    if (vote == Vote.arena) {
      const arena = Arena.get(key)
      this.arenas = [arena.code]
      replacements.key = arena.code
      this.notify(this.lang.get(Lang["tdm.vote.text_arena_notify"], replacements), alive, vote, 'top')
    } else {
      this.notify(message, alive, vote, 'top')
    }
  }

  @log
  @event(Events["tdm.vote.end"])
  tdmVoteEnd(vote: Vote, result: string) {
    this.arenas = []
    this.broadcast(this.lang.get(Lang["tdm.vote.end"], { vote, result }))
    this.notifyStop(vote)
  }

  @log
  @event(Events["tdm.chat.push"])
  tdmChatPush(player: PlayerMp, message?: string) {
    if (message?.[0] === '/') {
      return
    }

    if (!mp.players.exists(player)) {
      return
    }

    return this.broadcast(`${player.name} [${player.id}]: ${message}`)
  }

  @log
  broadcast(message: string) {
    mp.players.call(Events["tdm.chat.push"], [message, Enviroment.server])
  }

  @log
  notify(text: string, alive: number, component: string, template: string = 'default', keepAlive?: boolean) {
    mp.players.call(Events["tdm.notify.text"], [text, alive, component, template, keepAlive])
  }

  @log
  notifyStop(component: string) {
    mp.players.call(Events["tdm.notify.stop"], [component])
  }

  @log
  @event("playerReady")
  overrideOutputChatBox(player: PlayerMp) {
    player.outputChatBox = function (message: string) {
      player.call(Events["tdm.chat.push"], [message, Enviroment.server])
    }
  }

  @log
  @event("playerJoin")
  playerJoin(player: PlayerMp) {
    mp.players.forEachFast(p => p.outputChatBox(this.lang.get(Lang["tdm.player.join"], {
      player: player.name
    })))
  }

  @log
  @event("playerQuit")
  playerQuit(player: PlayerMp, exitType: string, reason?: string) {
    mp.players.forEachFast(p => p.outputChatBox(this.lang.get(Lang["tdm.player.quit"], {
      player: player.name,
      reason: [exitType, reason].filter(Boolean).join(', ')
    })))
  }

  @log
  @event(Events["tdm.player.change_name"])
  onChangeName(id: number, old: string, newName: string) {
    this.broadcast(this.lang.get(Lang["tdm.player.change_name"], { player: old, new: newName }))
  }

  private getMessage(vote: Vote, lang: Lang, replacements?: Record<string, string | number>) {
    const langCode = `${lang}_${vote}`
    let message = this.lang.get(<Lang>langCode, replacements)

    return message !== langCode ? message : this.lang.get(<Lang>lang, replacements)
  }
}