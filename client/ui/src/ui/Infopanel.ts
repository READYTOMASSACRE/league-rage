import { event, eventable } from "../../../league-core/client";
import { cef, Events, Procs } from "../../../league-core/src/types";
import { Entity, RoundState, Team } from "../../../league-core/src/types/tdm";
import DummyService from "../DummyService";
import TeamService from "../TeamService";
import UIService from "../UIService";

@eventable
export default class Infopanel {
  private interval: number = 0
  private dateStart: number = 0

  constructor(
    readonly uiService: UIService,
    readonly dummyService: DummyService,
    readonly teamService: TeamService,
  ) {}

  @event(Events["tdm.ui.ready"])
  async onReady() {
    const state = this.dummyService.get(Entity.ROUND, 'state')
    const time = this.dummyService.get(Entity.ROUND, 'time')

    if (state === RoundState.running) {
      const timeleft = await mp.events.callRemoteProc(Procs["tdm.round.timeleft"])
      this.dateStart = Date.now() - (time - timeleft)
      clearInterval(this.interval)
      this.interval = setInterval(() => this.sendRoundData(), 1000)
    }

    this.sendRoundData()
  }

  sendRoundData() {
    if (this.uiService.cef) {
      this.uiService.cef.call(Events["tdm.infopanel.data"], this.data, true)
    }
  }

  @event(Events["tdm.round.start"])
  roundStart() {
    this.dateStart = Date.now()
    clearInterval(this.interval)
    this.interval = setInterval(() => this.sendRoundData(), 1000)
  }

  @event(Events["tdm.round.end"])
  roundEnd() {
    clearInterval(this.interval)
    this.sendRoundData()
  }

  @event(Events["tdm.team.swap"])
  teamSwap() {
    this.sendRoundData()
  }

  @event(Events["tdm.round.pause"])
  roundPause(toggle: boolean) {
    clearInterval(this.interval)
    if (!toggle) {
      this.dateStart = Date.now()
      this.interval = setInterval(() => this.sendRoundData(), 1000)
    }
  }

  get data(): cef.InfoPanel {
    const attackers = this.teamService.getTeam(Team.attackers)
    const defenders = this.teamService.getTeam(Team.defenders)

    return {
      attackers: {
        name: attackers.name,
        color: attackers.color,
        score: attackers.score,
      },
      defenders: {
        name: defenders.name,
        color: defenders.color,
        score: defenders.score,
      },
      arena: this.dummyService.get(Entity.ROUND, 'arena'),
      timeleft: Math.floor(this.timeleft / 1000),
      pause: this.dummyService.get(Entity.ROUND, 'state') === RoundState.paused,
    }
  }
  
  get timeleft(): number {
    const time = this.dummyService.get(Entity.ROUND, 'time')
    const timeleft = time - (Date.now() - this.dateStart)

    return timeleft > 0 ? timeleft : 0
  }
}