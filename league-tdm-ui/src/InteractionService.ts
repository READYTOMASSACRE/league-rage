import { event, eventable, logClient } from "../../league-core/client";
import { Events, IConfig } from "../../league-core/src/types";
import DummyService from "./DummyService";
import Spectate from "./interactions/Spectate";
import TeamSelector from "./interactions/TeamSelector";
import KeybindService from "./KeybindService";
import PlayerService from "./PlayerService";

@eventable
export default class InteractionService {
  private teamSelector: TeamSelector
  private spectate: Spectate

  constructor(
    readonly config: IConfig,
    readonly playerService: PlayerService,
    readonly dummyService: DummyService,
    readonly keybindService: KeybindService,
  ) {
    this.teamSelector = new TeamSelector(
      this.config.interaction.selector,
      this.config.team,
      this.playerService,
    )

    this.spectate = new Spectate(dummyService, keybindService, playerService)
  }

  @logClient
  @event(Events["tdm.team.select"])
  teamSelect() {
    this.teamSelector.run()
  }

  @logClient
  @event(Events["tdm.spectate.start"])
  startSpectate(player: number) {
    this.spectate.run(player)
  }

  @logClient
  @event(Events["tdm.spectate.stop"])
  stopSpectate() {
    this.spectate.stop()
  }
}