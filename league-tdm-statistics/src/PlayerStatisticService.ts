import { eventable, event } from '../../league-core'
import { Events } from '../../league-core/src/types'
import { PlayerStat } from '../../league-core/src/types/tdm'
import PlayerService from './PlayerService'

@eventable
export default class PlayerStatisticService {
  constructor(readonly playerService: PlayerService) {}

  @event(Events['tdm.player.kill'])
  playerKill(victimId: number, killerId: number, weapon: string, assistId?: number) {
    this.setStat(killerId, 'kill', prev => prev + 1)
    this.setStat(victimId, 'death', prev => prev + 1)
    if (typeof assistId !== 'undefined') this.setStat(assistId, 'assists', prev => prev + 1)
  }

  @event(Events['tdm.player.damage'])
  playerDamage(victimId: number, killerId: number, weapon: string, damage: number) {
    this.setStat(victimId, 'damageRecieved', prev => prev + damage)
    this.setStat(killerId, 'damageDone', prev => prev + damage)
    this.setStat(killerId, 'hit', prev => prev + 1)
  }

  setStat<_, K extends keyof PlayerStat>(
    player: PlayerMp | number, key: K, modifier: (prev: PlayerStat[K]) => PlayerStat[K]
  ) {
    if (typeof player === 'number') player = mp.players.at(player)
    if (!mp.players.exists(player)) return

    const statistic = this.playerService.getVariable(player, 'statistic')
    statistic[key] = modifier(statistic[key])

    this.playerService.setVariable(player, 'statistic', statistic)
  }
}