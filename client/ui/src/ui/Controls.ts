import { event, eventable } from "../../../league-core/client";
import { cef, Events } from "../../../league-core/src/types";
import { ILanguage, Lang } from "../../../league-lang/language";
import UIService from "../UIService";

@eventable
export default class Controls {
  public visible: boolean = false

  constructor(
    readonly uiService: UIService,
    readonly lang: ILanguage
  ) {}

  @event(Events["tdm.ui.ready"])
  ready() {
    if (this.uiService.cef) {
      this.toggle(true)
    }
  }
  
  toggle(t: boolean) {
    this.visible = t
    this.uiService.cef.call(Events["tdm.controls.data"], this.data, this.visible)
  }

  get data(): cef.Control[] {
    return [
      { key: 'B', description: this.lang.get(Lang["controls.b"]) },
      { key: 'T', description: this.lang.get(Lang["controls.t"]) },
      { key: 'Tab', description: this.lang.get(Lang["controls.tab"]) },
      { key: 'F2', description: this.lang.get(Lang["controls.f2"]) },
      // { key: 'F4', description: this.lang.get(Lang["controls.f4"]) }, todo add f4 keybindservice
    ]
  }
}