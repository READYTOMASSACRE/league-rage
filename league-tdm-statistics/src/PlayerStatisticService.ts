import { eventable, event } from '../../league-core'
import { Events } from '../../league-core/src/types'
import { PlayerStat } from '../../league-core/src/types/tdm'
import PlayerService from './PlayerService'
import toPlayerStat from '../../league-core/src/helpers/toPlayerStat'

@eventable
export default class PlayerStatisticService {
  constructor(readonly playerService: PlayerService) {}

  @event("playerReady")
  playerReady(player: PlayerMp) {
    this.playerService.setVariable(player, 'statistic', toPlayerStat())
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

  addStat<_, K extends keyof PlayerStat>(
    player: PlayerMp | number,
    key: K,
    modifier: (prev: PlayerStat[K]) => PlayerStat[K] = (prev) => prev + 1,
  ) {
    if (typeof player === 'number') player = mp.players.at(player)
    if (!mp.players.exists(player)) return

    const statistic = this.playerService.getVariable(player, 'statistic')
    statistic[key] = modifier(statistic[key])

    this.playerService.setVariable(player, 'statistic', statistic)
  }
}