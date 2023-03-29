import { event, eventable } from "../../../league-core/client";
import { Events, scoreboard } from "../../../league-core/src/types";
import { Entity, TeamConfig } from "../../../league-core/src/types/tdm";
import DummyService from "../DummyService";
import KeybindService, { key } from "../KeybindService";
import PlayerService from "../PlayerService";
import UIService from "../UIService";

@eventable
export default class Scoreboard {
  static key = 'scoreboard'
  public visible: boolean = false

  constructor(
    readonly config: TeamConfig,
    readonly uiService: UIService,
    readonly keybindService: KeybindService,
    readonly playerService: PlayerService,
    readonly dummyService: DummyService,
  ) {
    this.keybindService.unbind(key.tab, [true, false], Scoreboard.key)
    this.keybindService.bind(key.tab, [true, false], Scoreboard.key, () => this.toggle(mp.keys.isDown(key.tab)))
  }

  @event(Events["tdm.scoreboard.toggle"])
  toggle(visible: boolean) {
    this.visible = visible
    this.uiService.setCursor(visible, 'scoreboard')
    this.uiService.cef.call(Events['tdm.scoreboard.toggle'], this.visible)

    if (this.visible) {
      this.uiService.cef.call(Events["tdm.scoreboard.data"], this.data)
    }
  }

  private get data(): scoreboard.Data {
    return {
      players: this.playersData,
      teams: this.teamsData,
      arena: this.dummyService.get(Entity.ROUND, 'arena')
    }
  }

  private get playersData(): scoreboard.Player[] {
    return mp.players.toArray().map(player => {
      const statistic = this.playerService.getStatistic(player)
      const profile = this.playerService.getProfile(player)

      return {
        id: player.remoteId,
        name: player.name,
        current: player.id === mp.players.local.id,
        kills: statistic.kill,
        death: statistic.death,
        assists: statistic.assists,
        ping: player.ping, // todo fetch from server
        role: this.playerService.getVariable(player, 'team'),
        team: this.playerService.getVariable(player, 'team'),
        lvl: profile.lvl,
      }
    })
  }

  private get teamsData(): scoreboard.Team[] {
    return Object.entries(this.config).map(([team, config], index) => ({
      id: index,
      name: config.name,
      role: team,
      score: 0,
      color: config.color,
    }))
  }
}