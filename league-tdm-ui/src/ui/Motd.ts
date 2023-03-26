import { event, eventable } from "../../../league-core/client";
import { ClientConfig, Enviroment, Events } from "../../../league-core/src/types";
import UIService from "../UIService";

@eventable
export default class Motd {
  public visible: boolean = false

  constructor(
    readonly config: ClientConfig,
    readonly uiService: UIService
  ) {}

  @event(Events["tdm.ui.ready"])
  ready() {
    this.toggle(true)
    mp.events.call(Events["tdm.chat.push"], {
      message: [
        ['[Server]:', '#ffd400'],
        [this.config.welcomeText.replace(':player', mp.players.local.name), '#fff'],
      ]
    }, Enviroment.client)
  }

  @event(Events["tdm.cef.motd"])
  toggle(t: boolean) {
    this.visible = t
    this.uiService.cef.call(Events["tdm.cef.motd"], ...this.data)
    this.uiService.setCursor(this.visible, 'motd')
  }

  get data() {
    return [this.config.motd, 'League 0.6.a', this.visible]
  }
}