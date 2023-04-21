import { event, eventable, logClient, console } from "../../../league-core/client";
import { Events, Procs, userId } from "../../../league-core/src/types";
import { ListReponse, ListRequest, PanelData, Round } from "../../../league-core/src/types/statistic";
import ArenaService from "../ArenaService";
import KeybindService, { key } from "../KeybindService";
import PlayerService from "../PlayerService";
import UIService from "../UIService";

@eventable
export default class Panel {
  static key = 'panel'

  public visible: boolean = false

  constructor(
    readonly title: string,
    readonly uiService: UIService,
    readonly keybindService: KeybindService,
    readonly arenaService: ArenaService,
    readonly playerService: PlayerService,
  ) {
    this.request = this.request.bind(this)
    this.keybindService.unbind(key.vk_f2, true, Panel.key)
    this.keybindService.bind(key.vk_f2, true, Panel.key, this.request)
  }

  @event(Events["tdm.cef.panel"])
  request(t?: boolean, ...args: any[]) {
    this.visible = t ?? !this.visible
    this.uiService.setCursor(this.visible, Panel.key)

    if (this.visible) {
      this.sendData(...args.filter(arg => arg !== false))
    } else {
      this.uiService.cef.call(Events["tdm.cef.panel"], false)
    }
  }

  @event(Events["tdm.cef.vote.arena_request"])
  voteArenaRequest(id: string | number) {
    mp.events.callRemote(Events["tdm.cef.vote.arena_request"], id)
  }

  @event(Events["tdm.cef.match.request"])
  async matchRequest(limit?: number, offset?: number, dateFrom?: number, dateTo?: number) {
    try {
      const response = await this.roundRequest({ limit, offset, dateFrom, dateTo })
      this.uiService.cef.call(Events["tdm.cef.match.request"], response)
    } catch (err) {
      console.error(err.stack)
    }
  }

  async sendData(dateFrom?: number, dateTo?: number) {
    try {
      const profile = await this.profileRequest()
      const roundsTotal = await this.roundTotalRequest({ dateFrom, dateTo })
  
      const data: PanelData = {
        profile,
        roundsTotal,
        visible: this.visible,
        arenas: this.arenaService.arenas,
        title: this.title,
      }
  
      this.uiService.cef.call(Events["tdm.cef.panel"], data)
    } catch (err) {
      console.error(err.stack)
    }
  }

  async profileRequest(userId?: userId) {
    try {
      userId = userId ?? this.playerService.getVariable(this.playerService.local, 'userId')

      return JSON.parse(await mp.events.callRemoteProc(Procs["tdm.statistic.profile.get"], userId))
    } catch (err) {
      console.error(err.stack)
    }
  }

  async roundRequest({
    userId,
    dateFrom,
    dateTo,
    limit = 20,
    offset = 0,
  }: ListRequest = {}): Promise<ListReponse<Round>> {
    try {
      return JSON.parse(await mp.events.callRemoteProc(Procs["tdm.statistic.round.get"], ...[
        userId ?? this.playerService.getVariable(this.playerService.local, 'userId'),
        limit,
        offset,
        dateFrom,
        dateTo
      ]))

    } catch (err) {
      console.error(err.stack)
      return { list: [], total: 0 }
    }
  }

  @logClient
  async roundTotalRequest({
    userId,
    dateFrom,
    dateTo,
  }: ListRequest): Promise<number> {
    try {
      return await mp.events.callRemoteProc(Procs["tdm.statistic.round.total"], ...[
        userId ?? this.playerService.getVariable(this.playerService.local, 'userId'),
        dateFrom,
        dateTo
      ]) ?? 0
    } catch (err) {
      console.error(err.stack)
      return 0
    }
  }
}