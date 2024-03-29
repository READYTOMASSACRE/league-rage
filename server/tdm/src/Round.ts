import { helpers } from "../../../core"
import { IDummyService } from "../../../core/src/server/DummyService"
import { Events } from "../../../core/src/types"
import { Entity, RoundState, State, Team, WeaponState } from "../../../core/src/types/tdm"
import Arena from "./Arena"
import PlayerService from "./PlayerService"
import TeamService from "./TeamService"

interface RoundConfig {
  arena: Arena
  players: number[]
  prepareSeconds: number
  roundSeconds: number
  aliveWatcher: boolean
}

export default class Round {
  private prepareTimer: ReturnType<typeof setTimeout>
  private roundTimer: ReturnType<typeof setTimeout>
  private weaponTimer: ReturnType<typeof setTimeout>
  private _players: number[] = []
  private date: number = 0

  constructor(
    readonly config: RoundConfig,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly dummyService: IDummyService,
  ) {
    this.time = helpers.toMs(this.config.roundSeconds)
    this.prepareTimer = setTimeout(() => this.start(), helpers.toMs(this.config.prepareSeconds))
    this.state = RoundState.prepare

    this.config.players.forEach(player => {
      const vector = this.arena.getRandVector(this.playerService.getTeam(player))

      this.playerService.setState(player, State.prepare)
      this.playerService.spawn(player, vector)
    })

    this.dummyService.set(Entity.ROUND, 'arena', this.arena.code)
    mp.events.call(Events["tdm.round.prepare"], this.arena.id, this.config.players)
    mp.players.call(Events["tdm.round.prepare"], [this.arena.id, this.config.players])
  }

  start() {
    if (this.running) {
      return
    }

    this.players = this.config.players.filter(id => (
      ![State.select, State.spectate].includes(this.playerService.getState(id))
    ))
    this.players.forEach(id => this.addPlayer(id))
    this.roundTimer = setTimeout(() => this.end(), this.time)
    this.date = Date.now()
    this.state = RoundState.running

    if (this.shouldRunning) {
      this.watch()
      mp.players.call(Events["tdm.round.start"], [this.arena.id, this.players])
      mp.events.call(Events["tdm.round.start"], this.arena.id, this.players)
    } else {
      this.end()
    }
  }

  end() {
    if (!this.prepared && !this.running && !this.paused) {
      return
    }

    if (this.stopped) {
      return
    }

    const result = this.getResult()

    this.state = RoundState.stopped
    this.time = 0
    this.dummyService.set(Entity.ROUND, 'arena', '')

    this.players = [...this.players, ...this.config.players.filter(id => (
      ![State.select, State.spectate].includes(this.playerService.getState(id)) &&
      !this.players.includes(id)
    ))]

    const players = [...this.players]

    this.players.forEach(id => this.removePlayer(id))

    clearTimeout(this.prepareTimer)
    clearTimeout(this.roundTimer)
    clearTimeout(this.weaponTimer)

    this.teamService.addScore(result)

    mp.players.call(Events["tdm.round.end"], [this.arena.id, result, players])
    mp.events.call(Events["tdm.round.end"], this.arena.id, result, players)
  }

  addPlayer(id: number, manual?: boolean, whoAdded?: number) {
    this.playerService.setState(id, State.alive)
    this.playerService.setHealth(id, 100)

    this.players = [...this.players, id]

    this.playerService.call([id], Events["tdm.round.add"], id, manual, this.arena.id, whoAdded)
    mp.events.call(Events["tdm.round.add"], id, manual, this.arena.id, whoAdded)
  }

  removePlayer(id: number, reason?: 'manual' | 'death', whoRemoved?: number) {
    if (!this.players.includes(id)) {
      return
    }

    this.players = this.players.filter(playerId => playerId !== id)

    this.playerService.call([id], Events["tdm.round.remove"], id, reason, this.arena.id, whoRemoved)
    mp.events.call(Events["tdm.round.remove"], id, reason, this.arena.id, whoRemoved)
  }

  playerQuit(id: number) {
    this.players = this.players.filter(playerId => playerId !== id)
  }

  pause() {
    clearTimeout(this.roundTimer)
    this.time = this.timeleft
    this.state = RoundState.paused

    this.playerService.call(this.players, Events["tdm.round.pause"], true)
    mp.events.call(Events["tdm.round.pause"], true)
  }

  unpause() {
    if (!this.timeleft) {
      return this.end()
    }

    this.roundTimer = setTimeout(() => this.end(), this.time)
    this.date = Date.now()
    this.state = RoundState.running

    this.playerService.call(this.players, Events["tdm.round.pause"], false)
    mp.events.call(Events["tdm.round.pause"], false)

  }

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

  private async watch() {
    if (!this.config.aliveWatcher) {
      return
    }

    while (this.shouldRunning) {
      await helpers.sleep(0.1)
    }

    this.end()
  }

  private get shouldRunning(): boolean {
    if (this.config.aliveWatcher) {
      const {attackers, defenders} = this.info
  
      if (!attackers || !defenders) {
        return false
      }
    }

    return true
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
    const ms = this.time - (Date.now() - this.date)

    return ms > 0 ? ms : 0
  }

  get arena() {
    return this.config.arena
  }

  get running() {
    return this.state === RoundState.running
  }

  get paused() {
    return this.state === RoundState.paused
  }

  get prepared() {
    return this.state === RoundState.prepare
  }

  get stopped() {
    return this.state === RoundState.stopped
  }

  get players(): number[] {
    return this._players
  }

  private set players(p: number[]) {
    this.dummyService.set(Entity.ROUND, 'players', p)
    this._players = p
  }

  get time() {
    return this.dummyService.get(Entity.ROUND, 'time')
  }

  private set time(t: number) {
    this.dummyService.set(Entity.ROUND, 'time', t)
  }

  get state() {
    return this.dummyService.get(Entity.ROUND, 'state')
  }

  private set state(s: RoundState) {
    this.dummyService.set(Entity.ROUND, 'state', s)
  }
}