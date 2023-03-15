import { event, eventable } from "../../../league-core/client";
import { cef, Events } from "../../../league-core/src/types";
import { Entity, RoundState, TeamConfig } from "../../../league-core/src/types/tdm";
import DummyService from "../DummyService";
import UIService from "../UIService";

@eventable
export default class Infopanel {
  private interval: number = 0
  private dateStart: number = 0

  constructor(
    readonly config: TeamConfig,
    readonly uiService: UIService,
    readonly dummyService: DummyService,
  ) {}

  @event(Events["tdm.ui.ready"])
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

  @event(Events["tdm.round.pause"])
  roundPause(toggle: boolean) {
    clearInterval(this.interval)
    if (!toggle) {
      this.dateStart = Date.now()
      this.interval = setInterval(() => this.sendRoundData(), 1000)
    }
  }

  get data(): cef.InfoPanel {
    return {
      attackers: {
        name: this.config.attackers.name,
        color: this.config.attackers.color,
        score: 0,
      },
      defenders: {
        name: this.config.defenders.name,
        color: this.config.defenders.color,
        score: 0,
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