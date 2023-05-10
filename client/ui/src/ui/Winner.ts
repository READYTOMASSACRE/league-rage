import { event, eventable } from "../../../../core/client";
import { Events } from "../../../../core/src/types";
import { Team } from "../../../../core/src/types/tdm";
import TeamService from "../TeamService";
import UIService from "../UIService";

@eventable
export default class Winner {
  constructor(
    readonly uiService: UIService,
    readonly teamService: TeamService,
  ) {}

  roundEnd(result: Team | "draw") {
    const {
      name = result,
      color = '#fff',
    } = this.teamService.teams[result] || {}

    this.uiService.cef.call(Events["tdm.cef.winner"], name, color)

    return {name, color}
  }

  roundPrepare() {
    this.uiService.cef.call(Events["tdm.cef.winner"])
  }
}