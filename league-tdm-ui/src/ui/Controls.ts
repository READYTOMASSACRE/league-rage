import { event, eventable } from "../../../league-core/client";
import { cef, Events } from "../../../league-core/src/types";
import { ILanguage, Lang } from "../../../league-lang/language";
import UIService from "../UIService";

@eventable
export default class Controls {
  constructor(
    readonly uiService: UIService,
    readonly lang: ILanguage
  ) {}

  @event(Events["tdm.ui.ready"])
  ready() {
    if (this.uiService.cef) {
      this.uiService.cef.call(Events["tdm.controls.data"], this.data)
    }
  }

  get data(): cef.Control[] {
    return [
      { key: 'B', description: this.lang.get(Lang["controls.b"]) },
      { key: 'T', description: this.lang.get(Lang["controls.t"]) },
      { key: 'Tab', description: this.lang.get(Lang["controls.tab"]) },
      { key: 'F4', description: this.lang.get(Lang["controls.f4"]) },
    ]
  }
}