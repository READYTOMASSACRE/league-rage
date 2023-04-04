import { event, eventable } from "../../league-core/client";
import { Events, Procs, tdm } from "../../league-core/src/types";
import console from "./helpers/console";
import PlayerService from "./PlayerService";
import ZoneService from "./ZoneService";

@eventable
export default class RoundService {
	constructor(
		readonly zoneService: ZoneService,
		readonly playerService: PlayerService,
		readonly arenas: Record<number, tdm.Arena>,
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
		this.playerService.spawnLobby()
	}

	@event(Events["tdm.round.remove"])
	roundRemove(id: number, manual?: boolean) {
		this.zoneService.disable()
		this.playerService.freezePosition(false)

		if (manual) {
			this.playerService.spawnLobby()
		}
	}

	getArenaById(id: number): tdm.Arena | undefined {
		return this.arenas[id]
	}

	@event(Events["tdm.round.pause"])
	roundPause(toggle: boolean) {
		this.playerService.freezePosition(toggle)
	}

	private enable(id: number) {
		const arena = this.getArenaById(id)
		
		if (arena && this.playerService.alive) {
			this.zoneService.disable()
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