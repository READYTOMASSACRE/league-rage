import { event, eventable } from "../../league-core/client";
import { ClientConfig, Events } from "../../league-core/src/types";
import DummyService from "./DummyService";
import Spectate from "./interactions/Spectate";
import TeamSelector from "./interactions/TeamSelector";
import KeybindService from "./KeybindService";
import PlayerService from "./PlayerService";
import UIService from "./UIService";

@eventable
export default class InteractionService {
  private teamSelector: TeamSelector
  private spectate: Spectate

  constructor(
    readonly config: ClientConfig,
    readonly playerService: PlayerService,
    readonly dummyService: DummyService,
    readonly keybindService: KeybindService,
    readonly uiService: UIService,
  ) {
    this.teamSelector = new TeamSelector(
      config.interaction.selector, config.team,
      playerService, uiService, keybindService,
    )

    this.spectate = new Spectate(
      dummyService, keybindService,
      playerService, uiService
    )
  }

  @event(Events["tdm.team.select"])
  teamSelect() {
    this.teamSelector.run()
  }

  @event(Events["tdm.spectate.start"])
  startSpectate(player: number) {
    this.spectate.run(player)
  }

  @event([Events["tdm.spectate.stop"], Events["tdm.round.end"]])
  stopSpectate() {
    this.spectate.stop()
  }
}