import { event, eventable, logClient } from "../../../../core/client";
import { toMs } from "../../../../core/src/helpers";
import { Events } from "../../../../core/src/types";
import { EffectsConfig } from "../../../../core/src/types/ui";
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