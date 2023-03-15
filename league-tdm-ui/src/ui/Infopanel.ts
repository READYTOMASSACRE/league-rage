import { event, eventable, logClient } from "../../../league-core/client";
import { cef, Events } from "../../../league-core/src/types";
import { Entity, RoundState, TeamConfig } from "../../../league-core/src/types/tdm";
import DummyService from "../DummyService";
import UIService from "../UIService";

@eventable
export default class Infopanel {
  constructor(
    readonly config: TeamConfig,
    readonly uiService: UIService,
    readonly dummyService: DummyService,
  ) {}

  @event([
    Events["tdm.ui.ready"],
    Events["tdm.round.start"],
    Events["tdm.round.end"],
    Events["tdm.round.pause"]
  ])
  sendRoundData() {
    if (this.uiService.cef) {
      this.uiService.cef.call(Events["tdm.infopanel.data"], this.data, true)
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
      timeleft: this.dummyService.get(Entity.ROUND, 'time') / 1000 - 1,
      pause: this.dummyService.get(Entity.ROUND, 'state') === RoundState.paused,
    }
  }
}