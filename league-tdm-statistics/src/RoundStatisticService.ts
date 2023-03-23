import { eventable, event, commandable, command, log } from '../../league-core'
import { decorate } from '../../league-core/src/helpers'
import toPlayerStat from '../../league-core/src/helpers/toPlayerStat'
import { Events } from '../../league-core/src/types'
import { PlayerStat, RoundStatData, Team } from '../../league-core/src/types/tdm'
import PlayerService from './PlayerService'

@commandable
@eventable
export default class RoundStatisticService {
  private stat: RoundStatData

  constructor(readonly playerService: PlayerService) {
    this.stat = this.getDefault()
  }

  @command('roundstat')
  roundStatCmd(player: PlayerMp) {
    player.outputChatBox(decorate(this.stat))

    return this.stat
  }

  @event(Events['tdm.round.prepare'])
  roundPrepare() {
    this.stat = this.getDefault()
  }

  @event(Events['tdm.round.end'])
  roundEnd(arenaId: number, result: Team | 'draw') {
    // this.stat = this.getDefault()
  }

  @event(Events['tdm.player.kill'])
  playerKill(victimId: number, killerId: number, weapon: string, assistId?: number) {
    this.addStat(killerId, 'kill')
    this.addStat(victimId, 'death')
    if (typeof assistId !== 'undefined') this.addStat(assistId, 'assists')
  }

  @event(Events['tdm.player.damage'])
  playerDamage(victimId: number, killerId: number, weapon: string, damage: number) {
    this.addStat(victimId, 'damageRecieved', prev => prev + damage)
    this.addStat(killerId, 'damageDone', prev => prev + damage)
    this.addStat(killerId, 'hit')
  }

  @log
  addStat<_, K extends keyof PlayerStat>(
    player: PlayerMp | number,
    key: K,
    modifier: (prev: PlayerStat[K]) => PlayerStat[K] = (prev) => prev + 1,
  ) {
    if (typeof player === 'number') player = mp.players.at(player)
    if (!mp.players.exists(player)) return

    const team = this.playerService.getTeam(player)
    const teamStat = this.stat.players[team]

    if (!teamStat[player.rgscId]) teamStat[player.rgscId] = toPlayerStat()
    teamStat[player.rgscId][key] = modifier(teamStat[player.rgscId][key])
  }

  private getDefault(): RoundStatData {
    return {
      result: 'draw',
      players: {
        [Team.attackers]: {},
        [Team.defenders]: {},
      }
    }
  }
}