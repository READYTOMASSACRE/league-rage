import { command, commandable, event, eventable } from "../../../../core/client";
import { ClientConfig, Enviroment, Events } from "../../../../core/src/types";
import { keyPriority } from "../@types/common";
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
  ) {}

  @event(Events["tdm.ui.ready"])
  ready() {
    this.toggle(true)
    this.uiService.cef.call(Events["tdm.cef.gamemode"], this.config.name + ' // ' + this.config.version)
  }

  @event(Events["tdm.cef.motd"])
  toggle(t: boolean = false) {
    this.visible = t
    this.uiService.cef.call(Events["tdm.cef.motd"], ...this.data)
    this.uiService.setCursor(this.visible, Motd.key)
    this.bindKeys(this.visible)
  }

  @command('motd')
  motdCmd() {
    this.toggle(true)
  }

  bindKeys(t: boolean = true) {
    return t ?
      this.keybindService.bind(key.enter, true, Motd.key, () => this.toggle(false), {
        stopPropagation: true,
        priority: keyPriority.highest,
      }) :
      this.keybindService.unbind(key.enter, true, Motd.key)
  }

  get data() {
    return [this.config.motd, this.config.version, this.visible]
  }
}