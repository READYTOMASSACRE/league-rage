import { toMs } from "../helpers"
import Arena from "./Arena"
import PlayerService from "./PlayerService"

interface RoundConfig {
  arena: Arena
  players: number[]
  prepareSeconds: number
  roundSeconds: number
}

export default class Round {
  private prepareTimer: number = 0
  private roundTimer: number = 0
  private players: number[] = []
  private startDate: number = 0
  private _running: boolean = false

  constructor(
    readonly config: RoundConfig,
    readonly playerService: PlayerService
  ) {
    mp.events.call('tdm.round.prepare', [this.arena.id])
    this.prepareTimer = setTimeout(this.prepare.bind(this), this.prepareTime)
  }

  prepare() {
    this.config.players.map(id => this.addPlayer(id))
    this.roundTimer = setTimeout(() => this.end(), this.roundTime)
    this.startDate = Date.now()

    this._running = true
    mp.events.call('tdm.round.start', [this.arena.id])
    this.playerService.call('tdm.round.start', this.players, [this.arena.id])
  }

  end() {
    const result = this.getResult()
    this.players.forEach(id => this.removePlayer(id))

    this._running = false
    mp.events.call('tdm.round.end', [this.arena.id, result])
  }
  
  destroy() {
    clearTimeout(this.prepareTimer)
    clearTimeout(this.roundTimer)

    this.end()
    mp.events.call('tdm.round.destroy', [this.arena.id])
  }

  addPlayer(id: number) {
    const vector = this.arena.getRandVector(this.playerService.getTeam(id))

    this.playerService.setDimension(id, this.arena.dimension)
    this.playerService.spawn(id, vector)
    this.playerService.setState(id, 'alive')
    this.playerService.setHealth(id, 99)

    this.players.push(id)

    mp.events.call('tdm.round.addPlayer', [id])
  }

  removePlayer(id: number) {
    this.players = this.players.filter(playerId => playerId !== id)
    this.playerService.setState(id, 'lobby')
    this.playerService.spawnLobby(id)

    mp.events.call('tdm.round.removePlayer', [id])
  }

  private getResult(): "attackers" | "defenders" | "draw" {
    const result = this.info

    if (result.attackers === result.defenders) {
      if (result.attackersHealth === result.defendersHealth) {
        return "draw"
      }

      return result.attackersHealth > result.defendersHealth
        ? "attackers"
        : "defenders"
    }

    return result.attackers > result.defenders
      ? "attackers"
      : "defenders"
  }

  get info() {
    return this.players.reduce((acc, id) => {
      const teamId = this.playerService.getTeam(id)
      const health = this.playerService.getHealth(id)

      if (teamId === 0) { // todo use enums
        acc.attackers++
        acc.attackersHealth += health
      } else {
        acc.defenders++
        acc.defendersHealth += health
      }

      return acc
    }, {
      attackers: 0,
      attackersHealth: 0,
      defenders: 0,
      defendersHealth: 0,
    })
  }

  private get prepareTime() {
    return toMs(this.config.prepareSeconds)
  }
  private get roundTime() {
    return toMs(this.config.roundSeconds)
  }

  get arena() {
    return this.config.arena
  }

  get running() {
    return this._running
  }
}