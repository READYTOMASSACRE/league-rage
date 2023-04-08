import { event, eventable } from "../../league-core/client"
import { Events, Procs, tdm } from "../../league-core/src/types"

@eventable
export default class ArenaService {
  static arenas: Record<number, tdm.Arena> = {}

  @event(Events["tdm.player.change_name"])
	async loadArenas(payload?: string) {
		try {
			const arenas: tdm.Arena[] = JSON.parse(typeof payload !== 'undefined' ?
        payload :
        await mp.events.callRemoteProc(Procs["tdm.arena.get"])
      )
	
			ArenaService.arenas = arenas.reduce((acc, current) => {
				acc[current.id] = current
	
				return acc
			}, {} as Record<number, tdm.Arena>)
		} catch (err) {
			console.error(err)
		}
	}

  get arenas () {
    return ArenaService.arenas
  }
}