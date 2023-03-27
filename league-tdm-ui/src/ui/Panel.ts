import { event, eventable, logClient } from "../../../league-core/client";
import { Events, Procs, userId } from "../../../league-core/src/types";
import { PanelData } from "../../../league-core/src/types/statistic";
import console from "../helpers/console";
import KeybindService, { key } from "../KeybindService";
import UIService from "../UIService";

@eventable
export default class Panel {
  static key = 'panel'

  public visible: boolean = false

  constructor(
    readonly uiService: UIService,
    readonly keybindService: KeybindService
  ) {
    this.request = this.request.bind(this)
    this.keybindService.unbind(key.vk_f2, true, Panel.key)
    this.keybindService.bind(key.vk_f2, true, Panel.key, this.request)
  }

  @logClient
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

  async sendData(userId?: userId, dateFrom?: number, dateTo?: number) {
    try {
      const profile = JSON.parse(await mp.events.callRemoteProc(Procs["tdm.statistic.profile.get"], userId))
      const rounds = JSON.parse(await mp.events.callRemoteProc(Procs["tdm.statistic.round.get"], userId, dateFrom, dateTo))
  
      const data: PanelData = {
        profile,
        rounds,
        visible: this.visible,
      }
  
      this.uiService.cef.call(Events["tdm.cef.panel"], data)
    } catch (err) {
      console.error(err)
    }
  }
}