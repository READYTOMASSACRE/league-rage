import { event, eventable } from "../../league-core/client";
import { ClientConfig, Events } from "../../league-core/src/types";
import DummyService from "./DummyService";
import PlayerBlip from "./interactions/PlayerBlip";
import Spectate from "./interactions/Spectate";
import TeamSelector from "./interactions/TeamSelector";
import KeybindService from "./KeybindService";
import PlayerService from "./PlayerService";
import TeamService from "./TeamService";
import UIService from "./UIService";

@eventable
export default class InteractionService {
  private teamSelector: TeamSelector
  private spectate: Spectate
  private playerBlip: PlayerBlip

  constructor(
    readonly config: ClientConfig,
    readonly playerService: PlayerService,
    readonly teamService: TeamService,
    readonly dummyService: DummyService,
    readonly keybindService: KeybindService,
    readonly uiService: UIService,
  ) {
    this.teamSelector = new TeamSelector(
      config.interaction.selector, playerService,
      teamService, uiService, keybindService,
    )

    this.spectate = new Spectate(
      dummyService, keybindService,
      playerService, uiService
    )

    this.playerBlip = new PlayerBlip(playerService, teamService)
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