import { log, helpers } from "../../league-core"
import { State, Team } from "./types"
import Arena from "./Arena"
import PlayerService from "./PlayerService"

interface RoundConfig {
  arena: Arena
  players: number[]
  prepareSeconds: number
  roundSeconds: number
}

export default class Round {
  private prepareTimer: ReturnType<typeof setTimeout>
  private roundTimer: ReturnType<typeof setTimeout>
  private _players: number[] = []
  private date: number = 0
  private _running: boolean = false
  private _paused: boolean = false
  private roundTime: number = 0
  private prepareTime: number = 0

  constructor(
    readonly config: RoundConfig,
    readonly playerService: PlayerService
  ) {
    this.roundTime = helpers.toMs(this.config.roundSeconds)
    this.prepareTime = helpers.toMs(this.config.prepareSeconds)

    mp.events.call('tdm.round.prepare', this.arena.id)
    this.prepareTimer = setTimeout(this.prepare.bind(this), this.prepareTime)
  }

  @log
  prepare() {
    if (this.running) {
      return
    }

    this.config.players.map(id => this.addPlayer(id))
    this.roundTimer = setTimeout(() => this.end(), this.roundTime)
    this.date = Date.now()
    this._running = true
    this.watch()

    mp.events.call('tdm.round.start', this.arena.id, this.players)
  }

  @log
  end() {
    if (!this.running) {
      return
    }

    const result = this.getResult()
    this.players.forEach(id => this.removePlayer(id))
    this._running = false

    clearTimeout(this.prepareTimer)
    clearTimeout(this.roundTimer)

    mp.events.call('tdm.round.end', this.arena.id, result)
  }

  @log
  addPlayer(id: number, manual?: boolean) {
    const vector = this.arena.getRandVector(this.playerService.getTeam(id))

    this.playerService.spawn(id, vector)
    this.playerService.setState(id, State.alive)
    this.playerService.setHealth(id, 99)

    this.players.push(id)

    mp.events.call('tdm.round.addPlayer', id, manual)
  }

  @log
  removePlayer(id: number, manual?: boolean) {
    if (!this.players.includes(id)) {
      return
    }

    this._players = this.players.filter(playerId => playerId !== id)
    this.playerService.setState(id, State.idle)
    this.playerService.spawnLobby(id)

    mp.events.call('tdm.round.removePlayer', id, manual)
  }

  @log
  playerQuit(id: number) {
    this._players = this.players.filter(playerId => playerId !== id)
  }

  @log
  pause() {
    clearTimeout(this.roundTimer)
    this.roundTime = this.timeleft
    this._paused = true

    mp.events.call('tdm.round.pause', true)
  }

  @log
  unpause() {
    if (!this.timeleft) {
      return this.end()
    }

    this.roundTimer = setTimeout(() => this.end(), this.roundTime)
    this.date = Date.now()
    this._paused = false

    mp.events.call('tdm.round.pause', false)

  }

  @log
  private getResult(): Team | "draw" {
    const result = this.info

    if (result.attackers === result.defenders) {
      if (result.attackersHealth === result.defendersHealth) {
        return "draw"
      }

      return result.attackersHealth > result.defendersHealth
        ? Team.attackers
        : Team.defenders
    }

    return result.attackers > result.defenders
      ? Team.attackers
      : Team.defenders
  }

  @log
  private async watch() {
    while (this.running) {
      const {attackers, defenders} = this.info

      if (!attackers || !defenders) {
        this.end()
        break
      }

      await helpers.sleep(0.1)
    }
  }

  get info() {
    return this.players.reduce((acc, id) => {
      const teamId = this.playerService.getTeam(id)
      const health = this.playerService.getHealth(id)

      if (teamId === Team.attackers) {
        acc.attackers++
        acc.attackersHealth += health
      } else if (teamId === Team.defenders) {
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

  get timeleft() {
    const ms = this.roundTime - Date.now() - this.date

    return ms > 0 ? ms : 0
  }

  get arena() {
    return this.config.arena
  }

  get running() {
    return this._running
  }

  get paused() {
    return this._paused
  }

  get players() {
    return this._players
  }
}