import { log, helpers, types } from "../../league-core"
import { Events, tdm } from "../../league-core/src/types"
import Arena from "./Arena"
import PlayerService from "./PlayerService"

interface RoundConfig {
  arena: Arena
  players: number[]
  prepareSeconds: number
  roundSeconds: number
  weaponSeconds: number
}

export default class Round {
  private prepareTimer: ReturnType<typeof setTimeout>
  private roundTimer: ReturnType<typeof setTimeout>
  private weaponTimer: ReturnType<typeof setTimeout>
  private date: number = 0
  private roundTime: number = 0
  private _players: number[] = []
  private _running: boolean = false
  private _paused: boolean = false

  constructor(
    readonly config: RoundConfig,
    readonly playerService: PlayerService
  ) {
    this.roundTime = helpers.toMs(this.config.roundSeconds)
    this.prepareTimer = setTimeout(() => this.prepare(), helpers.toMs(this.config.prepareSeconds))
    this.weaponTimer = setTimeout(() => this.players.forEach((p) => (
      this.playerService.setWeaponState(p, tdm.WeaponState.has)
    )), helpers.toMs(this.config.weaponSeconds))

    mp.events.call(Events["tdm.round.prepare"], this.arena.id)
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

    if (this.shouldRunning) {
      this.watch()
      mp.events.call(Events["tdm.round.start"], this.arena.id, this.players)
    } else {
      this.end()
    }
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
    clearTimeout(this.weaponTimer)

    mp.events.call(Events["tdm.round.end"], this.arena.id, result)
  }

  @log
  addPlayer(id: number, manual?: boolean) {
    const vector = this.arena.getRandVector(this.playerService.getTeam(id))

    this.playerService.spawn(id, vector)
    this.playerService.setState(id, types.tdm.State.alive)
    this.playerService.setHealth(id, 100)

    this.players.push(id)

    mp.events.call(Events["tdm.round.add"], id, manual)
  }

  @log
  removePlayer(id: number, manual?: boolean) {
    if (!this.players.includes(id)) {
      return
    }

    this._players = this.players.filter(playerId => playerId !== id)
    this.playerService.setState(id, types.tdm.State.idle)
    this.playerService.spawnLobby(id)

    mp.events.call(Events["tdm.round.remove"], id, manual)
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

    mp.events.call(Events["tdm.round.pause"], true)
  }

  @log
  unpause() {
    if (!this.timeleft) {
      return this.end()
    }

    this.roundTimer = setTimeout(() => this.end(), this.roundTime)
    this.date = Date.now()
    this._paused = false

    mp.events.call(Events["tdm.round.pause"], false)

  }

  @log
  private getResult(): types.tdm.Team | "draw" {
    const result = this.info

    if (result.attackers === result.defenders) {
      if (result.attackersHealth === result.defendersHealth) {
        return "draw"
      }

      return result.attackersHealth > result.defendersHealth
        ? types.tdm.Team.attackers
        : types.tdm.Team.defenders
    }

    return result.attackers > result.defenders
      ? types.tdm.Team.attackers
      : types.tdm.Team.defenders
  }

  @log
  private async watch() { // todo rewise this lifecycle
    while (this.running) {
      if (!this.shouldRunning) {
        this.end()
        break
      }

      await helpers.sleep(0.1)
    }
  }

  private get shouldRunning(): boolean {
    const {attackers, defenders} = this.info

    if (!attackers || !defenders) {
      return false
    }

    return true
  }

  get info() {
    return this.players.reduce((acc, id) => {
      const teamId = this.playerService.getTeam(id)
      const health = this.playerService.getHealth(id)

      if (teamId === types.tdm.Team.attackers) {
        acc.attackers++
        acc.attackersHealth += health
      } else if (teamId === types.tdm.Team.defenders) {
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