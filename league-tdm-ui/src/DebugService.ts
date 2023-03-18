import { command, commandable } from "../../league-core/client";
import { Events } from "../../league-core/src/types";
import console from "./helpers/console";
import PlayerService from "./PlayerService";

@commandable
export default class DebugService {
  constructor(readonly playerService: PlayerService) {}

  @command('data', { group: 'cdebug'})
  getData(fullText: string, description: string, key: string) {
    try {
      if (!key) {
        return mp.events.call(Events["tdm.chat.push"], this.data)
      }

      return mp.events.call(Events["tdm.chat.push"], this.playerService.local[key])
    } catch (err) {
      console.error(err.stack)
    }
  }

  @command('clear', { group: 'cdebug' })
  clear() {
    mp.events.call(Events["tdm.cef.debug"], [])
  }

  private get data() {
    return {}
  }
}