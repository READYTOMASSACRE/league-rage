import { log, eventable, event, helpers } from "../../league-core";
import { Events } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";

interface VoteConfig {
  timer: NodeJS.Timeout
  players: number[]
  result: Record<string, number>
}

@eventable
export default class VoteService {
  private info: Record<string, VoteConfig> = {}

  constructor(
    readonly config: VoteConfig,
    readonly lang: ILanguage,
  ) {}

  @log
  @event("playerQuit")
  playerQuit(player: PlayerMp) {
    for (const[, info] of Object.entries(this.info)) {
      if (info.players.includes(player.id)) {
        info.players = info.players.filter(id => id !== player.id)
      }
    }
  }

  @log
  voteArena(player: PlayerMp, key: string | number, callback: (result: string) => void) {
    if (typeof this.config["arena"] === 'undefined') {
      throw new BroadCastError(this.lang.get(Lang["error.vote.not_found_config"], { vote: 'arena' }), player)
    }

    if (this.isRunning('arena')) {
      this.add('arena', key, player)
    } else {
      this.start('arena', key, player, callback)
    }
  }

  @log
  isRunning(vote: string) {
    return Boolean(this.info[vote] && this.info[vote].timer)
  }

  @log
  getResult(vote: string): string {
    const {key} = Object.entries(this.info[vote].result).reduce((acc, [key, vote]) => {
      if (acc.vote < vote) {
        acc.key = key
        acc.vote = vote
      }

      return acc
    }, {key: undefined, vote: 0})

    return key
  }

  @log
  private add(vote: string, key: string | number, player: PlayerMp) {
    const info = this.info[vote]

    if (info.players.includes(player.id)) {
      return player.outputChatBox(this.lang.get(Lang["error.vote.already_voted"]))
    }

    info.result[key]++

    mp.events.call(Events["tdm.vote"], vote, player.id, key)
  }

  @log
  private start(vote: string, key: string | number, player: PlayerMp, callback: (result: string) => void) {
    this.info[vote] = {
      result: {[key]: 1},
      players: [player.id],
      timer: setTimeout(() => {
        try {
          const result = this.getResult(vote)
          callback(result)
          this.stop(vote, result)
        } catch (err) {
          console.error(err)
        }
      }, this.getTimeleft(vote))
    }

    mp.events.call(Events["tdm.vote.start"], vote, player.id, key)
  }

  @log
  private stop(vote: string, result?: string) {
    clearTimeout(this.info[vote]?.timer)
    delete this.info[vote]

    mp.events.call(Events["tdm.vote.end"], vote, result)
  }

  @log
  private getTimeleft(vote: string) {
    return helpers.toMs(this.config[vote])
  }
}