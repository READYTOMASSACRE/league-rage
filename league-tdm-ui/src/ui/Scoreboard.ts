import { event, eventable, logClient } from "../../../league-core/client";
import { Events, scoreboard } from "../../../league-core/src/types";
import { Entity, TeamConfig } from "../../../league-core/src/types/tdm";
import DummyService from "../DummyService";
import KeybindService, { key } from "../KeybindService";
import PlayerService from "../PlayerService";
import UIService from "../UIService";

@eventable
export default class Scoreboard {
  private visible: boolean = false

  constructor(
    readonly config: TeamConfig,
    readonly uiService: UIService,
    readonly keybindService: KeybindService,
    readonly playerService: PlayerService,
    readonly dummyService: DummyService,
  ) {
    this.keybindService.unbind(key.tab, [true, false])
    this.keybindService.bind(key.tab, [true, false], () => this.toggle(mp.keys.isDown(key.tab)))
  }

  @event(Events["tdm.scoreboard.toggle"])
  toggle(visible: boolean) {
    this.visible = visible
    this.uiService.setCursor(visible, 'scoreboard')
    this.uiService.cef.call(Events['tdm.scoreboard.toggle'], this.visible)

    if (this.visible) {
      this.uiService.cef.call(Events["tdm.scoreboard.data"], this.getData())
    }
  }

  private getData(): scoreboard.Data {
    return {
      players: this.getPlayersData(),
      teams: this.getTeamsData(),
      arena: this.dummyService.get(Entity.ROUND, 'arena')
    }
  }

  private getPlayersData(): scoreboard.Player[] {
    return mp.players.toArray().map(player => ({
      id: player.remoteId,
      name: player.name,
      current: player.id === mp.players.local.id,
      kills: 0,
      death: 0,
      assists: 0,
      ping: player.ping,
      role: this.playerService.getVariable(player, 'team'),
      team: this.playerService.getVariable(player, 'team'),
      lvl: 0
    }))
  }

  private getTeamsData(): scoreboard.Team[] {
    return Object.entries(this.config).map(([team, config], index) => ({
      id: index,
      name: config.name,
      role: team,
      score: 0,
      color: config.color,
    }))
  }
}