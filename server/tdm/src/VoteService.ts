import { eventable, helpers, catchError, event, BroadCastError } from "../../../core";
import { shuffle } from "../../../core/src/helpers";
import { Events, userId } from "../../../core/src/types";
import { Vote, VoteConfig } from "../../../core/src/types/tdm";
import { ILanguage, Lang } from "../../../lang/language";
import ErrorNotifyHandler from "./error/ErrorNotifyHandler";

interface InternalVoteConfig {
  timer: NodeJS.Timeout
  players: userId[]
  result: Record<string, number>
}

@eventable
export default class VoteService {
  private info: Record<string, InternalVoteConfig> = {}

  constructor(
    readonly config: VoteConfig,
    readonly lang: ILanguage,
  ) {}

  @catchError(ErrorNotifyHandler)
  voteArena(player: PlayerMp, key: string | number, callback: (result: string) => void) {
    if (typeof this.config["arena"] === 'undefined') {
      throw new BroadCastError(Lang["error.vote.not_found_config"], player, { vote: Vote.arena })
    }

    if (this.isRunning(Vote.arena)) {
      this.add(Vote.arena, key, player)
    } else {
      this.start(Vote.arena, key, callback, player)
    }
  }

  isRunning(vote: Vote) {
    return Boolean(this.info[vote] && this.info[vote].timer)
  }

  getResult(vote: Vote): string | undefined {
    const { result } = this.info[vote]

    if (!result) {
      return
    }

    const votes = Object.entries(result)

    shuffle(votes)

    const {key} = votes.reduce((acc, [key, vote]) => {
      if (acc.vote < vote) {
        acc = { key, vote }
      }

      return acc
    }, {key: undefined, vote: 0})

    return key
  }

  private add(vote: Vote, key: string | number, player: PlayerMp) {
    const info = this.info[vote]

    if (info.players.includes(player.userId)) {
      throw new BroadCastError(Lang["error.vote.already_voted"], player)
    }

    info.result[key] = info.result[key] ? info.result[key] + 1 : 1
    info.players.push(player.userId)

    mp.events.call(Events["tdm.vote"], vote, player.id, this.info[vote].result)
  }

  private start(vote: Vote, key: string | number, callback: (result: string) => void, player?: PlayerMp) {
    this.info[vote] = {
      result: { [key]: 1 },
      players: player ? [player.userId] : [],
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

    mp.events.call(Events["tdm.vote.start"], vote, player?.id, this.info[vote].result)
  }

  stop(vote: string, result?: string) {
    clearTimeout(this.info[vote]?.timer)

    this.info[vote] = {
      result: {},
      players: [],
      timer: undefined,
    }

    mp.events.call(Events["tdm.vote.end"], vote, result)
  }

  private getTimeleft(vote: string) {
    return helpers.toMs(this.config[vote])
  }
}