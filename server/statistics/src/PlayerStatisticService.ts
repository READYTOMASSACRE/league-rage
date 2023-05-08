import { eventable, event } from '../../../core'
import { toPlayerStat } from '../../../core/src/helpers/toStatistic'
import { Events } from '../../../core/src/types'
import { PlayerStat } from '../../../core/src/types/statistic'
import PlayerService from './PlayerService'

@eventable
export default class PlayerStatisticService {
  constructor(readonly playerService: PlayerService) {}

  @event("playerReady")
  playerReady(player: PlayerMp) {
    this.playerService.setVariable(player, 'statistic', toPlayerStat())
  }

  @event(Events['tdm.player.kill'], { serverOnly: true })
  playerKill(victimId: number, killerId: number, weapon: string, assistId?: number) {
    this.addStat(killerId, 'kill', (prev) => prev + 1)
    this.addStat(victimId, 'death', (prev) => prev + 1)
    if (typeof assistId !== 'undefined') this.addStat(assistId, 'assists', (prev) => prev + 1)
  }

  @event(Events['tdm.player.damage'], { serverOnly: true })
  playerDamage(victimId: number, killerId: number, weapon: string, damage: number) {
    this.addStat(victimId, 'damageRecieved', prev => prev + damage)
    this.addStat(killerId, 'damageDone', prev => prev + damage)
    this.addStat(killerId, 'hit', (prev) => prev + 1)
  }

  addStat<_, K extends keyof PlayerStat>(
    player: PlayerMp | number,
    key: K,
    modifier: (prev: PlayerStat[K]) => PlayerStat[K],
  ) {
    if (typeof player === 'number') player = mp.players.at(player)
    if (!mp.players.exists(player)) return

    const statistic = this.playerService.getStatistic(player)
    statistic[key] = modifier(statistic[key])

    this.playerService.setVariable(player, 'statistic', statistic)
  }
}