import { event, eventable, console } from "../../../core/client";
import { Events, Procs, tdm } from "../../../core/src/types";
import ArenaService from "./ArenaService";
import PlayerService from "./PlayerService";
import ZoneService from "./ZoneService";

@eventable
export default class RoundService {
	constructor(
		readonly zoneService: ZoneService,
		readonly playerService: PlayerService,
		readonly arenaService: ArenaService,
	) {}

	@event(Events["tdm.round.start"])
	roundStart(id: number, players: number[]) {
		this.enable(id)
	}

	@event(Events["tdm.round.add"])
	roundAdd(_: number, manual: boolean, arenaId: number) {
		if (manual) {
			this.enable(arenaId)
		}
	}

	@event(Events["tdm.round.end"])
	roundEnd(id: number, result: tdm.Team | "draw") {
		this.zoneService.disable()
		this.playerService.freezePosition(false)
	}

	@event(Events["tdm.round.remove"])
	roundRemove(id: number, reason?: 'manual' | 'death') {
		this.zoneService.disable()
		this.playerService.freezePosition(false)
	}

	getArenaById(id: number): tdm.Arena | undefined {
		return this.arenaService.arenas[id]
	}

	@event(Events["tdm.round.pause"])
	roundPause(toggle: boolean) {
		this.playerService.freezePosition(toggle)
	}

	private enable(id: number) {
		this.zoneService.disable()

		const arena = this.getArenaById(id)
		if (arena && this.playerService.alive) {
			this.zoneService.enable(arena)
		}
	}

	static async getArenas() {
		try {
			const arenas: tdm.Arena[] = JSON.parse(await mp.events.callRemoteProc(Procs["tdm.arena.get"]))
	
			return arenas.reduce((acc, current) => {
				acc[current.id] = current
	
				return acc
			}, {} as Record<number, tdm.Arena>)
		} catch (err) {
			console.error(err)
		}
	}
}