import { event, eventable, logClient } from "../../league-core/client";
import { Events, IConfig } from "../../league-core/src/types";
import TeamSelector from "./interactions/TeamSelector";
import PlayerService from "./PlayerService";

@eventable
export default class InteractionService {
  private teamSelector: TeamSelector

  constructor(
    readonly config: IConfig,
    readonly playerService: PlayerService,
  ) {
    this.teamSelector = new TeamSelector(
      this.config.interaction.selector,
      this.config.team,
      this.playerService,
    )
  }

  @logClient
  @event(Events["tdm.team.select"])
  teamSelect() {
    this.teamSelector.run()
  }
}