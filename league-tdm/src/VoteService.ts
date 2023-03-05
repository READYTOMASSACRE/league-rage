import { log, eventable, event, helpers } from "../../league-core";
import { Events } from "../../league-core/src/types";

interface VoteConfig {
  timer: NodeJS.Timeout
  players: number[]
  result: Record<string, number>
}

@eventable
export default class VoteService {
  private info: Record<string, VoteConfig> = {}
  private seconds: Record<string, number> = {
    voteArena: 30,
  }

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
    if (this.isRunning('voteArena')) {
      this.add('voteArena', key, player)
    } else {
      this.start('voteArena', key, player, callback)
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
      return player.outputChatBox('Вы уже проголосовали')
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
    return helpers.toMs(this.seconds[vote])
  }
}