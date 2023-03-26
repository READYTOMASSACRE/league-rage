import { eventable, event, commandable, command, log } from '../../league-core'
import { decorate } from '../../league-core/src/helpers'
import toPlayerStat from '../../league-core/src/helpers/toPlayerStat'
import { Events, userId } from '../../league-core/src/types'
import { PlayerStat, RoundStatData, Team } from '../../league-core/src/types/tdm'
import PlayerService from './PlayerService'
import RepositoryService from './RepositoryService'
import deepmerge from 'deepmerge'

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
  roundPrepare(_: number, players: number[]) {
    this.stat = this.getDefault({ players: this.getDefaultPlayerStat(players) })
  }

  @event(Events['tdm.round.end'])
  async roundEnd(arenaId: number, result: Team | 'draw') {
    const playerStats = [
      ...Object.entries(this.stat.players.attackers),
      ...Object.entries(this.stat.players.defenders),
    ]

    const promises = []

    for (const [userId, stat] of playerStats) {
      promises.push(this.saveProfileByUserId(userId, stat))
    }

    await Promise.all(promises)

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

    if (!teamStat[player.userId]) teamStat[player.userId] = toPlayerStat()
    teamStat[player.userId][key] = modifier(teamStat[player.userId][key])
  }

  private async saveProfileByUserId(userId: userId, stat: PlayerStat) {
    const player = this.playerService.atUserId(userId)
    const profile = await this.repositoryService.profile.getById(userId)

    return this.repositoryService.profile.save({
      id: userId,
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

  private getDefault(data?: Partial<RoundStatData>): RoundStatData {
    const defautData: RoundStatData = {
      result: 'draw',
      players: {
        [Team.attackers]: {},
        [Team.defenders]: {},
      },
    }

    return data ? deepmerge(defautData, data) : defautData
  }

  private getDefaultPlayerStat(players: number[]) {
    const stats = {
      [Team.attackers]: <Record<userId, PlayerStat>>{},
      [Team.defenders]: <Record<userId, PlayerStat>>{},
    }

    for (const id of players) {
      const player = mp.players.at(id)
      if (!mp.players.exists(player)) continue

      const team = this.playerService.getTeam(player)
      if (team !== Team.attackers && team !== Team.defenders) continue

      stats[team][player.userId] = toPlayerStat()
    }

    return stats
  }
}