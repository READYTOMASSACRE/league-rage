import { event, eventable, logClient } from "../../../league-core/client";
import { toMs } from "../../../league-core/src/helpers";
import { Events } from "../../../league-core/src/types";
import { EffectsConfig } from "../../../league-core/src/types/ui";
import PlayerService from "../PlayerService";
import UIService from "../UIService";

@eventable
export default class Effects {
  constructor(
    readonly config: EffectsConfig,
    readonly uiService: UIService,
    readonly playerService: PlayerService,
  ) {}

  @logClient
  @event(Events["tdm.player.kill"])
  playerKill(victimId: number, killerId: number) {
    if (this.playerService.local.remoteId === killerId) {
      mp.game.audio.playSoundFrontend(-1, "Camera_Shoot", "Phone_Soundset_Franklin", true)
      this.uiService.cef.call(Events["tdm.cef.effects"], 'kill')
    }
  }

  @event("playerDeath")
  playerDeath() {
    mp.game.graphics.startScreenEffect("DeathFailOut", toMs(this.config.death), false)
  }
}