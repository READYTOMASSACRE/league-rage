import { event, eventable, logClient } from "../../league-core/client";
import { Events, Procs, tdm } from "../../league-core/src/types";
import ZoneService from "./ZoneService";

@eventable
export default class RoundService {
	public arenas: Record<number, tdm.Arena> = {}

	constructor(readonly zoneService: ZoneService) {
		this.load()
	}

	@logClient
	@event(Events["tdm.round.start"])
	roundStart(id: number, players: number[]) {
		const arena = this.getArenaById(id)

		if (arena) {
			this.zoneService.enable(arena)
		}

		return arena
	}

	@logClient
	@event(Events["tdm.round.end"])
	roundEnd(id: number, result: tdm.Team | "draw") {
		this.zoneService.disable()

		return result
	}

	getArenaById(id: number): tdm.Arena | undefined {
		return this.arenas[id]
	}

	private async load() {
		try {
			const arenas: tdm.Arena[] = await mp.events.callRemoteProc(Procs["tdm.arena.getAll"])
	
			this.arenas = arenas.reduce((acc, current) => {
				acc[current.id] = current
	
				return acc
			}, {} as Record<number, tdm.Arena>)
		} catch (err) {
			mp.console.logError(err)
		}
	}
}