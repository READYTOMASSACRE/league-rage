import { eventable, event, commandable, command, log } from '../../league-core'
import { decorate } from '../../league-core/src/helpers'
import { Events, userId } from '../../league-core/src/types'
import { Entity, Team, TeamConfig } from '../../league-core/src/types/tdm'
import PlayerService from './PlayerService'
import { PlayerStat, Profile, Round, StatisticConfig } from '../../league-core/src/types/statistic'
import { toPlayerStat, toRound } from '../../league-core/src/helpers/toStatistic'
import DummyService from "../../league-core/src/server/DummyService";
import ProfileService from './ProfileService'
import RoundService from './RoundService'

@commandable
@eventable
export default class RoundStatisticService {
  private stat: Round

  constructor(
    readonly config: TeamConfig,
    readonly statisticConfig: StatisticConfig,
    readonly playerService: PlayerService,
    readonly profileService: ProfileService,
    readonly roundService: RoundService,
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

    const attackers = Object.entries(this.getPlayersStatByTeam(Team.attackers))
    const defenders = Object.entries(this.getPlayersStatByTeam(Team.defenders))

    if (!attackers.length && !defenders.length) {
      this.stat = this.toDefault()
      return
    }

    const promises = []

    for (const [userId, stat] of attackers) {
      promises.push(this.saveProfile(userId, stat, result === 'draw' ? undefined : result === Team.attackers))
    }

    for (const [userId, stat] of defenders) {
      promises.push(this.saveProfile(userId, stat, result === 'draw' ? undefined : result === Team.defenders))
    }

    await Promise.all(promises)

    this.roundService.save({
      id: Date.now(),
      arenaId: arenaId,
      result,
      [Team.attackers]: this.stat[Team.attackers],
      [Team.defenders]: this.stat[Team.defenders],
    })

    this.stat = this.toDefault()
  }

  @event(Events['tdm.player.kill'])
  playerKill(victimId: number, killerId: number, weapon: string, assistId?: number) {
    const addKda = (_: number, full: PlayerStat) => {
      const kda = (full.kill + full.assists / (full.death || 1)).toFixed(2)
      return Number(kda)
    }

    this.addStat(killerId, 'kill', prev => prev + 1)
    this.addStat(killerId, 'exp', prev => prev + this.exp.kill)
    this.addStat(killerId, 'kda', addKda)

    this.addStat(victimId, 'death', prev => prev + 1)
    this.addStat(victimId, 'exp', prev => prev + this.exp.death)
    this.addStat(victimId, 'kda', addKda)

    if (typeof assistId !== 'undefined') {
      this.addStat(assistId, 'assists', prev => prev + 1)
      this.addStat(assistId, 'exp', prev => prev + this.exp.assist)
      this.addStat(assistId, 'kda', addKda)
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
    modifier: (prev: PlayerStat[K], full?: PlayerStat) => PlayerStat[K],
  ) {
    if (typeof player === 'number') player = mp.players.at(player)
    if (!mp.players.exists(player)) return

    const team = this.playerService.getTeam(player)
    const teamStat = this.getPlayersStatByTeam(team)

    if (!teamStat[player.userId]) teamStat[player.userId] = toPlayerStat()
    teamStat[player.userId][key] = modifier(teamStat[player.userId][key], teamStat[player.userId])
  }

  @log
  private async saveProfile(userId: userId, stat: PlayerStat, win?: boolean) {
    try {
      const player = this.profileService.atUserId(userId)
      const profile = await this.profileService.getById(userId)
      const profileStat = this.mergePlayerStat(profile, stat)

      await this.profileService.saveById(userId, {
        ...(player ? { name: player.name } : {}),
        ...profileStat,
        ...this.calculateLvl(profile.lvl, stat.exp + profile.exp),
        ...this.calculateAverageStats(profileStat, profile, win),
      })
    } catch (err) {
      console.error(err)
    }
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
      kda: old.kda + stat.kda,
    }
  }

  private toDefault() {
    const attackers = this.getTeam(Team.attackers) ?? this.config.attackers
    const defenders = this.getTeam(Team.defenders) ?? this.config.defenders

    return toRound({
      [Team.attackers]: {
        name: attackers.name,
        players: {},
      },
      [Team.defenders]: {
        name: defenders.name,
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

  private calculateAverageStats(stat: Omit<PlayerStat, 'exp' | 'name'>, profile: Profile, win: boolean) {
    const wins = win === true ? profile.wins + 1 : profile.wins
    const loses = win === false ? profile.loses + 1 : profile.loses
    const draws = win === undefined ? profile.draws + 1 : profile.draws
    const matches = wins + loses + draws

    const victory = (wins / (matches || 1) * 100).toFixed(2)
    const kda = ((profile.kill + profile.assists) / (profile.death || 1)).toFixed(2)
    const averageDamage = (profile.damageDone / (matches || 1)).toFixed(2)

    return {
      victory: Number(victory),
      rating: profile.rating + (win ? 10 : 0),
      kda: Number(kda),
      averageDamage: Number(averageDamage),
      wins,
      loses,
      draws,
    }
  }

  private getTeam(team: Team) {
    return DummyService.get(Entity.TEAM, team)
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