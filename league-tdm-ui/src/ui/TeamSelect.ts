import { event, eventable } from "../../../league-core/client";
import { Events } from "../../../league-core/src/types";
import KeybindService from "../KeybindService";
import UIService from "../UIService";

@eventable
export default class TeamSelect {
  constructor(readonly uiService: UIService, readonly keybindService: KeybindService) {}

  @event(Events["tdm.team.select_toggle"])
  teamSelectToggle({ team, toggle, color }: any = {}) {
    this.uiService.cef.call(Events["tdm.team.select_toggle"], team, color, toggle)
  }
}