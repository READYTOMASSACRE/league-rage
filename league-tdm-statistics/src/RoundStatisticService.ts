import { eventable, event, commandable, command } from '../../league-core'
import { decorate } from '../../league-core/src/helpers'
import { Events, userId } from '../../league-core/src/types'
import { Team, TeamConfig } from '../../league-core/src/types/tdm'
import PlayerService from './PlayerService'
import RepositoryService from './RepositoryService'
import { PlayerStat, Round, StatisticConfig } from '../../league-core/src/types/statistic'
import { toPlayerStat, toProfile, toRound } from '../../league-core/src/helpers/toStatistic'

@commandable
@eventable
export default class RoundStatisticService {
  private stat: Round

  constructor(
    readonly teamConfig: TeamConfig,
    readonly statisticConfig: StatisticConfig,
    readonly playerService: PlayerService,
    readonly repositoryService: RepositoryService
  ) {
    this.stat = this.toDefault()
  }

  @command('roundstat')
  roundStatCmd(player: PlayerMp) {
    player.outputChatBox(decorate(this.stat))

    return this.stat
  }

  @event(Events['tdm.round.prepare'])
  roundPrepare() {
    this.stat = this.toDefault()
  }

  @event(Events['tdm.round.add'])
  roundAdd(id: number, manual?: boolean) {
    const player = mp.players.at(id)
    if (!mp.players.exists(player)) return

    const team = this.playerService.getTeam(player)
    const teamStat = this.getPlayersStatByTeam(team)

    teamStat[player.userId] = toPlayerStat({
      ...teamStat[player.userId],
      name: player.name,
    })
  }

  @event(Events['tdm.round.end'])
  async roundEnd(arenaId: number, result: Team | 'draw') {
    if (result !== 'draw') {
      const winners = this.getPlayersStatByTeam(result)
  
      for (const userId of Object.keys(winners)) {
        this.addStat(
          this.playerService.atUserId(userId),
          'exp',
          prev => prev + this.exp.win
        )
      }
    }

    const playerStats = [
      ...Object.entries(this.getPlayersStatByTeam(Team.attackers)),
      ...Object.entries(this.getPlayersStatByTeam(Team.defenders)),
    ]

    const promises = []

    for (const [userId, stat] of playerStats) {
      promises.push(this.saveProfileByUserId(userId, stat))
    }

    await Promise.all(promises)

    this.repositoryService.round.save(toRound({
      id: Date.now(),
      arenaId: arenaId,
      result,
      [Team.attackers]: this.stat[Team.attackers],
      [Team.defenders]: this.stat[Team.defenders],
    }), { write: true })

    this.stat = this.toDefault()
  }

  @event(Events['tdm.player.kill'])
  playerKill(victimId: number, killerId: number, weapon: string, assistId?: number) {
    this.addStat(killerId, 'kill', prev => prev + 1)
    this.addStat(killerId, 'exp', prev => prev + this.exp.kill)

    this.addStat(victimId, 'death', prev => prev + 1)
    this.addStat(victimId, 'exp', prev => prev + this.exp.death)

    if (typeof assistId !== 'undefined') {
      this.addStat(assistId, 'assists', prev => prev + 1)
      this.addStat(assistId, 'exp', prev => prev + this.exp.assist)
    }
  }

  @event(Events['tdm.player.damage'])
  playerDamage(victimId: number, killerId: number, weapon: string, damage: number) {
    this.addStat(victimId, 'damageRecieved', prev => prev + damage)
    this.addStat(victimId, 'exp', prev => prev + this.exp.damageRecieved)

    this.addStat(killerId, 'damageDone', prev => prev + damage)
    this.addStat(killerId, 'exp', prev => prev + this.exp.damageDone)

    this.addStat(killerId, 'hit', prev => prev + 1)
    this.addStat(killerId, 'exp', prev => prev + this.exp.hit)
  }

  addStat<_, K extends keyof PlayerStat>(
    player: PlayerMp | number,
    key: K,
    modifier: (prev: PlayerStat[K]) => PlayerStat[K],
  ) {
    if (typeof player === 'number') player = mp.players.at(player)
    if (!mp.players.exists(player)) return

    const team = this.playerService.getTeam(player)
    const teamStat = this.getPlayersStatByTeam(team)

    if (!teamStat[player.userId]) teamStat[player.userId] = toPlayerStat()
    teamStat[player.userId][key] = modifier(teamStat[player.userId][key])
  }

  private async saveProfileByUserId(userId: userId, stat: PlayerStat) {
    const player = this.playerService.atUserId(userId)
    const userProfile = await this.repositoryService.profile.getById(userId)
    const profile = toProfile(userProfile)

    return this.repositoryService.profile.save({
      ...profile,
      ...(player ? { name: player.name } : {}),
      ...this.mergePlayerStat(profile, stat),
      ...this.calculateLvl(profile.lvl, stat.exp + profile.exp),
      id: userId,
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

  private toDefault() {
    return toRound({
      [Team.attackers]: {
        name: this.teamConfig[Team.attackers].name,
        players: {},
      },
      [Team.defenders]: {
        name: this.teamConfig[Team.defenders].name,
        players: {},
      }
    })
  }

  private getPlayersStatByTeam(team: Team): Record<userId, PlayerStat> {
    return this.stat[team]?.players || {}
  }

  private calculateLvl(lvl: number, exp: number) {
    return {
      lvl: lvl + Math.floor(exp / this.exp.expToLvl),
      exp: Math.floor(exp % this.exp.expToLvl),
    }
  }

  get exp() {
    return {
      kill: this.statisticConfig.exp.kill ?? 0,
      death: this.statisticConfig.exp.death ?? 0,
      assist: this.statisticConfig.exp.assist ?? 0,
      win: this.statisticConfig.exp.win ?? 0,
      hit: this.statisticConfig.exp.hit ?? 0,
      damageRecieved: this.statisticConfig.exp.damageRecieved ?? 0,
      damageDone: this.statisticConfig.exp.damageDone ?? 0,
      expToLvl: this.statisticConfig.exp.expToLvl ?? 1000,
    }
  }
}