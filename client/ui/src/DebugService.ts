import { command, commandable, logClient, console } from "../../../core/client";
import { Events } from "../../../core/src/types";
import PlayerService from "./PlayerService";

@commandable
export default class DebugService {
  constructor(readonly playerService: PlayerService) {}

  @logClient
  @command('get', { group: 'cdebug'})
  get(description: string, key: string) {
    try {
      if (!key) {
        return console.log(this.data)
      }

      console.log(key, this.playerService.local[key])
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