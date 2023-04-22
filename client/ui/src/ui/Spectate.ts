import PlayerService from "../PlayerService";
import UIService from "../UIService";
import { CurrentPlayer } from '../../../../core/src/types/spectate'
import { toPlayerStat } from "../../../../core/src/helpers/toStatistic";
import { Events } from "../../../../core/src/types";

export default class Spectate {
  public visible: boolean = false
  private player: PlayerMp = mp.players.local

  constructor(
    readonly uiService: UIService,
    readonly playerService: PlayerService,
  ) {}

  toggle(t: boolean, id?: number) {
    this.visible = t

    const player = mp.players.atRemoteId(id)
    if (mp.players.exists(player)) {
      this.player = player
    }

    this.uiService.cef.call(Events["tdm.cef.spectate"], this.data)
  }

  get data(): CurrentPlayer {
    const specatePlayers = this.playerService.getSpectatePlayers(this.player)

    return {
      ...toPlayerStat(this.playerService.getStatistic(this.player)),
      id: this.player.remoteId,
      name: this.player.name,
      visible: this.visible,
      spectate: specatePlayers.map(player => player.name),
    }
  }
}