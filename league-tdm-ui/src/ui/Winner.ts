import { event, eventable, logClient } from "../../../league-core/client";
import { Events } from "../../../league-core/src/types";
import { Team, TeamConfig } from "../../../league-core/src/types/tdm";
import UIService from "../UIService";

@eventable
export default class Winner {
  constructor(
    readonly config: TeamConfig,
    readonly uiService: UIService
  ) {}

  @logClient
  @event(Events["tdm.round.end"])
  roundEnd(arenaId: number, result: Team | "draw") {
    const {
      name = result,
      color = '#fff',
    } = this.config[result] || {}

    this.uiService.cef.call(Events["tdm.cef.winner"], name, color)

    return {name, color}
  }

  @event(Events["tdm.round.prepare"])
  roundPrepare() {
    this.uiService.cef.call(Events["tdm.cef.winner"])
  }
}