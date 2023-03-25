import { eventable, event, commandable, command, log } from '../../league-core'
import { decorate } from '../../league-core/src/helpers'
import toPlayerStat from '../../league-core/src/helpers/toPlayerStat'
import { Events, rgscId } from '../../league-core/src/types'
import { PlayerStat, RoundStatData, Team } from '../../league-core/src/types/tdm'
import PlayerService from './PlayerService'
import RepositoryService from './repository/RepositoryService'

@commandable
@eventable
export default class RoundStatisticService {
  private stat: RoundStatData

  constructor(
    readonly playerService: PlayerService,
    readonly repositoryService: RepositoryService
  ) {
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
    const playerStats = [
      ...Object.entries(this.stat.players.attackers),
      ...Object.entries(this.stat.players.defenders),
    ]

    for (const [rgscId, stat] of playerStats) {
      this.saveProfileByRgscId(rgscId, stat)
    }

    this.repositoryService.round.save({
      id: Date.now(),
      arenaId: arenaId,
      result,
      attackers: this.stat.players.attackers,
      defenders: this.stat.players.defenders,
    }, { write: true })
    this.stat = this.getDefault()
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

  private async saveProfileByRgscId(rgscId: rgscId, stat: PlayerStat) {
    const player = this.playerService.atRgscId(rgscId)
    const profile = await this.repositoryService.profile.getById(rgscId)

    return this.repositoryService.profile.save({
      id: rgscId,
      ...profile,
      ...this.mergePlayerStat(profile, stat),
      ...(player ? { name: player.name } : {}),
    })
  }

  private mergePlayerStat(old: PlayerStat, stat: PlayerStat) {
    old = toPlayerStat(old)
    stat = toPlayerStat(stat)

    return {
      kill: old.kill + stat.kill,
      death: old.death + stat.death,
      assists: old.assists + stat.assists,
      damageDone: old.damageDone + stat.damageDone,
      damageRecieved: old.damageRecieved + stat.damageRecieved,
      hit: old.hit + stat.hit,
    }
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