import { toMs } from "../../core/src/helpers";
import { log, eventable, event } from "../../core/server";
import { VoteConfig } from "./types";

@eventable
export default class VoteService {
  private info: Record<string, VoteConfig> = {}
  private seconds: Record<string, number> = {
    voteArena: 30,
  }

  @log
  @event(RageEnums.EventKey.PLAYER_QUIT)
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

    mp.events.call('tdm.vote', vote, player.id, key)
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

    mp.events.call('tdm.vote.start', vote, player.id, key)
  }

  @log
  private stop(vote: string, result?: string) {
    clearTimeout(this.info[vote]?.timer)
    delete this.info[vote]

    mp.events.call('tdm.vote.end', vote, result)
  }

  @log
  private getTimeleft(vote: string) {
    return toMs(this.seconds[vote])
  }
}