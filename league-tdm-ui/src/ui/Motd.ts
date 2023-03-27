import { command, commandable, event, eventable, logClient } from "../../../league-core/client";
import { ClientConfig, Enviroment, Events } from "../../../league-core/src/types";
import { keyPriority } from "../@types/common";
import console from "../helpers/console";
import KeybindService, { key } from "../KeybindService";
import UIService from "../UIService";

@commandable
@eventable
export default class Motd {
  static key = 'motd'

  public visible: boolean = false

  constructor(
    readonly config: ClientConfig,
    readonly uiService: UIService,
    readonly keybindService: KeybindService,
  ) {
    this.keybindService.bind(key.enter, true, Motd.key, () => this.toggle(false), {
      stopPropagation: true,
      priority: keyPriority.highest,
    })
  }

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

  @logClient
  @event(Events["tdm.cef.motd"])
  toggle(t: boolean = false) {
    this.visible = t
    this.uiService.cef.call(Events["tdm.cef.motd"], ...this.data)
    this.uiService.setCursor(this.visible, Motd.key)

    if (!this.visible) {
      this.keybindService.unbind(key.enter, true, Motd.key)
    }
  }

  @command('motd')
  motdCmd() {
    this.toggle(true)
  }

  get data() {
    return [this.config.motd, 'League 0.6a', this.visible]
  }
}