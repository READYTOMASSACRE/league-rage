import { event, eventable } from "../../../league-core/client";
import { Events, IConfig } from "../../../league-core/src/types";
import UIService from "../UIService";

@eventable
export default class Motd {
  public visible: boolean = false

  constructor(
    readonly motd: string,
    readonly uiService: UIService
  ) {}

  @event(Events["tdm.ui.ready"])
  ready() {
    this.toggle(true)
  }

  @event(Events["tdm.cef.motd"])
  toggle(t: boolean) {
    this.visible = t
    this.uiService.cef.call(Events["tdm.cef.motd"], ...this.data)
    this.uiService.setCursor(this.visible, 'motd')
  }

  get data() {
    return [this.motd, 'League 0.6.a', this.visible]
  }
}